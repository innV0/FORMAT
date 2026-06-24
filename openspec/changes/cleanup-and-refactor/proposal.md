# Proposal: Codebase Cleanup and Refactoring

## Intent

Remove dead files, eliminate duplicated code, centralize magic constants, and clean up unused imports/types. The goal is to reduce maintenance burden and improve code consistency without changing any runtime behavior.

## Scope

### In Scope
- Delete 8+ temporary/dead files (test debug outputs, stale copy directory, unreachable debug.js)
- Remove duplicate type definitions in `types/index.ts`
- Extract shared utilities: `generateId()`, `findNodeByName()`, `deriveChain()`, `stripMarkdownFormatting()`
- Extract magic constants (`DEFAULT_FORMAT_VERSION`, `DEFAULT_TEMPLATE_NAME`, `MAX_MARKER_SCORE`) to `utils/constants.ts`
- Remove unused imports across App.vue, BlockFeed.vue, useBlockRelationships.ts
- Consolidate duplicated logic: `slugify`, marker cycling, `visibleFields`, `getMatrixRowsList`/`getMatrixColsList`

### Out of Scope
- Decomposing `parseMarkdownModel` (551 lines) and `generateMarkdownFileContent` (455 lines) — separate change
- Replacing `alert()` with toast notifications — separate UX change
- Moving `newFileName` out of workspace store — separate concern
- `run.bat` — explicitly kept per user request
- `innV0_master_data.json` files — user decision needed separately

## Capabilities

### New Capabilities
None — this is a pure refactoring with no behavioral changes.

### Modified Capabilities
None — no spec-level behavior changes.

## Approach

Work in dependency order: delete dead files first (zero risk), then extract shared utilities, then update consumers to use them. Each phase is independently verifiable via `vue-tsc --noEmit` and existing tests.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| Root files | Removed | 5 test output files, `.agents - Copy/`, `debug.js`, `relational_matrix_spec.md` |
| `src/types/index.ts` | Modified | Remove 3 duplicate interface definitions |
| `src/utils/` | Modified | Add `constants.ts`, `id.ts`, `tree.ts`; update `sanitize.ts` |
| `src/stores/document.ts` | Modified | Import shared utilities, remove inline duplicates |
| `src/stores/metamodel.ts` | Modified | Use shared `deriveChain()` |
| `src/utils/markdownParser.ts` | Modified | Use shared utilities |
| `src/App.vue` | Modified | Remove unused import |
| `src/components/editor/*.vue` | Modified | Remove duplicate types, use shared utilities |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Breaking runtime behavior | Low | Pure refactoring — no logic changes, only extraction and deduplication |
| Type errors after removing duplicates | Medium | Run `vue-tsc --noEmit` after each phase |

## Rollback Plan

All changes are in version control. `git checkout .` reverts any phase.

## Dependencies

None.

## Success Criteria

- [ ] `vue-tsc --noEmit` passes with zero errors
- [ ] All existing tests pass
- [ ] Zero duplicate interface definitions in `types/index.ts`
- [ ] `Math.random().toString(36)` appears 0 times in src/ (replaced by `generateId()`)
- [ ] `.agents - Copy/` directory deleted
- [ ] All 5 `test_*.txt` files deleted
