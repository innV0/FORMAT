# Archive Report: immutable-specs

**Date**: 2026-06-23  
**Status**: ARCHIVED  
**Verdict**: Complete — All 9 tasks implemented, verified, and shipped.

---

## What Shipped

The **Immutable Specs** change normalizes specification URLs and version strings inside the codebase. It replaces the custom domain `https://format.innv0.com/spec/v0-1-2/format-spec.md` with raw GitHub URLs pointing to immutable git tags (`https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/docs/V_0-1-2/format-spec.md`) to guarantee absolute immutability. It maintains the folder segment as `V_0-1-2` rather than `v0-1-2` and creates a dedicated agent skill referencing these canonical URLs.

### File Modifications & Creations

1. **`src/stores/document.ts`** (MODIFIED) — Updated default state and parser fallback for `specificationUrl` to point to the canonical raw GitHub URL.
2. **`src/components/editor/ModelInfoPanel.vue`** (MODIFIED) — Updated inline creation template `specification_url` field value to point to the canonical raw GitHub URL.
3. **`docs/V_0-1-2/format-spec.md`** (MODIFIED) — Corrected YAML frontmatter example URL at line 123 to match the canonical raw GitHub URL.
4. **`.agents/skills/FORMAT-skill/SKILL.md`** (NEW) — Created agent skill file mapping canonical spec URLs and enforcing English default and spec immutability instructions.
5. **`src/stores/__tests__/document.test.ts`** (MODIFIED) — Added unit tests verifying store initialization and parser fallback logic.

---

## Verification Outcome

**Build & Test Evidence**:
- `npm test` — Vitest run completed successfully: 2 test files, 17/17 tests passing.
- Legacy specs under `docs/V_0-1-0/` and `docs/V_0-1-1/` verified to be completely unmodified.

**Task Completeness**:
- All 9 tasks across Phases 1–3 marked `[x]` in `tasks.md`.

**Spec Compliance**:
- Compliance verified for both new and modified requirements:
  - **REQ-01** (Immutable Canonical URL Structure): Pass.
  - **REQ-02** (Store Default and Fallback): Pass.
  - **REQ-03** (Model Template Normalization): Pass.
  - **REQ-04** (Draft Spec Example Alignment): Pass.
  - **REQ-05** (Legacy Specs Preservation): Pass.
  - **REQ-06** (FORMAT Agent Skill): Pass.

---

## Key Architectural Decisions

1. **GitHub Release Tags for Specifications**: Lock spec version V_0-1-2 to the raw GitHub release tag to guarantee absolute immutability.
2. **Uppercase and Underscore Folder Format**: Preserved the `V_0-1-2` directory segment layout to align with existing tag naming conventions.
3. **Zero Runtime Migration**: Did not add runtime migrations or URL rewriting for legacy documents, keeping old files byte-for-byte identical.

---

## SDD Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Proposal | `proposal.md` | ✅ Complete |
| Design | `design.md` | ✅ Complete |
| Tasks | `tasks.md` | ✅ Complete (9/9 tasks, all checked) |
| Verification Report | `verify-report.md` | ✅ Complete (PASS) |
| Delta Spec (format-spec) | `specs/format-spec/spec.md` | ✅ Complete |
| Delta Spec (FORMAT-skill) | `specs/FORMAT-skill/spec.md` | ✅ Complete |

---

## Artifacts Merged into Main Specs

After archiving, the following main specs were updated with delta spec content:

| Domain | Spec | Action | Summary |
|--------|------|--------|---------|
| `format-spec` | `openspec/specs/format-spec/spec.md` | Created (as full spec) | Normalization and immutability requirements for FORMAT V_0-1-2 specs. |
| `FORMAT-skill` | `openspec/specs/FORMAT-skill/spec.md` | Created (new spec) | Manifest and reference integration requirements for the new agent skill. |

---

## Golden Rule: Enforced

After this archive:
- ✅ Default specification URL points to `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/docs/V_0-1-2/format-spec.md`.
- ✅ Model creation template points to the canonical raw GitHub URL.
- ✅ Draft specification frontmatter example points to the canonical raw GitHub URL.
- ✅ Historical specifications are completely unmodified.
- ✅ New `.agents/skills/FORMAT-skill/SKILL.md` guides agents according to project standards.

---

## Files Archived

This folder (`openspec/changes/archive/2026-06-23-immutable-specs/`) contains:
- `proposal.md` — original business case and scope
- `design.md` — technical architecture and migration plan
- `tasks.md` — all 9 completed tasks
- `verify-report.md` — verification evidence and compliance matrix
- `specs/format-spec/spec.md` — delta spec copied to main specs
- `specs/FORMAT-skill/spec.md` — new spec copied to main specs
- `archive-report.md` — this file

---

**Archive closed by**: sdd-archive executor (sdd-archive subagent)  
**Archive timestamp**: 2026-06-23T07:42:53+02:00  
**SDD Cycle**: COMPLETE
