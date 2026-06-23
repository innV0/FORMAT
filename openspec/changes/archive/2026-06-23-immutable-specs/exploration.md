## Exploration: immutable-specs

### Current State
Currently, the codebase contains references to the specification URL using `https://format.innv0.com/spec/v0-1-2/format-spec.md`.
These are located in:
1. `src/stores/document.ts` (as the default URL and fallback when parsing document frontmatter)
2. `src/components/editor/ModelInfoPanel.vue` (in the default template used when creating a new model file)
3. `DOCS/V_0-1-2/format-spec.md` (in the specification frontmatter example)

The current URLs use the lowercase, hyphenated SemVer string (`v0-1-2`) instead of the uppercase, underscored and hyphenated format (`V_0-1-2`) for folder paths, and they point to the custom domain `format.innv0.com` instead of the immutable GitHub release tags.

### Affected Areas
- `src/stores/document.ts` — Update default spec URL value and fallback to `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/DOCS/V_0-1-2/format-spec.md`.
- `src/components/editor/ModelInfoPanel.vue` — Update the default model template text to use the new immutable spec URL.
- `DOCS/V_0-1-2/format-spec.md` — Normalize the example `specification_url` in the frontmatter. (Previous versions `V_0-1-0` and `V_0-1-1` will remain untouched as they are immutable).
- `.agents/skills/FORMAT-skill/SKILL.md` — Create the new skill file referencing the canonical GitHub URLs of specifications.

### Approaches
1. **Direct Git Tag Referencing (Recommended)** — Change URLs to point directly to `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/DOCS/V_0-1-2/format-spec.md` where the tag `v0.1.2` matches the immutable tag for the V_0-1-2 specification release.
   - Pros: Fully immutable, relies on GitHub infrastructure, guarantees consistent document versions.
   - Cons: None.
   - Effort: Low

### Recommendation
Use Direct Git Tag Referencing pointing to the `innV0/FORMAT` repository. It matches the repository's configuration and guarantees absolute immutability.

### Risks
- Make sure that `V_0-1-2` spec example changes are done cleanly without affecting any other text. Previous specification directories (`V_0-1-0` and `V_0-1-1`) must remain untouched.

### Ready for Proposal
Yes — The orchestrator should proceed to the proposal/spec phase.
