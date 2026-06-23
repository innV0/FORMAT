# FORMAT Specification

*Flat, Open, Readable â€” Model Architecture Template*

**Version V_0-1-2 â€” Draft**

FORMAT is a human-readable, agent-friendly, and version-controlled format for representing business models. It is designed to be easily authored by humans, generated/analyzed by AI agents, and versioned cleanly in Git.

FORMAT achieves this by consolidating the entire schema (Template), instances, and relationships into a single, self-contained Markdown file.

FORMAT defines **two layers**, both expressed in the same Markdown grammar:

- **Template layer (FORMAT base)**: the language used to *define a Template* (a schema). This layer is **metacircular** â€” it can describe itself (see Â§9). A Template document's filename ends with `_V_x-y-z_FORMAT.md`.
- **Business Model layer**: a concrete *model built from a Template*. This layer is **not** metacircular: a business model is described by its Template, not by itself. A business model document's filename ends with `_BM_V_x-y-z_FORMAT.md` and declares, in its frontmatter, the FORMAT version it conforms to.

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
                                 â”‚
         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
         â–¼                                               â–¼
[ concept (Category) ]                        [ element (Instance) ]
  â”œâ”€â”€ carries a type (cardinality)              â”œâ”€â”€ Can contain Fields (Key-Value)
  â””â”€â”€ e.g. text / list / weight / ...           â””â”€â”€ Can have markers (Scores)
```

- **BLOCK (Bloque)**: The generic term representing any structured visual or data unit in the model. `concept` and `element` are **two kinds (variants) of BLOCK**, not children of it: the relationship is *is-a* (a type discriminator), NOT *contains-a* (a parent-child hierarchy). Conceptually, a BLOCK carries a discriminator `block_kind âˆˆ { concept, element }`. They share common properties:
  - Both can be evaluated and tagged using **markers** (scores or attributes).
  - Both are represented in the UI using distinct badge/pill representations (concept badges represent types, element badges represent instances).

  > This is the single canonical definition of BLOCK. Other sections (e.g. Â§9) reference it rather than restate it.

- **Template (Plantilla)**: The schema defining the structure of the model. It defines the allowed **concepts**, **markers**, and **Matrix templates**. The frontmatter key is `template`. *(Formerly referred to as `FORMAT template`; see the alias table in Â§2.1.)*
- **concept (Concepto)**: A schema-level category of information (e.g., `problems`, `value propositions`, `stakeholders`, `business summary`).
  - Every concept has a metadata `type` defining its cardinality and representation. The closed catalog of valid types is defined in Â§4.2.
- **Concept Block**: The physical section in the Markdown body representing a concept. It is introduced by a header with a specific comment wrapper: `# <!-- block: concepts --> <concept_name>`.
- **element (Elemento)**: An individual instance of a concept. *(Formerly referred to as `item` or `node`.)*
  - **Single-Instance (Text) elements**: For concepts of type `text`, there is exactly one element per concept, represented by the entire text body under the concept block.
  - **Multi-Instance (List) elements**: For multi-instance concepts (e.g., `list`, `weight`), each element is represented as a bullet point.
- **Fields (Campos)**: Custom key-value properties or attributes defined for an element (e.g., `age`, `fears` for a `persona` element).
- **Matrix (Matriz)**: A table expressing relationships between elements. See Â§6 for the common anatomy and the three kinds.
- **marker (Marcador)**: An evaluative tag or score (e.g., `weight`, `completion`, `certainty`, `priority`) applied to elements or concepts.

---

### 2.1 Terminology Aliases for AI Agents

To ensure maximum parsing robustness and semantic understanding across different AI agents, the following alias mapping MUST be respected. The first column is the official term; `FORMAT template` is retained only as a legacy alias for `template`.

