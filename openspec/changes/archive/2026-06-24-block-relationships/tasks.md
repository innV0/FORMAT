# Tasks: Block Relationships

## Phase 1 — Composable

- [x] Create `src/composables/useBlockRelationships.ts`
- [x] Implement wikilink extraction from `description` text (`/\[\[(.+?)\]\]/g`)
- [x] Implement reference field extraction from `fields` record (only `reference` type fields)
- [x] Build reactive index from `modelTree` + `modelTextData` using `computed`
- [x] Expose `getIncoming(blockName)` and `getOutgoing(blockName)` reactive getters

## Phase 2 — UI Component

- [x] Create `src/components/editor/BlockRelationships.vue`
- [x] Render "Referenced by" (incoming) section with clickable `BlockPill` items
- [x] Render "References" (outgoing) section with clickable `BlockPill` items
- [x] Hide section entirely when both lists are empty
- [x] Wire click handlers to `selectTreeNode` / `selectConcept` based on block kind

## Phase 3 — Integration

- [x] Import `useBlockRelationships` in `BlockSheet.vue`
- [x] Render `<BlockRelationships>` between `renderedDescription` and `<ConceptRelationshipGraph>`
- [x] Only render in Expanded (non-edit) state

## Phase 4 — Tests

- [x] Create `src/composables/__tests__/useBlockRelationships.test.ts`
- [x] Test wikilink extraction from descriptions (single, multiple, none, self-reference)
- [x] Test reference field extraction (value present, empty, mixed field types)
- [x] Test index construction (build on load, correct incoming/outgoing)
- [x] Test index updates on mutation (description edit, block rename, block deletion)
- [x] 21 tests passing, 0 failed
