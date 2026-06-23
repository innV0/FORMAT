# Proposal: Lens System (multi-hierarchy navigation)

## Status

Draft — Phase 1 (UI foundation) implemented on branch `feat/lens-system`.

## Problem

The metamodel exposes a **single** concept hierarchy: the category tree, derived from
each concept's `category_id` (a single-parent pointer). That one tree is overloaded with
three semantically distinct jobs:

1. **Navigation folders** — `type: category` concepts (Market, Solutions, Organization) are
   just containers, not real concepts.
2. **True composition** — e.g. `Products and services → Components / Features`.
3. **Loose thematic grouping** — e.g. everything customer-related dumped under `Segments`
   (`Problems`, `Value propositions`, `Messages`, `Channels`...). A problem is **not a part
   of** a segment; it *relates to* it. The category tree conflates "is-a-child-of" with
   "relates-to".

Meanwhile the *real* semantic relationships already live in matrices
(`Problems → Value propositions → Messages → Channels`), but:

- coverage is partial and asymmetric (some relations are matrices, others are `category_id`);
- the document body is already **flat** (every concept is a sibling H1, per spec §5) — the
  tree only exists as a frontmatter-derived reconstruction in the sidebar.

The spec itself (§9.2 metacircularity) already declares that hierarchies are expressed as
**hierarchy matrices** (`concept → element`, `element → Field`). The metamodel only half-applied
that rule: it used hierarchy matrices for instances but a privileged `category_id` field for
concept grouping.

## Proposal

Stop treating the category tree as THE structure. Introduce **lenses**: named projections of
the concepts, each backed by a hierarchy matrix. A concept has no intrinsic position; hierarchy
becomes a *view* you apply.

- **The concept list is flat by default** (mirrors the Markdown body and the file's truth).
- **Selecting a concept transforms the sidebar** into the stacked **lens neighborhoods** that
  contain it: for each lens, show the local neighborhood `parents → ● concept → children`,
  one strip per lens. This reuses the existing slide/anchor/back transform pattern.
- **The current category grouping is preserved as the default "Taxonomy" lens**, reconstructed
  from `category_id` — no longer a privileged field, just one lens among others.
- **Only hierarchy matrices produce lenses.** Relational matrices (valued N-to-N) are
  associations, not navigation, and are surfaced separately.

## Non-goals (this change)

- Removing `category_id` from the format. Phase 1 keeps it as the source of the Taxonomy lens.
- Authoring UI to create/edit arbitrary named lens matrices.
- Bumping the spec version. The format remains V_0-1-1 compatible; lenses are derived.

## Phasing

- **Phase 1 (this change):** UI foundation — flat concept list, `lenses` abstraction derived
  from existing data (Taxonomy from `category_id`, Hierarchy Chain from `hierarchyConcepts`),
  stacked neighborhood panel on selection. No format/parser change. Backward compatible.
- **Phase 2 (future):** First-class named hierarchy matrices in the frontmatter so users can
  declare multiple concept-level lenses; parser read/write.
- **Phase 3 (future):** Demote `category_id` to a generated Taxonomy lens matrix; spec bump
  to V_0-1-2 documenting lenses as the canonical hierarchy mechanism.

## Impact

- `src/types/index.ts` — add `LensEdge`, `Lens`.
- `src/stores/metamodel.ts` — add `lenses` computed + `getConceptLenses(name)`.
- `src/components/layout/LeftSidebar.vue` — flat Concepts list + lens transform.
- `src/components/editor/ConceptLensPanel.vue` (new) — stacked neighborhood strips.
