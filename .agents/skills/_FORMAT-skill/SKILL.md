---
name: _FORMAT-skill
description: "Use when creating, editing, or validating business models and specifications in the FORMAT format (Business and Procedures templates)."
---

# FORMAT Skill

This skill guides LLMs and agents in authoring, editing, and validating FORMAT-compliant files and working within the FORMAT codebase.

## Core Concepts

### Templates vs Specializations

- **Template**: The official schema defining structure (concepts, markers, matrices). Stored in `docs/templates/<name>/V_x-y-z/`.
- **Specialization**: A self-contained template derived from an official one. Fully autonomous — no runtime inheritance.

### Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| Official template | `<template>_V_x-y-z_FORMAT.md` | `business_V_1-0-0_FORMAT.md` |
| Specialization | `<spec>_<template>_V_x-y-z_FORMAT.md` | `healthcare_business_V_1-0-0_FORMAT.md` |

### File Location

```
docs/templates/
├── business/
│   └── V_1-0-0/
│       ├── business_V_1-0-0_FORMAT.md          # Official template
│       ├── documentation.md                     # Template docs
│       └── samples/                             # Sample models
│           ├── Acme_V_1-0-0_business_FORMAT.md
│           └── Ghostbusters_V_0-3-0_business_FORMAT.md
└── procedures/
    └── V_1-0-0/
        ├── procedures_V_1-0-0_FORMAT.md         # Official template
        ├── template.md
        └── samples/
            └── Holiday_Request_V_1-0-0_procedures_FORMAT.md
```

### Provenance Traceability

Specializations document their origin in the `description` field of frontmatter. Include the parent template name and canonical URL for traceability:

```yaml
---
description: |
  Specialization of business_V_1-0-0 template.
  Parent: https://raw.githubusercontent.com/innV0/FORMAT/main/docs/templates/business/V_1-0-0/business_V_1-0-0_FORMAT.md
  Adapted for healthcare sector compliance.
template:
  name: "healthcare_business"
  version: "V_1-0-0"
  concepts: [...]  # Complete, self-contained
---
```

> [!IMPORTANT]
> Specializations are self-contained. They MUST define their own complete schema. The `description` field is purely informational for human traceability.

## Canonical Specification Index

All historical and current specifications are immutable. The canonical specifications must be referenced via their raw GitHub tags to ensure immutability:

- **V_0-1-0**: [format-spec.md (v0.1.0)](https://raw.githubusercontent.com/innV0/FORMAT/v0.1.0/docs/spec/V_0-1-0/format-spec.md)
- **V_0-1-1**: [format-spec.md (v0.1.1)](https://raw.githubusercontent.com/innV0/FORMAT/v0.1.1/docs/spec/V_0-1-1/format-spec.md)
- **V_0-1-2** (Previous): [format-spec.md (v0.1.2)](https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/docs/spec/V_0-1-2/format-spec.md)
- **V_0-1-3** (Current): [_format.md (v0.1.3)](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/V_0-1-3/_format.md)

## Reference Directory

Agents working on model serialization, grammar validation, or language parsing should consult additional grammar and syntax rules located at:
- `references/modeling-spec.md` (relative to the skill directory or workspace workspace reference folder).

## Greeting Protocol (MANDATORY)

When this skill is activated and the agent begins responding to the user for the first time in a session, the **first response** MUST include a brief self-introduction in the user's active language:

> **Template:** "Estás hablando con el skill de FORMAT. Puedo ayudarte a [capabilities relevant to the current request]."

**Rules:**
- The greeting is **session-scoped**: only once per conversation, not on every reply.
- Adapt the `[capabilities]` list dynamically based on what the user is asking (e.g., "crear, editar o validar modelos FORMAT", "modificar una plantilla de Procedures", etc.).
- Keep it short — 1-2 sentences max. No walls of text.
- If the agent was already introduced in the current session (e.g. after a compaction), skip the greeting.

---

## Core Rules

1. **Spec Immutability**:
   - Published specifications (e.g., inside `docs/spec/V_0-1-0/` or `docs/spec/V_0-1-1/`) are completely frozen.
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

---

# FORMAT Model Authoring and Validation Guidelines

This skill allows the agent to read, write, and validate documents conforming to the **_FORMAT** specification. 

All FORMAT-compliant files use the `.md` extension and follow a specific naming convention:
- **Model Document:** `<ModelName>_V_x-y-z_<TemplateName>_FORMAT.md` (e.g., `Ghostbusters_V_0-3-2_business_FORMAT.md`)
- **Template/Specification:** `<TemplateOrSpecName>_V_x-y-z_FORMAT.md` (e.g., `business_V_1-0-0_FORMAT.md`)

## 1. Reference Locations (On-Demand Loading)
To keep this skill lightweight and maintain a single source of truth, do not duplicate specification files locally in the skill. Instead, when validation or generation is requested, use your web-reading tools (e.g., `read_url_content`) to load the following canonical sources on-demand:

* **Official _FORMAT Specification (V_0-1-3):**
  `https://raw.githubusercontent.com/innV0/FORMAT/main/docs/V_0-1-3/_format.md`
* **Business Template (V_1-0-0):**
  `https://raw.githubusercontent.com/innV0/FORMAT/main/docs/templates/business/V_1-0-0/business_V_1-0-0_FORMAT.md`
* **Procedures Template (V_1-0-0):**
  `https://raw.githubusercontent.com/innV0/FORMAT/main/docs/templates/procedures/V_1-0-0/procedures_V_1-0-0_FORMAT.md`

## 2. Supported Templates
There are currently two official templates:
1. **Business:** Used for modeling business components, stakeholders, value propositions, market segmentation, etc.
2. **Procedures:** Used for modeling procedural workflows, roles involved, steps, complexity, and sequences.

## 3. Formatting and Grammar Rules

### 3.1 YAML Frontmatter
Every compliant file must start with a YAML block containing:
```yaml
---
specification_version: "V_0-1-3"
specification_url: "https://raw.githubusercontent.com/innV0/FORMAT/main/docs/V_0-1-3/_format.md"
title: "Document Title"
model_version: "V_x-y-z"
documentation_location: "docs/spec/V_0-1-3/"
template:
  name: "business" # or "procedures"
  version: "V_1-0-0"
  title: "Template Title"
  concepts: [...]
  markers: [...]
  matrices: [...]
---
```

### 3.2 Markdown Body
- **Concept Dividers:** Each concept section in the body starts with an H1 heading prefixed by the block comment:
  `# <!-- block: concepts --> concept name` (concept name must be in lowercase).
- **Element/Instance Lists:** Instantiable concepts use list items prefixed by:
  `* <!-- block: concept name --> Element Name`
- **Matrices Section:** Appears under `<!-- block: matrices -->` containing Markdown tables representing relationships or item-markers.

### 3.3 Element Fields (V_0-1-3)

Element fields are expressed as fenced YAML blocks (` ```yaml `) immediately after the element line. This replaces the old dash-list syntax.

```markdown
* <!-- block: roles --> Alice
  ```yaml
  scope: internal
  ```
```

## 4. Operational Instructions for the Agent
* **When Asked to Generate a Model:** Fetch the correct template raw file using the URLs in Section 1, parse the concepts, and prompt the user step-by-step or auto-generate the file content adhering strictly to the naming and layout conventions.
* **When Asked to Validate a Model:** Compare the local file contents against the template schema and the core FORMAT specification rules (H1 headers, block comments, correct lowercase concept names, correct list formatting, matrix headers match element names).
