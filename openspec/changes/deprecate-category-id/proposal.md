# Proposal: Deprecate category_id and Align Code with Spec V_0-1-2

## Intent

Resolve the inconsistency between spec V_0-1-2 (which says `category_id` was removed) and the codebase. The code has already stopped using `category_id` in the parser and store, but:
- Old spec examples still show `category_id`
- Test files still contain `category_id` in test data
- AGENTS.md warns about `category_id` but it's already gone
- Taxonomy edges are hardcoded in master data JSON instead of being derived from .md files

## Scope

### In Scope
- Update V_0-1-0 and V_0-1-1 spec examples to remove `category_id`
- Clean up test files that still reference `category_id`
- Update AGENTS.md to reflect that `category_id` is already removed
- Ensure taxonomy edges are always derived from .md file content (index block or matrix), not static JSON

### Out of Scope
- Changing the taxonomy edge format
- Adding new perspective types
- Authoring UI for perspectives (future work)

## Capabilities

### New Capabilities
None — this is a cleanup/alignment change.

### Modified Capabilities
None — behavior is unchanged.

## Approach

1. Update old spec examples to remove `category_id` from concept definitions
2. Clean up test fixtures that still use `category_id`
3. Update AGENTS.md to remove the outdated warning
4. Verify that taxonomy edges are derived from .md file content, not static JSON

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `docs/spec/V_0-1-0/spec.md` | Modified | Remove `category_id` from examples |
| `docs/spec/V_0-1-1/spec.md` | Modified | Remove `category_id` from examples |
| `src/utils/__tests__/markdownParser.test.ts` | Modified | Remove `category_id` from test fixtures |
| `.agents/AGENTS.md` | Modified | Update warning about `category_id` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Breaking old document parsing | Low | Parser already doesn't use `category_id` |
| Test failures | Low | Tests are parsing old formats, may need updates |

## Rollback Plan

`git checkout --` all changed files. Pure documentation/test cleanup.

## Success Criteria

- [ ] No `category_id` references in src/ code (excluding test fixtures for old formats)
- [ ] Spec examples align with V_0-1-2 format
- [ ] AGENTS.md accurately reflects current state
- [ ] All tests pass
