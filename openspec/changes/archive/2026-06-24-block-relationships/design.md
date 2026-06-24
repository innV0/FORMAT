# Design: Block Wikilink Relationships

## Technical Approach

Build a pre-computed relationship index on `modelTree` and `modelTextData`, expose reactive getters via a composable, and render a new `BlockRelationships` section in `BlockSheet.vue` expanded view. Index is built once on document load and incrementally updated when mutations affect wikilinks or reference fields.

## Architecture Decisions

### 1. Index location: computed in document store vs. standalone composable

| Approach | Tradeoff | Decision |
|----------|----------|----------|
| Standalone composable with internal state | Loose coupling, but must react to store changes externally — easy to get stale | Rejected |
| Computed property inside document store | Reuses existing reactive refs, updates automatically, but grows store | Rejected |
| **Composable reading store reactively** | Store stays lean, composable builds index from `modelTree` + `modelTextData` + `metamodelStore.concepts` via `computed`, updates automatically on any store mutation | **Chosen** |

**Rationale**: Vue `computed` from reactive store refs re-evaluates lazily on dependency change — no manual invalidation hooks needed. This eliminates the complexity of patching `renameBlock`, `addTreeRoot`, `deleteTreeNode`, etc.

### 2. Index key: block name vs. block id

| Approach | Tradeoff | Decision |
|----------|----------|----------|
| `Map<string, BlockRelationships>` keyed by block name | Simple, matches existing rename regex pattern `[[$name]]`; breaks on duplicate names | **Chosen** (with disambiguation via concept type in UI) |
| `Map<string, BlockRelationships>` keyed by block id | No collision risk; but wikilinks use names, not ids — would require name→id lookup everywhere | Rejected |

**Rationale**: Wikilinks in markdown are `[[BlockName]]`, not `[[block-id]]`. Keying by name keeps extraction trivial and matches the existing `renameBlock` pattern (line 192 in document.ts). Duplicate names disambiguated in UI via concept type prefix (already done by `BlockPill`'s `conceptLabel`).

### 3. Text block extraction: scan modelTextData vs. only modelTree

| Approach | Tradeoff | Decision |
|----------|----------|----------|
| Only scan `modelTree` | Misses list items and concept-level blocks in `modelTextData` | Incomplete |
| **Scan both `modelTree` + `modelTextData`** | Covers all blocks; slightly larger initial scan | **Chosen** |

**Rationale**: `modelTextData` holds list-item blocks (`<!-- block: X --> BlockName`) and concept-level blocks. A block referencing `[[SomeItem]]` where `SomeItem` is a list item must be found.

## Data Flow

```
modelTree ─────┐
                ├──→ useBlockRelationships() ──→ BlockRelationships.vue
modelTextData ──┘     (computed index)              │
                                                   ↓
                                              BlockPill (clickable)
                                                   │
                                                   ↓
                                              selectTreeNode / selectConcept
```

1. **Load**: `useBlockRelationships()` creates a `computed` that walks `documentStore.modelTree` (recursive) + `documentStore.modelTextData` (entries) to build `Map<string, BlockRelationships>`.
2. **Lookup**: Composable exposes `getIncoming(name)` and `getOutgoing(name)` — both return `ComputedRef<RelationshipItem[]>`.
3. **Mutate**: Any store mutation that changes `modelTree` or `modelTextData` triggers Vue's reactivity — `computed` re-evaluates lazily. No manual hooks.
4. **Render**: `BlockRelationships.vue` receives `blockName` prop, calls getters, renders `BlockPill` list.
5. **Navigate**: Click on a pill calls `documentStore.selectTreeNode()` (instance) or `documentStore.selectConcept()` (concept).

## Data Structures

```ts
// src/composables/useBlockRelationships.ts

interface RelationshipItem {
  name: string        // block name
  conceptType: string // e.g. "Stakeholders", "Channels"
  kind: BlockKind     // 'concept' | 'instance'
  blockId?: string    // TreeNode id (for tree instances)
}

interface BlockRelationships {
  incoming: RelationshipItem[]  // blocks that reference this block
  outgoing: RelationshipItem[]  // blocks this block references
}

// Composable API
function useBlockRelationships(): {
  getIncoming: (blockName: string) => ComputedRef<RelationshipItem[]>
  getOutgoing: (blockName: string) => ComputedRef<RelationshipItem[]>
}
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/composables/useBlockRelationships.ts` | Create | Index composable: builds `Map<string, BlockRelationships>` from store state |
| `src/components/editor/BlockRelationships.vue` | Create | UI component: renders "Referenced by" and "References" sections with clickable BlockPills |
| `src/components/editor/BlockSheet.vue` | Modify | Import `useBlockRelationships`, render `<BlockRelationships>` between `renderedDescription` and `<ConceptRelationshipGraph>` in expanded read-mode |

## Integration Points

**BlockSheet.vue** (line ~174, expanded read-mode template):
```html
<!-- After renderedDescription div, before ConceptRelationshipGraph -->
<BlockRelationships
  :block-name="block.name"
  :block-kind="kind"
  :concept-type="conceptType"
/>
```

**No store changes needed** — the composable reads existing reactive refs (`modelTree`, `modelTextData`, `metamodelStore.concepts`) directly. The `renameBlock` method already updates wikilinks and reference values in-tree (lines 191-235), which Vue's reactivity propagates automatically.

## Extraction Algorithm

For each node in `modelTree` (recursive):
1. Extract wikilinks from `node.description` via `/\[\[(.+?)\]\]/g` → outgoing names
2. Look up concept fields from `metamodelStore.getConceptByName(node.type).fields`
3. For each `field.type === 'reference'` where `node.fields[field.name]` is non-empty → outgoing name
4. Add node to index as an outgoing entry keyed by each extracted name

For each entry in `modelTextData` (concept-level blocks):
1. Parse `<!-- block: concepts --> BlockName` → block name
2. Extract wikilinks from the text value → outgoing names
3. Add as outgoing entry for concept-level block

Build reverse map: for each outgoing entry `(A → B)`, add `A` to `B`'s incoming list.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Wikilink extraction regex, index construction, incoming/outgoing correctness | Pure function tests with mock `modelTree` + `modelTextData` |
| Unit | Self-references, duplicate names, empty descriptions | Edge case matrix |
| Component | `BlockRelationships.vue` renders correct pills, hides when empty | `@vue/test-utils` mount with mock composable |
| Component | Click handler calls `selectTreeNode` / `selectConcept` | Spy on emit/store action |
| Integration | Index updates after `renameBlock`, `addTreeRoot`, `deleteTreeNode` | Mount `BlockSheet`, trigger store mutations, assert DOM updates |
| Type check | `vue-tsc --noEmit` passes | Build-time verification |

## Migration / Rollout

No migration required. All data is derived from existing wikilinks and reference fields. The index is computed, not persisted.

## Open Questions

- None — all design decisions have clear rationale from codebase patterns.
