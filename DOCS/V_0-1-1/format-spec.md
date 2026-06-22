# FORMAT Specification

*Flat, Open, Readable — Model Architecture Template*

**Version V_0-1-1 — Draft**

FORMAT is a human-readable, agent-friendly, and version-controlled format for representing business models. It is designed to be easily authored by humans, generated/analyzed by AI agents, and versioned cleanly in Git.

FORMAT achieves this by consolidating the entire schema (Template), instances, and relationships into a single, self-contained Markdown file.

---

## 1. Motivation

Traditional business modeling tools store data in opaque JSON/XML formats or relational databases. This creates several problems:
- **Lack of Portability**: Models cannot be easily shared or read without dedicated software.
- **Poor Diffing**: Standard database exports produce noisy diffs in version control.
- **AI Friction**: LLMs/agents struggle to read and write complex relational structures without custom adapters.

FORMAT takes the position that a business model is best represented as a **structured Markdown document** that is:
- **Readable** without specialized tooling.
- **Parseable** by standard Markdown and YAML parsers.
- **Diffable** using standard Git tooling.
- **Self-contained**, carrying its own schema (Template) definition inside its frontmatter.

---

## 2. Terminology (The Unified Model)

To resolve terminology ambiguity, FORMAT defines a clean, unified conceptual hierarchy:

```
                  [ BLOCK (Generic Card/Pill Unit) ]
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
[ concept (Category) ]                        [ element (Instance) ]
  ├── type: "text" (Single element)             ├── Can contain Fields (Key-Value)
  └── type: list/hierarchy (N elements)         └── Can have markers (Scores)
```

- **BLOCK (Bloque)**: The generic term representing any structured visual or data unit in the model. `concept` and `element` are **two kinds (variants) of BLOCK**, not children of it: the relationship is *is-a* (a type discriminator), NOT *contains-a* (a parent-child hierarchy). Conceptually, a BLOCK carries a discriminator `block_kind ∈ { concept, element }`. They share common properties:
  - Both can be evaluated and tagged using **markers** (scores or attributes).
  - Both are represented in the UI using distinct badge/pill representations (concept badges represent types, element badges represent instances).
- **Template (Plantilla)**: The schema defining the structure of the model. It defines the allowed **concepts**, **markers**, and **Matrix templates**. (Formerly referred to as *metamodel*).
- **concept (Concepto)**: A schema-level category of information (e.g., `problems`, `value propositions`, `stakeholders`, `business summary`).
  - Every concept has a metadata `type` defining its cardinality and representation (e.g., `text`, `category`, `weight`, `steps`, `sequence`).
- **Concept Block**: The physical section in the Markdown body representing a concept. It is introduced by a header with a specific comment wrapper: `# <!-- block: concepts --> <concept_name>`.
- **element (Elemento)**: An individual instance of a concept. (Formerly referred to as *item* or *node*).
  - **Single-Instance (Text) elements**: For concepts of type `text`, there is exactly one element per concept, represented by the entire text body under the concept block.
  - **Multi-Instance (List) elements**: For list concepts (e.g., of type `weight`), each element is represented as a bullet point.
- **Fields (Campos)**: Custom key-value properties or attributes defined for an element (e.g., `age`, `fears` for a `persona` element).
- **Matrix (Matriz)**: A table expressing relationships between elements.
  - **Hierarchy Matrix (Matriz Jerárquica)**: Defines the parent-child tree linkages between different hierarchical concepts (e.g., `stakeholders` $\rightarrow$ `segments`).
  - **Relational Matrix (Matriz Relacional)**: Defines N-to-N relationships between elements of concept A and concept B, with cell values managed by interactive widgets (`boolean`, `cycle`, `scale`, `set`).
  - **element-markers Matrix**: Maps elements to their numerical **marker** evaluations.
- **marker (Marcador)**: An evaluative tag or score (e.g., `weight`, `completion`, `certainty`, `priority`) applied to elements or concepts.

---

### 2.1 Terminology Aliases for AI Agents

To ensure maximum parsing robustness and semantic understanding across different AI agents, the following alias mapping MUST be respected:

| Official Term | Allowed / Legacy Aliases (AI Context) |
| :--- | :--- |
| **Template** | `metamodel`, `schema`, `blueprint`, `model_structure`, `plantilla`, `esquema` |
| **concept** | `concept_type`, `block_type`, `category`, `entity_type`, `sección`, `bloque_concepto` |
| **element** | `item`, `node`, `instance`, `record`, `concept_instance`, `nodo`, `ítem`, `registro`, `elemento` |
| **BLOCK** | `block`, `bloque`, `card`, `pill`, `badge`, `píldora`, `tarjeta` |
| **Matrix** | `mapping`, `grid`, `relational_grid`, `association_matrix`, `matriz`, `grilla`, `tabla_relacional` |
| **marker** | `score`, `metric`, `rating`, `evaluation_dimension`, `marcador`, `evaluación`, `indicador` |

