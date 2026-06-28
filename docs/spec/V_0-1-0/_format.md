# FORMAT Specification

*Flat, Omnipotent, Readable, Model, Annotated, Template*

**Version V_0-1-0 ΓÇö Draft**

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
                                 Γöé
           ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓö┤ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
           Γû╝                                               Γû╝
 [ concept (Category) ]                        [ element (Instance) ]
   Γö£ΓöÇΓöÇ type: "text" (Single element)             Γö£ΓöÇΓöÇ Can contain Fields (Key-Value)
   ΓööΓöÇΓöÇ type: list/hierarchy (N elements)         ΓööΓöÇΓöÇ Can have markers (Scores)
```

- **BLOCK (Bloque)**: The generic term representing any structured visual or data unit in the model. `concept` and `element` are **two kinds (variants) of BLOCK**, not children of it: the relationship is *is-a* (a type discriminator), NOT *contains-a* (a parent-child hierarchy). Conceptually, a BLOCK carries a discriminator `block_kind Γêê { concept, element }`. They share common properties:
  - Both can be evaluated and tagged using **markers** (scores or attributes).
  - Both are represented in the UI using distinct badge/pill representations (concept badges represent types, element badges represent instances).
- **Template (Plantilla)**: The schema defining the structure of the model. It defines the allowed **concepts**, **markers**, and **Matrix templates**. (Formerly referred to as *metamodel*).
- **concept (Concepto)**: A schema-level category of information (e.g., `problems`, `value propositions`, `stakeholders`, `business summary`).
  - Every concept has a metadata `type` defining its cardinality and representation (e.g., `text`, `category`, `weight`, `steps`, `sequence`).
- **Concept Block**: The physical section in the Markdown body representing a concept. It is introduced by a header with a specific comment wrapper: `# <!-- block: concepts --> <concept_name>`.
- **element (Elemento)**: An individual instance of a concept. (Formerly referred to as *item* or *node*).
  - **Single-Instance (Text) elements**: For concepts of type `text`, there is exactly one element per concept, represented by the entire text body under the concept block.
  - **Multi-Instance (List) elements**: For list concepts, each element is represented as a bullet point.
- **Fields (Campos)**: Custom key-value properties or attributes defined for an element (e.g., `age`, `fears` for a `persona` element).
- **Matrix (Matriz)**: A table expressing relationships between elements.
  - **Hierarchy Matrix (Matriz Jer├írquica)**: Defines the parent-child tree linkages between different hierarchical concepts (e.g., `stakeholders` $\rightarrow$ `segments`).
  - **Relational Matrix (Matriz Relacional)**: Defines N-to-N relationships between elements of concept A and concept B, with cell values managed by interactive widgets (`boolean`, `cycle`, `scale`, `set`).
  - **element-markers Matrix**: Maps elements to their numerical **marker** evaluations.
- **marker (Marcador)**: An evaluative tag or score (e.g., `weight`, `completion`, `certainty`, `priority`) applied to elements or concepts.

---

### 2.1 Terminology Aliases for AI Agents

To ensure maximum parsing robustness and semantic understanding across different AI agents, the following alias mapping MUST be respected:

| Official Term | Allowed / Legacy Aliases (AI Context) |
| :--- | :--- |
| **Template** | `metamodel`, `schema`, `blueprint`, `model_structure`, `plantilla`, `esquema` |
| **concept** | `concept_type`, `block_type`, `category`, `entity_type`, `secci├│n`, `bloque_concepto` |
| **element** | `item`, `node`, `instance`, `record`, `concept_instance`, `nodo`, `├¡tem`, `registro`, `elemento` |
| **BLOCK** | `block`, `bloque`, `card`, `pill`, `badge`, `p├¡ldora`, `tarjeta` |
| **Matrix** | `mapping`, `grid`, `relational_grid`, `association_matrix`, `matriz`, `grilla`, `tabla_relacional` |
| **marker** | `score`, `metric`, `rating`, `evaluation_dimension`, `marcador`, `evaluaci├│n`, `indicador` |

---

## 3. Document Structure

Every FORMAT document is a single UTF-8 file containing two main parts:
1. **YAML Frontmatter**: The Template schema, versioning, and document metadata.
2. **Markdown Body**: The content sections separated by block comments.

