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

## English-Only Documentation and Codebase
- Absolutely all documentation files, code files, codebase comments, specifications, sample files, master data, and user interface (UI) text/copy MUST be written in English. No Spanish or other languages are permitted in any files of this repository.
