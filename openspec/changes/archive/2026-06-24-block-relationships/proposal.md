# Proposal: Block Wikilink Relationships Display

## Intent

Users can create wikilinks `[[BlockName]]` in descriptions and reference-type fields to link blocks, but there is no way to see these relationships. When editing a block, users cannot tell which other blocks reference it (incoming) or which blocks it references (outgoing). This creates a navigation and comprehension gap — the model's relational structure is invisible in the work display.

## Scope

### In Scope
- Pre-computed relationship index in the document store (Map<blockName, { incoming, outgoing }>)
- Incremental index updates on: add node, delete node, rename block, edit description, edit reference field
- `BlockRelationships` Vue component rendering incoming/outgoing lists in BlockSheet
- Insertion point: BlockSheet.vue between description and ConceptRelationshipGraph (line ~174)
- Clickable block names in relationship list that navigate to the referenced block

### Out of Scope
- Graph visualization of relationships (ConceptRelationshipGraph already exists)
- Bidirectional link creation (user must manually type wikilinks)
- Filtering, searching, or exporting relationships
- Matrix or table views of relationships
- Persistence changes — relationships are derived from existing data

## Capabilities

### New Capabilities
- `block-relationships`: Incoming/outgoing wikilink relationship display in BlockSheet

### Modified Capabilities
- `block-display-system`: REQ-06 (BlockSheet) gains a new relationship section below the description in Expanded state

## Approach

1. **Store index** (`useRelationshipIndex` composable):
   - Walk all tree nodes + text data on document load to build initial index
   - Expose `getIncoming(blockName)` and `getOutgoing(blockName)` reactive getters
   - Hook into existing store mutations (addNode, deleteNode, renameBlock, updateNodeDescription, updateNodeField) to incrementally update the index

2. **UI component** (`BlockRelationships.vue`):
   - Props: `blockName`, `blockKind`
   - Two sections: "Referenced by" (incoming) and "References" (outgoing)
   - Each item is a `BlockPill` with click handler to select the target block
   - Empty state: no section rendered when both lists are empty

3. **Integration** in `BlockSheet.vue`:
   - Import and place `<BlockRelationships>` between `renderedDescription` div and `<ConceptRelationshipGraph>`
   - Only rendered in Expanded (non-edit) state

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/composables/useRelationshipIndex.ts` | New | Pre-computed relationship index composable |
| `src/components/editor/BlockRelationships.vue` | New | UI component for rendering relationships |
| `src/components/editor/BlockSheet.vue` | Modified | Import and render BlockRelationships |
| `src/stores/document.ts` | Modified | Expose hooks for index invalidation on mutations |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Performance on large documents (100+ blocks) | Medium | Index is O(N) build, O(1) lookup; incremental updates are O(affected nodes) only |
| Stale index after concurrent edits | Low | Index recomputes on same reactive tick as store mutations |
| Name collisions (two blocks with same name) | Low | Index uses block name as key; display shows concept type to disambiguate |

## Rollback Plan

- Remove `BlockRelationships.vue` import from `BlockSheet.vue`
- Remove `useRelationshipIndex.ts` composable
- Remove index hooks from `document.ts`
- No data changes — all relationship data is derived from existing wikilinks and reference fields

## Dependencies

- None — builds entirely on existing wikilink and reference field infrastructure

## Success Criteria

- [ ] BlockSheet in Expanded state shows "Referenced by" section when other blocks wikilink to the current block
- [ ] BlockSheet in Expanded state shows "References" section when the current block wikilinks to or references other blocks
- [ ] Clicking a relationship item navigates to/selects the target block
- [ ] Index updates reactively when a wikilink is added/removed in a description
- [ ] Index updates reactively when a reference field value changes
- [ ] Empty relationship state renders nothing (no empty sections)
- [ ] No performance regression on documents with <50 blocks
