# Design: Lens System — Phase 1

## Key decisions

### 1. Lens = projection from a hierarchy matrix, not a new stored entity

A lens is *derived*, never persisted in Phase 1. We compute lenses from data that already
exists, so nothing in the format changes and old documents keep working.

```ts
interface LensEdge { parent: string; child: string }  // concept names
interface Lens { id: string; name: string; icon: string; edges: LensEdge[] }
```

Two lenses are seeded:

- **Taxonomy** (`id: 'taxonomy'`, icon `layers`): one edge per concept with a resolvable
  `category_id`. Includes `type: category` folders as parents, so it reproduces today's tree
  faithfully — but as a *removable lens*, not a privileged field.
- **Hierarchy Chain** (`id: 'hierarchy'`, icon `workflow`): consecutive edges of the existing
  `hierarchyConcepts` sequence. This is the instance-hierarchy spine surfaced at concept level.

This keeps the architecture open to N lenses (Phase 2 adds named matrix-backed lenses) while
Phase 1 ships with real, working data.

### 2. Neighborhood, not full tree

`getConceptLenses(name)` returns, per lens that contains the concept, only the **local
neighborhood**:

```ts
{ lens, parents: string[], children: string[] }
```

Lenses where the concept has neither parent nor child are filtered out. This avoids stacking
full trees (the disorientation risk) — each lens is a compact strip `parents → ● self → children`.

### 3. Sidebar transforms (does not split the screen)

The "Concepts" tab has two states, `list` and `lens`, swapped with the existing slide
transition:

- `list`: flat list of `metamodelStore.concepts` in document order + the existing
  Relations & Setup buttons.
- `lens`: a context anchor (active concept + back arrow) over the stacked `ConceptLensPanel`.

Selecting a concept from the flat list enters `lens`. Back returns to `list`. The instance-level
"Hierarchy" tab is left untouched (separate, instance-editing concern). The previous
auto-switch-to-Hierarchy watch is removed so concept selection drives the lens view instead.

### 4. Why only hierarchy matrices become lenses

Relational matrices carry valued associations (`Max/High/Neutral`), not parent-child edges.
Rendering them as a tree would draw a tree over a web. They stay out of the lens panel
(surfaced elsewhere as associations), per spec §6.1 vs §6.2.

## Risks

- `hierarchyConcepts` is a single linear chain today; the Hierarchy Chain lens is therefore
  linear. That's expected — richer multi-lens content arrives in Phase 2 with named matrices.
- Removing the auto-switch watch changes selection behavior for hierarchy concepts. The
  instance Hierarchy tab remains reachable via its tab button.
