# Tasks: Codebase Cleanup and Refactoring

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~350-450 |
| 400-line budget risk | Medium |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (delete + types fix) → PR 2 (utilities + consumers) |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Delete dead files + fix duplicate types | PR 1 | ~100 lines changed, zero risk |
| 2 | Create shared utilities + update consumers | PR 2 | ~250-350 lines changed, core refactor |

## Phase 1: Delete Dead Files

- [x] 1.1 Delete `test_output.txt`, `test_run_debug.txt`, `test_run_debug_utf8.txt`, `test_run_plain.txt`, `test_run_utf8.txt` from root
- [x] 1.2 Delete `.agents - Copy/` directory recursively
- [x] 1.3 Delete `src/assets/debug.js`
- [x] 1.4 Delete `relational_matrix_spec.md` from root

## Phase 2: Fix Duplicate Types

- [x] 2.1 Remove duplicate `PerspectiveEdge` interface at `src/types/index.ts:119-122`
- [x] 2.2 Remove duplicate `Perspective` interface at `src/types/index.ts:124-129`
- [x] 2.3 Remove duplicate `PerspectiveNeighborhood` interface at `src/types/index.ts:131-135`

## Phase 3: Create Shared Utility Modules

- [x] 3.1 Create `src/utils/id.ts` with `export const generateId = (): string => crypto.randomUUID()`
- [x] 3.2 Create `src/utils/tree.ts` with `findNodeByName(nodes, name)` and `findParentNodeOfType(nodes, typeName)`
- [x] 3.3 Create `src/utils/chain.ts` with `deriveChain(concepts, taxonomyEdges)`
- [x] 3.4 Create `src/utils/constants.ts` with `DEFAULT_FORMAT_VERSION`, `DEFAULT_TEMPLATE_NAME`, `DEFAULT_TEMPLATE_VERSION`, `MAX_MARKER_SCORE`, `MARKER_CYCLE_COUNT`
- [x] 3.5 Add `stripMarkdownFormatting(s)` to `src/utils/sanitize.ts`

## Phase 4: Update Consumers to Use New Utilities

- [x] 4.1 Replace `Math.random().toString(36).substr(2, 9)` with `generateId()` in document.ts (2 places)
- [x] 4.2 Replace `Math.random().toString(36).substr(2, 9)` with `generateId()` in markdownParser.ts (9 places)
- [x] 4.3 Replace `Math.random().toString(36).substr(2, 9)` with `generateId()` in TextEditor.vue (1 place)
- [x] 4.4 Replace inline `findNodeByName` in App.vue with import from utils/tree.ts
- [x] 4.5 Replace inline `findNodeByName` in BlockRelationships.vue with import from utils/tree.ts
- [x] 4.6 Replace inline `findNodeByName` in markdownParser.ts with import from utils/tree.ts
- [x] 4.7 Replace inline `findParentNodeOfType` in markdownParser.ts (2 copies) with import from utils/tree.ts
- [x] 4.8 Replace chain derivation in metamodel.ts with import from utils/chain.ts
- [x] 4.9 Replace chain derivation in markdownParser.ts (2 copies) with import from utils/chain.ts
- [x] 4.10 Replace inline `slugify` in document.ts:180 with import from sanitize.ts
- [x] 4.11 Replace magic `'V_0-1-4'` in document.ts (4 places) with `DEFAULT_FORMAT_VERSION`
- [x] 4.12 Replace magic `'business'` default in document.ts with `DEFAULT_TEMPLATE_NAME`
- [x] 4.13 Replace `% 4` in BlockPill.vue and BlockSheet.vue with `MARKER_CYCLE_COUNT`
- [x] 4.14 Replace `cleanName` in markdownParser.ts with `stripMarkdownFormatting` from sanitize.ts
- [x] 4.15 Replace local `Marker` interface in MarkerTooltip.vue with import from types/index.ts

## Phase 5: Remove Unused Imports and Dead Code

- [x] 5.1 Remove `useMetamodelStore` import and const from App.vue:76,81
- [x] 5.2 Remove `Concept` import from useBlockRelationships.ts:4 (replaced with `BlockData`)
- [x] 5.3 Remove `BlockKind` import from BlockFeed.vue:63 (was unused in script)
- [x] 5.4 Remove duplicate `BlockData` interface from BlockRelationships.vue:53-59 (use import from types)
- [x] 5.5 Remove duplicate `ParsedItem` interface from BlockFeed.vue:65-71 (use import from types)
- [x] 5.6 Remove duplicate `BlockData` interface from useBlockRelationships.ts:23-29 (use import from types)
- [x] 5.7 Add shared `BlockData` and `ParsedItem` interfaces to `src/types/index.ts`

## Phase 6: Verification

- [x] 6.1 Run `npx vue-tsc --noEmit` — verify zero type errors
- [x] 6.2 Run `npx vitest run` — verify all tests pass (1 pre-existing failure in migration.test.ts — references non-existent sample files)
- [x] 6.3 Grep for `Math.random().toString(36)` in src/ — verify zero matches
- [x] 6.4 Grep for duplicate `interface PerspectiveEdge` — verify exactly one match
