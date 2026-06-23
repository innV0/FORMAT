# Tasks: Immutable Specs

## Review Workload Forecast
- Estimated changed lines: 50
- 400-line budget risk: Low
- Chained PRs recommended: No
- Suggested split: None
- Delivery strategy: exception-ok
- Chain strategy: None
- Decision needed before apply: No

## Suggested Work Units
| Unit | Description | Est. Lines | Target Files |
| --- | --- | --- | --- |
| 1 | Configuration & Store fallbacks | ~15 | `src/stores/document.ts`, `src/components/editor/ModelInfoPanel.vue` |
| 2 | Spec & Skill updates | ~35 | `DOCS/V_0-1-2/format-spec.md`, `.agents/skills/FORMAT-skill/SKILL.md` |
| 3 | Verification | ~10 | `src/stores/__tests__/document.test.ts` |

## Phase 1: Foundation
- [x] Update default state value of `specificationUrl` in `src/stores/document.ts` to `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/DOCS/V_0-1-2/format-spec.md`.
- [x] Update fallback value for `specificationUrl` inside `loadDocument` in `src/stores/document.ts` to `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/DOCS/V_0-1-2/format-spec.md`.
- [x] Update template `specification_url` field value inside `handleCreateFile` in `src/components/editor/ModelInfoPanel.vue` to `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/DOCS/V_0-1-2/format-spec.md`.

## Phase 2: Core Implementation
- [x] Update the YAML frontmatter example at line 123 in draft specification `DOCS/V_0-1-2/format-spec.md` to point to the raw GitHub URL `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/DOCS/V_0-1-2/format-spec.md`.
- [x] Create agent skill file `.agents/skills/FORMAT-skill/SKILL.md` with:
  - Standard skill frontmatter mapping to `FORMAT-skill`.
  - Canonical specification index listing immutable tag URLs for versions `V_0-1-0`, `V_0-1-1`, and `V_0-1-2`.
  - Reference directory instructions directing agents to read grammar rules from `references/modeling-spec.md`.
  - Core rules instructing agents to default outputs to English and respect spec immutability by protecting historical directories.

## Phase 3: Testing / Verification
- [x] Add unit tests in `src/stores/__tests__/document.test.ts` to verify the store's default initialization of `specificationUrl` to the canonical raw GitHub URL.
- [x] Add unit tests in `src/stores/__tests__/document.test.ts` to assert parser fallback to the raw GitHub URL when loading a model file that does not contain a frontmatter `specification_url`.
- [x] Run `npm test` to ensure all tests pass successfully.
- [x] Verify that files in `DOCS/V_0-1-0` and `DOCS/V_0-1-1` have not been altered.