```
path/to/model.md
Γö£ΓöÇΓöÇ YAML Frontmatter Block (delimited by ---)
Γöé   Γö£ΓöÇΓöÇ specification_version
Γöé   Γö£ΓöÇΓöÇ title
Γöé   Γö£ΓöÇΓöÇ last_saved
Γöé   ΓööΓöÇΓöÇ template (The Template definition)
Γöé       Γö£ΓöÇΓöÇ concepts
Γöé       Γöé   ΓööΓöÇΓöÇ fields (Optional custom properties schema)
Γöé       Γö£ΓöÇΓöÇ markers
Γöé       ΓööΓöÇΓöÇ matrices
Γöé           ΓööΓöÇΓöÇ params (Possible widget options, e.g., RACI or scale parameters)
ΓööΓöÇΓöÇ Markdown Body
    Γö£ΓöÇΓöÇ Document Notice (GFM [!NOTE] admonition)
    Γö£ΓöÇΓöÇ Concept Blocks (type: text, list, hierarchy)
    Γöé   ΓööΓöÇΓöÇ elements (with custom fields in YAML code blocks)
    ΓööΓöÇΓöÇ Matrix Blocks (hierarchy matrices, relational matrices, element-markers)
```

---

### 3.1 Document Notice (Required)

The first content in the Markdown body ΓÇö immediately after the frontmatter delimiter and before any concept block ΓÇö MUST be a GFM blockquote notice identifying the file as a FORMAT document and pointing to the visual editor.

Format:
```markdown
> [!NOTE]
> This is a **FORMAT document** ΓÇö a plain-text Markdown file that carries its own schema in the YAML frontmatter. You can edit it as raw text in any editor, or open it in the [FORMAT app](https://format.innv0.com) for a guided visual editor.
```

Rules:
- The notice MUST appear exactly once, as the first block in the Markdown body.
- The notice MUST be a GFM `> [!NOTE]` admonition (GitHub Flavored Markdown).
- Parsers MUST ignore this block when extracting concepts and matrices (it carries no model data).
- Serializers MUST emit this block as the first element of the Markdown body, before the reserved `index` concept block.

---

## 4. YAML Frontmatter Specification

The frontmatter MUST be a valid YAML block delimited by `---` lines.

#### Required compliance keys

For a document to be **FORMAT-compliant**, the frontmatter MUST declare which specification it conforms to, by version AND by URL:

- `specification_version` (Required): The version of the FORMAT specification this document conforms to, in SemVer rendered as `V_MAJOR-MINOR-PATCH`. Example: `"V_0-1-0"`.
- `specification_url` (Required): The canonical URL where that exact specification version is published. A document without a resolvable spec URL is NOT compliant.

```yaml
---
specification_version: "V_0-1-0"
specification_url: "https://raw.githubusercontent.com/innV0/FORMAT/main/docs/V_0-1-0/_format.md"
title: "Project Ghostbusters Model"
model_version: "V_0-3-0"
last_saved: "2026-06-23T15:12:19.852Z"
template:
  name: "business"
  version: "V_1-0-0"
  title: "innV0 Metamodel"
  concepts:
    - name: "business summary"
      category_id: null
      emoji: "≡ƒôä"
      type: "text"
      color: "blue"
      weight: 90
    - name: "persona"
      category_id: "profiles"
      emoji: "≡ƒôä"
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
      emoji: "Γ₧ò"
      color: "blue"
  matrices:
    - name: "problems-value propositions matrix"
      source: "problems"
      target: "value propositions"
      params: "Max;Very High;High;Slightly High;Neutral;Slightly Low;Low;Very Low;Min"
      min_color: "green"
      max_color: "red"
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

#### 5.1.1 The Reserved 'index' Concept Block
The `index` concept name is a reserved keyword. It MUST be the first concept block in the Markdown body. It is used to declare the taxonomy hierarchy tree of the template.

The body of the `index` block MUST be an indented list of wiki-links representing the parent-child relationships between concepts.

Format:
```markdown
# <!-- block: concepts --> index
* [[Parent Concept]]
  * [[Child Concept]]
```

#### 5.1.2 Text-Type Concepts (Single-Instance)
The body is free-form markdown representing the concept's single element content:
```markdown
# <!-- block: concepts --> business summary
Ghostbusters is a professional paranormal investigation and elimination service...
```

#### 5.1.3 List-Type Concepts (Multi-Instance) and Fields

Each element is listed as a bullet point. If the concept contains custom fields, they MUST be represented as an indented **YAML code block** directly below the element name. 

Format:
```markdown
# <!-- block: concepts --> persona
* <!-- block: persona --> Alice the Librarian
  ```yaml
  age: 45
  fears: Class IV vapors
  department: Rare Books
  ```
  Traditionalist, highly protective of the library's collection, easily terrified...