---

## 3. Document Structure

Every FORMAT document is a single UTF-8 file containing two main parts:
1. **YAML Frontmatter**: The Template schema, versioning, and document metadata.
2. **Markdown Body**: The content sections separated by block comments.

```
path/to/model.md
├── YAML Frontmatter Block (delimited by ---)
│   ├── specification_version
│   ├── title
│   ├── last_saved
│   └── metamodel (The Template definition)
│       ├── concepts
│       │   └── fields (Optional custom properties schema)
│       ├── markers
│       └── matrices
└── Markdown Body
    ├── Concept Blocks (type: text, list, hierarchy)
    │   └── elements (with indented Fields)
    └── Matrix Blocks (hierarchy matrices, relational matrices, element-markers)
```

---

## 4. YAML Frontmatter Specification

The frontmatter MUST be a valid YAML block delimited by `---` lines.

#### Required compliance keys

For a document to be **FORMAT-compliant**, the frontmatter MUST declare which specification it conforms to, by version AND by URL:

- `specification_version` (Required): The version of the FORMAT specification this document conforms to, in SemVer rendered as `V_MAJOR-MINOR-PATCH` (see §8.2). Example: `"V_0-1-1"`.
- `specification_url` (Required): The canonical URL where that exact specification version is published. A document without a resolvable spec URL is NOT compliant.

```yaml
---
specification_version: "V_0-1-1"
specification_url: "https://format.innv0.com/spec/v0-1-1/format-spec.md"
title: "Project Ghostbusters Model"
model_version: "V_0-1-1"
last_saved: "2026-06-20T09:55:17.941Z"
metamodel:
  title: "innV0 Metamodel"
  concepts:
    - name: "business summary"
      category_id: null
      emoji: "📄"
      type: "text"
      color: "blue"
      weight: 90
    - name: "persona"
      category_id: "profiles"
      emoji: "📄"
      type: "text"
      color: "blue"
      weight: 40
      fields:
        - name: "age"
          type: "number"
        - name: "fears"
          type: "string"
        - name: "department"
          type: "string"
  markers:
    - name: "weight"
      symbol: "*"
      emoji: "➕"
      color: "blue"
  matrices:
    - name: "problems-value propositions matrix"
      source: "problems"
      target: "value propositions"
      params: "Max;Very High;High;Slightly High;Neutral;Slightly Low;Low;Very Low;Min"
---
```

### 4.1 Template Concept Fields

Inside a concept definition, the optional `fields` array declares the schema for custom element properties:
- `name` (Required): The key identifier for the field (e.g., `age`).
- `type` (Optional): `'string' | 'boolean' | 'number' | 'select'`. Defaults to `'string'`.
- `options` / `choices` (Optional): An array of strings for dropdown selection when `type: 'select'`.
- `default` (Optional): The default fallback value for the field.

---

## 5. Markdown Body Grammar

### 5.1 Concept Blocks

Every concept defined in the Template MUST have a corresponding H1 header in the Markdown body.

Format:
```markdown
# <!-- block: concepts --> <concept_name>
```

#### 5.1.1 Text-Type Concepts (Single-Instance)
The body is free-form markdown representing the concept's single element content:
```markdown
# <!-- block: concepts --> business summary
Ghostbusters is a professional paranormal investigation and elimination service...
```

#### 5.1.2 List/Weight-Type Concepts (Multi-Instance) and Fields
Each element is listed as a bullet point. If the concept contains custom fields, they are represented as indented sub-bullets directly below the element name:

```markdown
# <!-- block: concepts --> persona
* <!-- block: persona --> Alice the Librarian
  - age: 45
  - fears: Class IV vapors
  - department: Rare Books
Traditionalist, highly protective of the library's collection, easily terrified...
```

- Element separator: `* <!-- block: <concept_name> --> Element Name` or `- <!-- block: <concept_name> --> Element Name`.
- Indented Key-Value Fields: `  - key: value` or `  * key: value`. Must be indented by 2 or more spaces.
- Element Description: Follows the fields block or name line and extends until the next block separator.

---

## 6. Matrices Section

All matrices are declared under the matrices separator block:
```markdown
<!-- block: matrices -->
```

### 6.1 Hierarchy Matrices
Used to resolve parent-child tree relationships between hierarchical concepts (e.g. `stakeholders` $\rightarrow$ `segments`). An `X` cell value declares a parent-child relationship.

