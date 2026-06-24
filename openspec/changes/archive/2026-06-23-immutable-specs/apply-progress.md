# Apply Progress: Immutable Specs

## Progress Summary
All phases (Phase 1, Phase 2, Phase 3) of the implementation phase for the "immutable-specs" change have been successfully completed.

### Changes Made

#### Phase 1: Foundation
- **Document Store (`src/stores/document.ts`)**:
  - Updated the default `specificationUrl` ref value to the canonical raw GitHub URL: `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/docs/V_0-1-2/format-spec.md`.
  - Updated the fallback `specificationUrl` value inside the `loadDocument` function to the same raw GitHub URL.
- **Model Info Panel (`src/components/editor/ModelInfoPanel.vue`)**:
  - Updated the template `specification_url` field value inside the `handleCreateFile` handler to the same raw GitHub URL.

#### Phase 2: Core Implementation
- **Specification Example (`docs/spec/V_0-1-2/format-spec.md`)**:
  - Updated the frontmatter YAML block example at line 123 to use the raw GitHub URL path.
- **Agent Skill (`.agents/skills/FORMAT-skill/SKILL.md`)**:
  - Created a new agent skill file defining core design constraints, canonical version indexes pointing to raw tags, and core rules (English defaults, spec immutability).

#### Phase 3: Testing / Verification
- **Unit Tests (`src/stores/__tests__/document.test.ts`)**:
  - Added test cases to assert that `specificationUrl` initializes to the canonical raw GitHub URL.
  - Added test cases to assert that the parser falls back to the canonical raw GitHub URL when loading a model file missing the frontmatter `specification_url`.
- **Test Executions**:
  - Ran `npx vitest run src/stores/__tests__/document.test.ts` to verify all document store tests pass.
- **Historical Verifications**:
  - Verified that historical specification folders (`docs/spec/V_0-1-0` and `docs/spec/V_0-1-1`) remain completely unmodified.

## Status
- **Phase 1**: [x] Complete
- **Phase 2**: [x] Complete
- **Phase 3**: [x] Complete
