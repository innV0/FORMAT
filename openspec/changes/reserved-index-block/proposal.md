# Proposal: Reserved Index Block for Taxonomy

## Intent

Standardize the "index" block as the canonical way to define concept taxonomy in FORMAT documents, inspired by Google's Open Knowledge Format (OKF). Remove the legacy "concept-taxonomy hierarchy matrix" parser.

## Scope

### In Scope
- Document "index" block as reserved in spec V_0-1-2
- Remove "concept-taxonomy hierarchy matrix" parser from markdownParser.ts
- Update AGENTS.md to clarify master data JSON is development-only
- Add index block syntax to spec §5 (Markdown Body Grammar)

### Out of Scope
- Changing the index block format (already implemented)
- Removing taxonomy edges from master data JSON
- Adding new perspective types

## Capabilities

### New Capabilities
None — this is a spec alignment change.

### Modified Capabilities
None — behavior is unchanged.

## Approach

1. Add §5.x "Index Block" to spec documenting the reserved block name and Wikilink syntax
2. Remove lines 422-442 in markdownParser.ts (concept-taxonomy hierarchy matrix parser)
3. Update AGENTS.md with master data JSON guidance

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `docs/spec/V_0-1-2/spec.md` | Modified | Add index block documentation |
| `src/utils/markdownParser.ts` | Modified | Remove concept-taxonomy parser |
| `.agents/AGENTS.md` | Modified | Add master data JSON guidance |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Breaking documents with concept-taxonomy matrix | Low | Parser already has index block support |

## Rollback Plan

`git checkout --` all changed files.

## Success Criteria

- [ ] Spec documents index block as reserved
- [ ] No concept-taxonomy hierarchy matrix references in parser
- [ ] AGENTS.md clarifies master data JSON role
- [ ] All tests pass