Format:
```markdown
# <!-- block: matrices --> stakeholders-segments hierarchy matrix

| stakeholders \ segments | Distressed Homeowners | Haunted Hotel Managers |
| :--- | :---: | :---: |
| **B2C Clients** | X | - |
| **B2B Commercial** | - | X |
```

### 6.2 Relational Matrices
Expresses association cells using the values configured in the Template.

Format:
```markdown
# <!-- block: matrices --> problems-value propositions matrix

| problems \ value propositions | Instant Spectral Capture | Property Damage Mitigation |
| :--- | :---: | :---: |
| **Spectral Infestation** | Max | Neutral |
| **Fear of Property Damage** | - | High |
```

### 6.3 Element-Markers Matrix
A reserved matrix mapping elements to their numeric marker evaluations. (Formerly referred to as *item-markers matrix*).

Format:
```markdown
# <!-- block: matrices --> element-markers matrix

| Element \ Marker | weight | certainty | priority |
| :--- | :---: | :---: | :---: |
| **B2C Clients** | 4 | 5 | 5 |
```

---

## 7. Parsing & Serialization Rules

1. **Title Alignment**: Concept header names MUST match the lowercase names in the Template.
2. **Whitespace Tolerance**: Parsers must trim whitespaces from names, markers, and values.
3. **Escaped Formatting**: Bold wrappers (`**`) and markdown links/brackets inside table headers or element names must be stripped during element extraction.
4. **Missing Values**: Cells containing `-` are treated as null/empty associations.

---

## 8. Compliance & Naming

### 8.1 File Naming Convention

A FORMAT-compliant file MUST end its name with the suffix `_FORMAT.md`.

The full filename is composed as:

```
<ModelName>_<Version>_FORMAT.md
```

- `<ModelName>`: The model's name.
- `<Version>`: The model's own version, using the versioning format defined in §8.2.
- `_FORMAT.md`: The mandatory compliance suffix.

Example: `Ghostbusters_V_0-1-1_FORMAT.md`

### 8.2 Versioning Format

All version strings in the FORMAT ecosystem (the specification version, the `specification_version` / `model_version` frontmatter keys, and the `<Version>` segment of the filename) use **Semantic Versioning**, rendered with a `V_` prefix and hyphen separators instead of dots:

```
V_MAJOR-MINOR-PATCH
```

Example: SemVer `0.1.1` is rendered as `V_0-1-1`.

### 8.3 Compliance Checklist

A document is FORMAT-compliant only if ALL of the following hold:
1. Filename matches `<ModelName>_<Version>_FORMAT.md` (§8.1).
2. Frontmatter declares `specification_version` in `V_MAJOR-MINOR-PATCH` form (§4, §8.2).
3. Frontmatter declares a resolvable `specification_url` pointing to that exact spec version (§4).

---

## 9. Metacircularity (Self-Description)

FORMAT is **metacircular**: the specification can describe itself in its own format. The vocabulary FORMAT uses to model a domain — `BLOCK`, `concept`, `element`, `marker`, `Matrix`, `Field` — is itself a small relational model, and therefore expressible as a FORMAT document.

This yields a self-hosting test analogous to a compiler compiling its own source: if FORMAT can faithfully represent its own metamodel, its expressiveness for relational ontologies is validated.

### 9.1 Scope of Self-Description

Only the **ontological layer** of this specification is self-describable:
- **Self-describable (§2–§4):** the entities and their relationships — the metamodel itself.
- **NOT self-describable (§5–§7):** the procedural grammar and parsing rules. These are sequential, conditional instructions, not a network of entities, and MUST remain narrative Markdown. Forcing them into FORMAT would defeat the readability goal of §1.

### 9.2 Mapping the Metamodel onto FORMAT

When FORMAT describes itself, its own primitives map as concepts and relationships:

- `BLOCK` is a single concept carrying a discriminator field `block_kind ∈ { concept, element }`. The concept/element distinction is a **kind discriminator (is-a)**, NOT a hierarchy matrix (contains-a).
- `concept → element` (a concept has many element instances) is a **hierarchy matrix**.
- `element → Field` (an element declares custom fields) is a **hierarchy matrix**.
- `BLOCK → marker` (blocks are evaluated by markers) is a **relational matrix** (N-to-N).
- `Matrix` links a source `concept` to a target `concept` — a **relational matrix** over concepts.

A self-describing document is itself subject to §8: it is named e.g. `FORMAT_V_0-1-1_FORMAT.md` and declares its own `specification_version` and `specification_url`.
