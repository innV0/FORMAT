---
name: _FORMAT-skill
description: "Use when creating, editing, or validating business models and specifications in the FORMAT format (Business and Procedures templates)."
---

<!-- @spec-version V_0-1-4 -->

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
- **V_0-1-3**: [_format.md (v0.1.3)](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/V_0-1-3/_format.md)
- **V_0-1-4** (Current): [_format.md (v0.1.4)](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/V_0-1-4/_format.md)

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

* **Official _FORMAT Specification (V_0-1-4):**
  `https://raw.githubusercontent.com/innV0/FORMAT/main/docs/V_0-1-4/_format.md`
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
specification_version: "V_0-1-4"
specification_url: "https://raw.githubusercontent.com/innV0/FORMAT/main/docs/V_0-1-4/_format.md"
title: "Document Title"
model_version: "V_x-y-z"
documentation_location: "docs/spec/V_0-1-4/"
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

### 3.3 Element Fields (V_0-1-4)

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

---

## 5. Dashboard Renderer (Template Companion Artifact)

### 5.1 Purpose

A dashboard renderer is a companion artifact of a FORMAT template. It is an HTML
fragment that visually represents any model authored against that template. The
renderer is filled at runtime by the application with the normalized data of
the loaded model (concepts, instances, hierarchy, taxonomy edges, matrices).

A renderer is NEVER generated per model. It lives at the template level and is
versioned together with the template, so it never goes stale when a model is
patched.

A template is valid with or without a renderer. If the renderer is missing, the
application detects it and shows the user the copyable instructions defined in
§5.8.

### 5.2 Location and Naming (FIXED)

A renderer MUST be located alongside the template it renders:

```
docs/templates/<templateName>/V_x-y-z/dashboard.html
```

Examples:

```
docs/templates/business/V_1-0-0/dashboard.html
docs/templates/procedures/V_1-0-0/dashboard.html
docs/templates/healthcare_business/V_1-0-0/dashboard.html
```

The file name is ALWAYS `dashboard.html`. No model name, no version suffix —
the directory already encodes template name and version.

### 5.3 When to Generate

The renderer is generated when a template (or a new version of one) is authored
or updated, as part of the template delivery alongside the template file and
`documentation.md`. Generation is optional: a template without a renderer is
still valid. Generation can also be requested on demand for an existing
template that does not yet ship a renderer.

### 5.4 Renderer Syntax — Mustache

The renderer uses [Mustache](https://github.com/janl/mustache.js) (logic-less
template system). Mustache is a well-known standard with a proven, dependency-
free JavaScript implementation (`mustache.js`, ~19 KB minified) that the
application can reuse across other features. The engine does NOT use `eval` or
`new Function`; it parses to tokens and renders by string concatenation, so it
is safe by design.

Supported constructs:

```
Value interpolation (HTML-escaped automatically):
    {{model.title}}
    {{template.name}}
    {{concept.name}}

Section (iteration when the value is an array, conditional when truthy):
    {{#concepts}}
        <section>
            <h2>{{name}}</h2>
            {{#instances}}
                <li>{{label}}</li>
            {{/instances}}
        </section>
    {{/concepts}}

Inverted section (renders when the value is falsy / empty array):
    {{^matrices}}<p>No matrices.</p>{{/matrices}}
```

Rules:
- Only plain key access is allowed: `{{a.b.c}}`. No expressions, no function calls, no computed keys.
- Unknown keys are silent: they render nothing and do not raise errors.
- Interpolated values are HTML-escaped by Mustache by default.
- The renderer MUST be a well-formed HTML fragment after placeholders are filled.
- Max nesting depth for sections: 2 (sufficient for concept → instances, matrix → rows).

#### 5.4.1 Prohibited Mustache Features (MANDATORY)

Two Mustache features MUST NOT appear in any renderer. They are rejected by the
validator (§5.8) and by the application at load time:

1. **Triple-mustache `{{{value}}}`** — interpolates WITHOUT HTML-escaping,
   enabling XSS from model content. All interpolation MUST use double-mustache
   `{{value}}`, which escapes HTML.
2. **Partials `{{>partial}}`** — includes external templates, introducing
   references to files outside the renderer. Partials are prohibited.
3. **Delimiter change `{{=delim delim=}}`** — changes the tag delimiters and
   can be used to obfuscate validation. Prohibited.

Any renderer containing `{{{`, `{{>`, or `{{=` is invalid and MUST be rejected.

