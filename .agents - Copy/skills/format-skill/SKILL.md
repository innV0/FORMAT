---
name: format-skill
description: Validate, format, check syntax, and import business models matching the FORMAT specification (Flat, Open, Readable — Model Architecture Template).
---

# FORMAT Skill

Use this skill when you need to validate, format, check the syntax of, or import a business model in the FORMAT format.
## Guidelines

1. **Syntax Validation**:
   - Verify that the business model is in the new flat self-containing markdown format:
     - YAML frontmatter contains the `metamodel` definition block with `concepts`, `markers`, and `matrices` keys.
     - YAML frontmatter contains a `specification_version` string variable (e.g. `specification_version: "1.0.0"`).
     - YAML frontmatter contains a `documentation_location` string variable (e.g. `documentation_location: "DOCS/v1.0.0/"`).
     - Separators are lowercase block comments like `<!-- block: concepts -->` and `<!-- block: matrices -->`.
     - Concept sections are defined as `# <!-- block: concepts --> [concept-name]` (lowercase).
     - Node instances are defined as `* <!-- block: [type] --> [name]` (where `[type]` matches the concept name in lowercase).
     - Node descriptions start on the next line without indentation.
     - Matrices are defined as `# <!-- block: matrices --> [matrix-name]`.
   - Report any syntax violations or warnings.

2. **Formatting and Normalization**:
   - Normalize the spacing, casing, and list markers.
   - Strip any markdown formatting inside node names (remove `**`, `*`, `__`, `[[`, and `]]`).
   - Standardize table columns, headers, and alignments.

3. **Importing Raw Narratives**:
   - Defer to `model-generator` skill to build a complete flat markdown model from raw text.
   - Verify the imported model is syntactically correct and fully parseable.

4. **Reference Specifications**:
   - Refer to the detailed grammar and spec in `references/format-spec.md`.