| Official Term | Allowed / Legacy Aliases (AI Context) |
| :--- | :--- |
| **Template** | `FORMAT template`, `schema`, `blueprint`, `model_structure`, `plantilla`, `esquema` |
| **concept** | `concept_type`, `block_type`, `category`, `entity_type`, `secciÃ³n`, `bloque_concepto` |
| **element** | `item`, `node`, `instance`, `record`, `concept_instance`, `nodo`, `Ã­tem`, `registro`, `elemento` |
| **BLOCK** | `block`, `bloque`, `card`, `pill`, `badge`, `pÃ­ldora`, `tarjeta` |
| **Matrix** | `mapping`, `grid`, `relational_grid`, `association_matrix`, `matriz`, `grilla`, `tabla_relacional` |
| **marker** | `score`, `metric`, `rating`, `evaluation_dimension`, `marcador`, `evaluaciÃ³n`, `indicador` |

---

## 3. Document Structure

Every FORMAT document is a single UTF-8 file containing two main parts:
1. **YAML Frontmatter**: The Template schema, versioning, and document metadata.
2. **Markdown Body**: The content sections separated by block comments.

```
path/to/model.md
â”œâ”€â”€ YAML Frontmatter Block (delimited by ---)
â”‚   â”œâ”€â”€ specification_version
â”‚   â”œâ”€â”€ specification_url
â”‚   â”œâ”€â”€ title
â”‚   â”œâ”€â”€ last_saved
â”‚   â””â”€â”€ template (The Template definition)
â”‚       â”œâ”€â”€ concepts
â”‚       â”‚   â””â”€â”€ fields (Optional custom properties schema)
â”‚       â”œâ”€â”€ markers
â”‚       â””â”€â”€ matrices
â””â”€â”€ Markdown Body
    â”œâ”€â”€ Concept Blocks (see Â§4.2 for valid types)
    â”‚   â””â”€â”€ elements (with indented Fields)
    â””â”€â”€ Matrix Blocks (hierarchy matrices, relational matrices, element-markers)
```

---

## 4. YAML Frontmatter Specification

The frontmatter MUST be a valid YAML block delimited by `---` lines.

#### Required compliance keys

For a document to be **FORMAT-compliant**, the frontmatter MUST declare which specification it conforms to, by version AND by URL:

- `specification_version` (Required): The version of the FORMAT specification this document conforms to, in SemVer rendered as `V_MAJOR-MINOR-PATCH` (see Â§8.2). Example: `"V_0-1-2"`.
- `specification_url` (Required): The canonical URL where that exact specification version is published. A document without a resolvable spec URL is NOT compliant.

Business Model documents (Â§8.1) MUST carry `specification_version` so that the FORMAT version they were built against is always recoverable from the file itself.

```yaml
---
specification_version: "V_0-1-2"
specification_url: "https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/DOCS/spec/V_0-1-2/spec.md"
title: "Project Ghostbusters Model"
model_version: "V_0-1-2"
last_saved: "2026-06-20T09:55:17.941Z"
template:
  title: "FORMAT Template"
  concepts:
    - name: "business summary"
      icon: "file-text"
      type: "text"
      color: "blue"
      weight: 90
    - name: "persona"
      icon: "user-round"
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
      icon: "plus"
      color: "blue"
  matrices:
    - name: "problems-value propositions matrix"
      source: "problems"
      target: "value propositions"
      params: "Min;Very Low;Low;Slightly Low;Neutral;Slightly High;High;Very High;Max"
---
```

### 4.1 Template Concept Keys

Each entry in `template.concepts` declares one concept. Keys:
- `name` (Required): The concept's lowercase name. MUST match the corresponding H1 header in the body (Â§7.1).
- `type` (Required): The concept's cardinality/representation. MUST be a value from the catalog in Â§4.2.
- `icon` (Optional): Lucide icon name (kebab-case, e.g. `target`, `users`) for the concept badge. Resolved from the canonical Template by concept name; legacy emoji glyphs are still accepted for backward compatibility.
- `color` (Optional): Theme color token for the concept badge.
- `weight` (Optional): Display/ordering weight for the concept within the Template.
- `fields` (Optional): Schema for custom element properties (Â§4.1.1).

