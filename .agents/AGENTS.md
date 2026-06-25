# Project Rules

## Spec Over Tolerant Code
- Prefer the specification to be clear, simple, and solid, and keep the application code as uncomplicated as possible.
- When a model is incorrect or does not comply with the specification, do NOT write code so the application silently tolerates or works around it. Instead, surface the problem clearly to the user and state that the model is incorrect.

## No Backward Compatibility
- The application targets the CURRENT specification version only. Do NOT write code, parsers, loaders, or migrations that read, convert, or otherwise support models authored against older specification versions or removed fields (e.g. `category_id`).
- Prefer clear, simple, single-path code over branches that keep old formats working. When a field or format is removed from the spec, remove the code that handled it — do not demote it to a "legacy" or "backward compat" branch.
- Migrating old assets (samples, master data) to the current format is a one-time data task, not a runtime responsibility of the code.

## Master Data JSON is Development-Only
- The `innV0_master_data.json` file is a **temporary development artifact** used to bootstrap the metamodel during development.
- It is NOT a valid data source for the application. Do NOT treat it as canonical.
- The canonical source for taxonomy is the **index block** in each FORMAT document (§5.2 of the spec).
- When loading a document, taxonomy edges MUST be derived from the document's index block, not from static JSON files.

## Template-Agnostic Code (MANDATORY)
- The application MUST behave identically for ALL templates (business, procedures, or any future template). There must be NO hardcoded template-specific logic, concept names, or behavioral branches based on template type.
- All behavior MUST be driven by the **frontmatter data** (concepts, taxonomy edges, hierarchy concepts) — never by template names or hardcoded concept names like "Stakeholders", "Segments", etc.
- When adding features that depend on concept hierarchy or instance structure, always use the generic data structures (`modelTree`, `hierarchyConcepts`, `taxonomyEdges`) — never assume a specific template's concept names or structure.
- If a concept is not in `hierarchyConcepts`, its instances MUST still be accessible through the unified data model (e.g., as flat root-level nodes in `modelTree`).
- Fallback values like `|| 'Stakeholders'` or `|| 'business'` are PROHIBITED. If data is missing, surface the error clearly instead of silently falling back to a template-specific default.

## English-Only Documentation and Codebase
- Absolutely all documentation files, code files, codebase comments, specifications, sample files, master data, and user interface (UI) text/copy MUST be written in English. No Spanish or other languages are permitted in any files of this repository.

## Spec Version Propagation (MANDATORY)
- The single source of truth for the FORMAT specification version is `DEFAULT_FORMAT_VERSION` in `src/utils/constants.ts`.
- **Code files (.ts/.vue):** MUST import `DEFAULT_FORMAT_VERSION` and `buildSpecificationUrl()` from `constants.ts`. Hardcoding a `V_x-y-z` string literal anywhere outside `constants.ts` is PROHIBITED. The only exception is `version.ts` (uses the version in JSDoc comments only).
- **Non-code files (.md, skills, sample models):** MUST carry an HTML comment marker `<!-- @spec-version V_x-y-z -->` near the top of the file, set to the current spec version.

### Spec-Version Tracked Files Registry
The following non-code files MUST be updated when the spec version changes. This list is the canonical registry — `MARKER_FILES` in `scripts/check-spec-version.mjs` MUST be kept in byte-for-byte sync with it:

| Path | Type | Why it depends on the spec version |
|------|------|------------------------------------|
| `.agents/skills/_FORMAT-skill/SKILL.md` | Skill | Embeds spec version, canonical URL, and frontmatter examples |
| `docs/templates/business/V_1-0-0/business_V_1-0-0_FORMAT.md` | Template | Declares `specification_version` / `specification_url` in frontmatter |
| `docs/templates/business/V_1-0-0/samples/Ghostbusters_V_0-1-0_business_FORMAT.md` | Sample model | Declares `specification_version` / `specification_url` in frontmatter |
| `docs/templates/procedures/V_1-0-0/procedures_V_1-0-0_FORMAT.md` | Template | Declares `specification_version` / `specification_url` in frontmatter |
| `docs/templates/procedures/V_1-0-0/samples/Comprehensive_Test_Procedure_V_1-0-0_procedures_FORMAT.md` | Sample model | Declares `specification_version` / `specification_url` in frontmatter |

When a new non-code artifact that references the spec version is added to the repo, append its path to this table AND to `MARKER_FILES` in the same commit. The `check:spec-version` script will fail if the two lists diverge or if a listed file is missing its marker.

- **When bumping the spec version:**
  1. Update `DEFAULT_FORMAT_VERSION` in `src/utils/constants.ts`.
  2. Run `npm run check:spec-version` — it lists every stale file.
  3. Update each stale file: code imports the constant; markdown/skills/models update their `@spec-version` marker AND any inline `specification_version` / `specification_url` values in examples.
  4. Never leave a file behind. The script is the safety net, not a substitute for diligence.
