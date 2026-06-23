# Proposal: Immutable Specs

## Intent
Normalize specification URLs and version strings inside the codebase. Replace the custom domain `https://format.innv0.com/spec/v0-1-2/format-spec.md` with raw GitHub URLs pointing to immutable git tags (`https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/DOCS/V_0-1-2/format-spec.md`) to guarantee absolute immutability. Maintain the folder segment as `V_0-1-2` rather than `v0-1-2`. Create a dedicated agent skill referencing these canonical URLs.

## Scope

### In Scope
- Update `src/stores/document.ts` default spec URL and fallback logic.
- Update `src/components/editor/ModelInfoPanel.vue` default template.
- Update frontmatter example URL in draft spec `DOCS/V_0-1-2/format-spec.md`.
- Create `.agents/skills/FORMAT-skill/SKILL.md` document defining the format skill and specs index.
- Keep previous specs `V_0-1-0` and `V_0-1-1` untouched.

### Out of Scope
- Modifying core FORMAT schema rules or properties.
- Touching historical spec versions `V_0-1-0` or `V_0-1-1`.
- Adjusting runtime frontmatter parsing except fallback URLs.

## Capabilities

### Modified Capabilities
- `format-spec` (V_0-1-2): Example metadata normalized to point to the canonical GitHub URL.

### New Capabilities
- `FORMAT-skill`: An agent skill that guides LLMs on FORMAT specs, structure, and constraints.

## Approach
1. Update store: Change fallback specificationUrl in `document.ts`.
2. Update template: Modify inline template in `ModelInfoPanel.vue`.
3. Update spec: Edit line 123 of `DOCS/V_0-1-2/format-spec.md`.
4. Create skill: Author `.agents/skills/FORMAT-skill/SKILL.md` using the standard agent skill format.
No compiler/build changes are required. Rollback is a direct `git checkout`.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `src/stores/document.ts` | Modified | Default and fallback URLs set to immutable raw GitHub URL. |
| `src/components/editor/ModelInfoPanel.vue` | Modified | Template inside `handleCreateFile` updated. |
| `DOCS/V_0-1-2/format-spec.md` | Modified | Frontmatter example URL corrected. |
| `.agents/skills/FORMAT-skill/SKILL.md` | New | Agent skill file mapping canonical spec URLs. |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Broken links in older local model files. | Low | Fallback parser logic handles old files; runtime targets latest tag. |
| Accidentally modifying legacy V_0-1-0 or V_0-1-1 specs. | Low | Strictly target V_0-1-2 files. |

## Rollback Plan
Perform `git checkout -- .` to discard local changes.

## Dependencies
- GitHub repository tags `v0.1.0`, `v0.1.1`, and `v0.1.2` (existing).

## Success Criteria
- [ ] All occurrences of custom domain spec URL for V_0-1-2 are replaced.
- [ ] New model files are generated with canonical GitHub spec URLs.
- [ ] draft specification `DOCS/V_0-1-2/format-spec.md` uses the canonical raw GitHub URL in its frontmatter example.
- [ ] `.agents/skills/FORMAT-skill/SKILL.md` is created with proper skill frontmatter.
- [ ] Historical specs `V_0-1-0` and `V_0-1-1` remain completely untouched.
