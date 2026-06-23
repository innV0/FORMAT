# Project Rules

## Spec Over Tolerant Code
- Prefer the specification to be clear, simple, and solid, and keep the application code as uncomplicated as possible.
- When a model is incorrect or does not comply with the specification, do NOT write code so the application silently tolerates or works around it. Instead, surface the problem clearly to the user and state that the model is incorrect.

## No Backward Compatibility
- The application targets the CURRENT specification version only. Do NOT write code, parsers, loaders, or migrations that read, convert, or otherwise support models authored against older specification versions or removed fields (e.g. `category_id`).
- Prefer clear, simple, single-path code over branches that keep old formats working. When a field or format is removed from the spec, remove the code that handled it — do not demote it to a "legacy" or "backward compat" branch.
- Migrating old assets (samples, master data) to the current format is a one-time data task, not a runtime responsibility of the code.

## Specification Versioning
- Published specifications are immutable. Once a new specification version is published, older versions MUST remain untouched. Never edit, "fix", or migrate the content of a previous spec version (e.g. `DOCS/V_0-1-0/`) when introducing or updating a newer one. Each version is a historical record of what FORMAT was at that point in time.
- New rules, renames, or removals apply to the current spec version and forward only. Apply them by creating/editing the latest version directory, not by rewriting prior ones.

## Format Terminology
- The frontmatter schema key is `template`. Do not use `metamodel` in FORMAT documents, samples, or serialization output. (`metamodel` is retained in the spec only as a documented legacy alias for backward-compatible reading.)

## English-Only Documentation and Codebase
- Absolutely all documentation files, code files, codebase comments, specifications, sample files, master data, and user interface (UI) text/copy MUST be written in English. No Spanish or other languages are permitted in any files of this repository.

## Expanded Options (Opciones Expandidas)
- In block pills of all sizes, the marker options, add child node buttons, edit, delete, and list controls are defined as "Expanded Options" (Opciones Expandidas).
- These options must be rendered inside the pill itself, directly below the name, and not to the right or outside the pill.
- The name inside the pill must always be styled with normal weight (no bold/semibold).
- Expanded options should only appear when the pill is hovered (which displays all available markers and action buttons), or when the pill is not hovered but has markers with a value greater than zero (which displays only those active markers).
- When the pill is hovered, it expands vertically (layout shifts to column flex) to display these expanded options below the name.
- When the pill is NOT hovered, the layout is single-line (inline-flex or row flex), and any active markers (value greater than zero) must be displayed inline to the right of the name.
- This behavior and visual mechanism must be identical for all block pills across hierarchy trees, concepts list, matrices, columns, and rows.
