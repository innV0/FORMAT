---
name: FORMAT-skill
description: "Use when creating, editing, or validating business models and specifications in the FORMAT format."
---

# FORMAT Skill

This skill guides LLMs and agents in authoring, editing, and validating FORMAT-compliant files and working within the FORMAT codebase.

## Canonical Specification Index

All historical and current specifications are immutable. The canonical specifications must be referenced via their raw GitHub tags to ensure immutability:

- **V_0-1-0**: [format-spec.md (v0.1.0)](https://raw.githubusercontent.com/innV0/FORMAT/v0.1.0/DOCS/spec/V_0-1-0/format-spec.md)
- **V_0-1-1**: [format-spec.md (v0.1.1)](https://raw.githubusercontent.com/innV0/FORMAT/v0.1.1/DOCS/spec/V_0-1-1/format-spec.md)
- **V_0-1-2** (Current): [format-spec.md (v0.1.2)](https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/DOCS/spec/V_0-1-2/format-spec.md)

## Reference Directory

Agents working on model serialization, grammar validation, or language parsing should consult additional grammar and syntax rules located at:
- `references/modeling-spec.md` (relative to the skill directory or workspace workspace reference folder).

## Core Rules

1. **Spec Immutability**:
   - Published specifications (e.g., inside `DOCS/spec/V_0-1-0/` or `DOCS/spec/V_0-1-1/`) are completely frozen.
   - Do NOT edit, "fix", or migrate files within historical spec directories. Apply changes only to the current/active spec directory.

2. **Spec over Tolerant Code**:
   - Prefer specifications to be clear, simple, and solid.
   - Do NOT write code that silently tolerates or works around invalid models. If a model fails to comply with the current specification, reject it or surface the error clearly to the user.

3. **No Backward Compatibility**:
   - The codebase targets the CURRENT specification version only.
   - Do NOT maintain parsers, loaders, or branches supporting older versions or obsolete keys (such as `category_id`).

4. **Format Terminology**:
   - Always use the key `template` instead of `metamodel` in frontmatter declarations, master data models, and serialization output.

5. **Language Domain Contract**:
   - Generated technical artifacts (code, documentation, specs, issues, commits) default to English.
   - Keep direct conversation with the user in the user's active language, but respect English as the default for all code-level and documentation artifacts.