```

- Element separator: `* <!-- block: <concept_name> --> Element Name` or `- <!-- block: <concept_name> --> Element Name`.
- YAML Code Block: Embedded using `  ```yaml ` and `  ``` ` (must be indented by 2 or more spaces). Inside the code block, fields are written as valid YAML key-value pairs.
- Element Description: Follows the fields block or name line and extends until the next block separator.

### 5.2 Wiki-links and Cross-References
Any concept or element description can contain wiki-links in the format `[[Name]]` to reference other concepts or elements. All concept and element names are guaranteed to be globally unique within the document.

#### 5.2.1 GFM Compatibility Note
While standard GitHub Flavored Markdown (GFM) renders double-bracket links `[[Name]]` as plain text, this syntax is chosen for readability and editing ease. The FORMAT client application parses and renders them as interactive links.

---

## 6. Matrices Section

All matrices are declared under the matrices separator block:
```markdown
<!-- block: matrices -->
```

### 6.1 Hierarchy Matrices (Deprecated)
Formerly used to resolve parent-child tree relationships between hierarchical concepts (e.g. `stakeholders` $\rightarrow$ `segments`). An `X` cell value declared a parent-child relationship.

> [!NOTE]
> Hierarchy matrices are deprecated and replaced by the reserved `# <!-- block: concepts --> index` block at the beginning of the Markdown body. Parsers should support the `index` block taxonomy list instead of parsing hierarchy matrices.

Format (Legacy):
```markdown
# <!-- block: matrices --> stakeholders-segments hierarchy matrix

| stakeholders \ segments | Distressed Homeowners | Haunted Hotel Managers |
| :--- | :---: | :---: |
| B2C Clients | X | - |
| B2B Commercial | - | X |
```

### 6.2 Relational Matrices
Expresses association cells using the values configured in the Template.

Format:
```markdown
# <!-- block: matrices --> problems-value propositions matrix

| problems \ value propositions | Instant Spectral Capture | Property Damage Mitigation |
| :--- | :---: | :---: |
| Spectral Infestation | Max | Neutral |
| Fear of Property Damage | - | High |
```

### 6.3 Element-Markers Matrix
A reserved matrix mapping elements to their numeric marker evaluations. (Formerly referred to as *item-markers matrix*).

Format:
```markdown
# <!-- block: matrices --> item-markers matrix

| Item \ Marker | weight | certainty | priority |
| :--- | :---: | :---: | :---: |
| B2C Clients | 4 | 5 | 5 |
```

---

## 7. Parsing & Serialization Rules