> The `category_id` key has been **removed** in this revision. Grouping is now handled by the lens system (projections derived from hierarchy matrices), not by a static category reference on the concept.

#### 4.1.1 Concept Fields

Inside a concept definition, the optional `fields` array declares the schema for custom element properties:
- `name` (Required): The key identifier for the field (e.g., `age`).
- `type` (Optional): `'string' | 'boolean' | 'number' | 'select'`. Defaults to `'string'`.
- `options` / `choices` (Optional): An array of strings for dropdown selection when `type: 'select'`.
- `default` (Optional): The default fallback value for the field.

### 4.2 Concept Type Catalog

`concept.type` MUST be one of the following values:

| Type | Cardinality | Representation |
| :--- | :--- | :--- |
| `text` | Single-instance | Free-form markdown body is the single element. |
| `list` | Multi-instance | Bullet list of elements. |
| `weight` | Multi-instance | List of elements carrying a weight marker. |
| `category` | Multi-instance | List of elements acting as classifying categories. |
| `steps` | Multi-instance, ordered | Ordered list where order is meaningful. |
| `sequence` | Multi-instance, ordered | Ordered list expressing a sequence/flow. |

> The former `hierarchy` concept type has been **removed**. Parent-child structure is no longer a property of a concept; it is expressed through **hierarchy matrices** (Â§6.1) and surfaced via lenses.

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

#### 5.1.2 Multi-Instance Concepts and Fields
For multi-instance types (`list`, `weight`, `category`, `steps`, `sequence`), each element is listed as a bullet point. If the concept contains custom fields, they are represented as indented sub-bullets directly below the element name:

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

### 6.0 Common Matrix Anatomy
Every matrix shares the same shape:
- A header introducing the matrix: `# <!-- block: matrices --> <matrix_name>`.
- A Markdown table whose top-left cell names the axes as `<row_concept> \ <column_concept>` (rows = source, columns = target).
- Row headers list source elements; column headers list target elements.
- A cell value of `-` is treated as null/empty (no association). Cell semantics depend on the matrix kind below.

### 6.1 Hierarchy Matrices
Used to resolve parent-child tree relationships between concepts (e.g. `stakeholders` $\rightarrow$ `segments`). An `X` cell value declares a parent-child relationship. Hierarchy matrices are the canonical source from which lenses project tree views.

```markdown
# <!-- block: matrices --> stakeholders-segments hierarchy matrix

| stakeholders \ segments | Distressed Homeowners | Haunted Hotel Managers |
| :--- | :---: | :---: |
| **B2C Clients** | X | - |
| **B2B Commercial** | - | X |
```

### 6.2 Relational Matrices
Expresses N-to-N association cells using the values configured in the Template's `params`. The `params` string (a `;`-separated ordered scale) defines the allowed cell values and drives the interactive cell widget (`boolean`, `cycle`, `scale`, `set`).

```markdown
# <!-- block: matrices --> problems-value propositions matrix

| problems \ value propositions | Instant Spectral Capture | Property Damage Mitigation |
| :--- | :---: | :---: |
| **Spectral Infestation** | Max | Neutral |
| **Fear of Property Damage** | - | High |
```

### 6.3 Element-Markers Matrix
A reserved matrix mapping elements to their numeric marker evaluations. *(Formerly referred to as `item-markers matrix`.)*

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

### 7.5 Global Element-Name Uniqueness

Element names MUST be unique across the **entire model**, not merely within a single concept. Because matrices reference elements by name (Â§6.0), a name shared by two elements would make those references ambiguous.

When a duplicate name is detected â€” on **load**, on **add**, or on **edit** â€” the application MUST prompt the user to disambiguate before accepting the model:
- The default suggestion presented to the user is the element name followed by its concept in parentheses, e.g. `B2C Clients (segments)`.
- This suggestion MUST be **editable**: the user may accept it or type any other unique name.