### 5.5 Data Exposed to the Renderer

The application fills the renderer with this normalized, template-agnostic data
(derived from the model frontmatter and body, never from hardcoded concept
names):

```
model:
  title                — string
  version               — string (e.g. "V_1-0-0")
  specificationVersion  — string (e.g. "V_0-1-4")

template:
  name                  — string
  version               — string
  title                 — string

concepts: array of
  name                  — concept name (string)
  instances             — array of { label: string, fields: array of { key: string, value: string } }

hierarchyConcepts: array of { name: string, parent?: string }

taxonomyEdges: array of { source: string, target: string, label?: string }

matrices: array of
  name                  — string
  headers               — string[]
  rows                  — string[][]
```

The renderer MUST use only these keys and MUST NOT hardcode concept names
specific to any template (e.g. "Stakeholders", "Segments"). This keeps the
renderer template-agnostic, as required by the project rules.

### 5.6 Security Constraints (MANDATORY)

The renderer is LLM-generated content and therefore untrusted. The following
constraints are mandatory and MUST be enforced by both the generating agent and
the consuming application:

1. The renderer MUST be an HTML FRAGMENT. It MUST NOT contain:
   - `<!DOCTYPE>`, `<html>`, `<head>`, `<body>` tags
   - `<script>` tags (any kind, including module, type, src)
   - `<iframe>`, `<object>`, `<embed>`, `<link>`, `<meta>` tags
   - Any attribute starting with `on` (`onclick`, `onload`, `onerror`, ...)
   - Any URI using the `javascript:` scheme
   - Any external resource (CSS file, font, remote image, CDN)
2. All CSS MUST be inlined in `<style>` blocks within the fragment.
3. Images, if any, MUST use the `data:` URI scheme only.
4. The renderer MUST NOT reference external URLs in any form.
5. The renderer MUST be valid HTML after placeholders are filled.
6. The renderer file size MUST NOT exceed 256 KB.

The application enforces these at runtime via a sandboxed iframe
(`sandbox="allow-same-origin"`, no `allow-scripts`), an inline
Content-Security-Policy (`default-src 'none'; style-src 'unsafe-inline'; img-src data:`),
a sanitizer that strips prohibited tags/attributes, HTML-escaping of all
interpolated values, and a size cap.

### 5.7 Generation Prompt (INVARIANT)

When generating or updating a dashboard renderer, the agent MUST use the
following prompt verbatim. It is the single source of truth for what the
renderer is and how it must be built:

> Genera un archivo HTML sin encabezados ni nada, solo código HTML que represente de la mejor forma posible a nivel visual el modelo cargado, usando los placeholders Mustache definidos en el skill de FORMAT.

The agent then applies the constraints in §5.6 (fragment, no scripts, inline
CSS, template-agnostic placeholders, etc.) and writes the result to
`docs/templates/<templateName>/V_x-y-z/dashboard.html`.

This instruction is agent-agnostic: it works in opencode, Claude Code,
Anti-gravity, or any other agent that supports the FORMAT skill. It does not
reference any tool-specific name.

### 5.8 Validation

Before saving the renderer, the agent MUST:
1. Verify the fragment parses cleanly with Mustache (balanced sections, valid tag syntax).
2. Verify the renderer does NOT contain any prohibited Mustache feature (§5.4.1): `{{{`, `{{>`, or `{{=`.
3. Verify all placeholders reference only documented data keys (§5.5).
4. Verify none of the prohibited tags/attributes (§5.6) are present.
5. Verify the file size is under 256 KB.
6. Verify the file is saved at the canonical location (§5.2).

If any check fails, the agent MUST report the error and NOT save the file.

### 5.9 Copyable Instructions for End Users

When the application loads a model whose template has no `dashboard.html`, it
shows the user the following copyable block:

```
The template <templateName> <version> does not include a dashboard
renderer. To generate one, ask your AI agent (opencode, Claude Code,
Anti-gravity, or any other) using the FORMAT skill:

    Genera un archivo HTML sin encabezados ni nada, solo código HTML que
    represente de la mejor forma posible a nivel visual el modelo cargado,
    usando los placeholders Mustache definidos en el skill de FORMAT.

The renderer MUST be saved at:
    docs/templates/<templateName>/<version>/dashboard.html

Constraints: HTML fragment only, no scripts, no external resources,
inline CSS, Mustache placeholders only (no triple-mustache, no partials,
no delimiter changes), template-agnostic keys. See the FORMAT skill for
the full specification.
```