1. **Title Alignment**: Concept header names MUST match the lowercase names in the Template.
2. **Whitespace Tolerance**: Parsers must trim whitespaces from names, markers, and values.
3. **Escaped Formatting**: Row and column headers of matrices should not be written in bold by default. Bold wrappers (`**`) and markdown links/brackets inside table headers or element names must be stripped during element extraction if present.
4. **Missing Values**: Cells containing `-` are treated as null/empty associations.
5. **Cycle Default Values**: Widgets of type `cycle` must support and default to an empty/blank value (`'-'`).
6. **Matrix Color Limits**: Relational matrices can optionally configure a `min_color` and `max_color` to represent values visually.
7. **YAML Block Fields**: When extracting fields from list elements, the parser must locate the ` ```yaml ` block directly after the element line and parse its content as a clean YAML block.

---

## 8. Compliance & Naming

### 8.1 File Naming Convention

A FORMAT-compliant file MUST end its name with the suffix `_FORMAT.md`.

The full filename is composed as:

```
<ModelName>_V_<Version>_<TemplateName>_FORMAT.md
```

- `<ModelName>`: The model's name.
- `<Version>`: The model's own version, using the versioning format defined in ┬º8.2.
- `<TemplateName>`: The name of the template this model conforms to (e.g., `business` or `procedures`).
- `_FORMAT.md`: The mandatory compliance suffix.

Example: `Ghostbusters_V_0-3-0_business_FORMAT.md`

### 8.1.1 Recommended Repository Structure

The recommended directory layout for a FORMAT repository is:

```
docs/templates/
Γö£ΓöÇΓöÇ <TemplateName>/
Γöé   ΓööΓöÇΓöÇ V_x-y-z/
Γöé       Γö£ΓöÇΓöÇ <TemplateName>_V_x-y-z_FORMAT.md   # Template definition
Γöé       Γö£ΓöÇΓöÇ documentation.md                     # Template documentation
Γöé       ΓööΓöÇΓöÇ samples/                             # Sample models using this template
Γöé           Γö£ΓöÇΓöÇ <ModelName>_V_x-y-z_<TemplateName>_FORMAT.md
Γöé           ΓööΓöÇΓöÇ ...
```

- **Template**: The canonical schema file at `docs/templates/<TemplateName>/V_x-y-z/<TemplateName>_V_x-y-z_FORMAT.md`.
- **Samples**: Example models demonstrating the template, stored alongside it in the `samples/` subdirectory.
- **Documentation**: Optional template documentation file (`documentation.md`).

This structure keeps templates, their documentation, and their samples co-located and self-describing. Samples are tracked in version control alongside the template they demonstrate.

Example:
```
docs/templates/business/V_1-0-0/
Γö£ΓöÇΓöÇ business_V_1-0-0_FORMAT.md
Γö£ΓöÇΓöÇ documentation.md
ΓööΓöÇΓöÇ samples/
    Γö£ΓöÇΓöÇ Acme_V_1-0-0_business_FORMAT.md
    ΓööΓöÇΓöÇ Ghostbusters_V_0-3-0_business_FORMAT.md
```

### 8.2 Versioning Format

All version strings in the FORMAT ecosystem (the specification version, the `specification_version` / `model_version` frontmatter keys, and the version segment of the filename) use **Semantic Versioning**, rendered with a `V_` prefix and hyphen separators instead of dots:

```
V_MAJOR-MINOR-PATCH
```

Example: SemVer `0.3.0` is rendered as `V_0-3-0`.

### 8.3 Compliance Checklist

A document is FORMAT-compliant only if ALL of the following hold:
1. Filename matches `<ModelName>_V_<Version>_<TemplateName>_FORMAT.md` (┬º8.1).
2. Frontmatter declares `specification_version` in `V_MAJOR-MINOR-PATCH` form (┬º4, ┬º8.2).
3. Frontmatter declares a resolvable `specification_url` pointing to that exact spec version (┬º4).
4. Markdown body begins with the required Document Notice (┬º3.1).

---

## 9. Metacircularity (Self-Description)

FORMAT is **metacircular**: the specification can describe itself in its own format. The vocabulary FORMAT uses to model a domain ΓÇö `BLOCK`, `concept`, `element`, `marker`, `Matrix`, `Field` ΓÇö is itself a small relational model, and therefore expressible as a FORMAT document.

This yields a self-hosting test analogous to a compiler compiling its own source: if FORMAT can faithfully represent its own metamodel, its expressiveness for relational ontologies is validated.

### 9.1 Scope of Self-Description

Only the **ontological layer** of this specification is self-describable:
- **Self-describable (┬º2ΓÇô┬º4):** the entities and their relationships ΓÇö the metamodel itself.
- **NOT self-describable (┬º5ΓÇô┬º7):** the procedural grammar and parsing rules. These are sequential, conditional instructions, not a network of entities, and MUST remain narrative Markdown. Forcing them into FORMAT would defeat the readability goal of ┬º1.

### 9.2 Mapping the Metamodel onto FORMAT

When FORMAT describes itself, its own primitives map as concepts and relationships:

- `BLOCK` is a single concept carrying a discriminator field `block_kind Γêê { concept, element }`. The concept/element distinction is a **kind discriminator (is-a)**, NOT a hierarchy matrix (contains-a).
- `concept ΓåÆ element` (a concept has many element instances) is a **hierarchy matrix**.
- `element ΓåÆ Field` (an element declares custom fields) is a **hierarchy matrix**.
- `BLOCK ΓåÆ marker` (blocks are evaluated by markers) is a **relational matrix** (N-to-N).
- `Matrix` links a source `concept` to a target `concept` ΓÇö a **relational matrix** over concepts.

A self-describing document is itself subject to ┬º8: it is named e.g. `FORMAT_V_0-1-0_FORMAT.md` and declares its own `specification_version` and `specification_url`.