A model containing unresolved duplicate names is not considered valid for matrix resolution.

---

## 8. Compliance & Naming

### 8.1 File Naming Convention

A FORMAT-compliant file MUST end its name with the suffix `_FORMAT.md`. The segment preceding it distinguishes the two layers (Â§intro):

- **Template document** (metacircular template-definition layer):
  ```
  <Name>_V_x-y-z_FORMAT.md
  ```
- **Business Model document** (a model built from a Template):
  ```
  <Name>_BM_V_x-y-z_FORMAT.md
  ```

Where:
- `<Name>`: The Template or model name.
- `_BM_`: The marker identifying a Business Model document. Its absence identifies a Template document.
- `V_x-y-z`: The document's own version, using Â§8.2.
- `_FORMAT.md`: The mandatory compliance suffix.

Examples: `FORMAT_V_0-1-2_FORMAT.md` (a Template), `Ghostbusters_BM_V_0-1-2_FORMAT.md` (a Business Model).

### 8.2 Versioning Format

All version strings in the FORMAT ecosystem (the specification version, the `specification_version` / `model_version` frontmatter keys, and the `<Version>` segment of the filename) use **Semantic Versioning**, rendered with a `V_` prefix and hyphen separators instead of dots:

```
V_MAJOR-MINOR-PATCH
```

Example: SemVer `0.1.1` is rendered as `V_0-1-2`.

### 8.3 Compliance Checklist

A document is FORMAT-compliant only if ALL of the following hold:
1. Filename matches the naming convention for its layer â€” `<Name>_V_x-y-z_FORMAT.md` or `<Name>_BM_V_x-y-z_FORMAT.md` (Â§8.1).
2. Frontmatter declares `specification_version` in `V_MAJOR-MINOR-PATCH` form (Â§4, Â§8.2).
3. Frontmatter declares a resolvable `specification_url` pointing to that exact spec version (Â§4).
4. Element names are globally unique, with no unresolved duplicates (Â§7.5).

---

## 9. Metacircularity (Self-Description)

Metacircularity applies to the **Template layer (FORMAT base)** only â€” the format used to *define Templates*. That layer can describe itself: the vocabulary FORMAT uses to model a domain â€” `BLOCK`, `concept`, `element`, `marker`, `Matrix`, `Field` (defined canonically in Â§2) â€” is itself a small relational model, and therefore expressible as a Template document.

The **Business Model layer is not metacircular**: a business model does not describe itself; it is described by the Template it was built from.

This yields a self-hosting test analogous to a compiler compiling its own source: if FORMAT can faithfully represent its own Template, its expressiveness for relational ontologies is validated.

### 9.1 Scope of Self-Description

Only the **ontological layer** of this specification is self-describable:
- **Self-describable (Â§2â€“Â§4):** the entities and their relationships â€” the Template itself.
- **NOT self-describable (Â§5â€“Â§7):** the procedural grammar and parsing rules. These are sequential, conditional instructions, not a network of entities, and MUST remain narrative Markdown. Forcing them into FORMAT would defeat the readability goal of Â§1.

### 9.2 Mapping the Template onto FORMAT

When FORMAT describes its own Template layer, its primitives map as concepts and relationships (see Â§2 for the canonical definitions):

- `BLOCK` is a single concept carrying a discriminator field `block_kind âˆˆ { concept, element }` (is-a, not contains-a).
- `concept â†’ element` (a concept has many element instances) is a **hierarchy matrix**.
- `element â†’ Field` (an element declares custom fields) is a **hierarchy matrix**.
- `BLOCK â†’ marker` (blocks are evaluated by markers) is a **relational matrix** (N-to-N).
- `Matrix` links a source `concept` to a target `concept` â€” a **relational matrix** over concepts.

A self-describing Template document is itself subject to Â§8: it is named e.g. `FORMAT_V_0-1-2_FORMAT.md` (the Template layer, no `_BM_` segment) and declares its own `specification_version` and `specification_url`.
