---
name: "FORMAT-authoring"
description: "Author, update, and validate files conforming to the _FORMAT.md specification (Business and Procedures templates)."
---

# FORMAT Model Authoring and Validation Skill

This skill allows the agent to read, write, and validate documents conforming to the **FORMAT** specification. 

All FORMAT-compliant files use the `.md` extension and follow a specific naming convention:
- **Model Document:** `<ModelName>_V_x-y-z_<TemplateName>_FORMAT.md` (e.g., `Ghostbusters_V_0-3-2_business_FORMAT.md`)
- **Template/Specification:** `<TemplateOrSpecName>_V_x-y-z_FORMAT.md` (e.g., `business_V_1-0-0_FORMAT.md`)

## 1. Reference Locations (On-Demand Loading)
To keep this skill lightweight and maintain a single source of truth, do not duplicate specification files locally in the skill. Instead, when validation or generation is requested, use your web-reading tools (e.g., `read_url_content`) to load the following canonical sources on-demand:

* **Official FORMAT Specification (V_0-1-2):**
  `https://raw.githubusercontent.com/innV0/FORMAT/main/DOCS/V_0-1-2/_format.md`
* **Business Template (V_1-0-0):**
  `https://raw.githubusercontent.com/innV0/FORMAT/main/DOCS/templates/business/V_1-0-0/business_V_1-0-0_FORMAT.md`
* **Procedures Template (V_1-0-0):**
  `https://raw.githubusercontent.com/innV0/FORMAT/main/DOCS/templates/procedures/V_1-0-0/procedures_V_1-0-0_FORMAT.md`

## 2. Supported Templates
There are currently two official templates:
1. **Business:** Used for modeling business components, stakeholders, value propositions, market segmentation, etc.
2. **Procedures:** Used for modeling procedural workflows, roles involved, steps, complexity, and sequences.

## 3. Formatting and Grammar Rules

### 3.1 YAML Frontmatter
Every compliant file must start with a YAML block containing:
```yaml
---
specification_version: "V_0-1-2"
specification_url: "https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/DOCS/spec/V_0-1-2/spec.md"
title: "Document Title"
model_version: "V_x-y-z"
documentation_location: "docs/spec/V_0-1-2/"
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

## 4. Operational Instructions for the Agent
* **When Asked to Generate a Model:** Fetch the correct template raw file using the URLs in Section 1, parse the concepts, and prompt the user step-by-step or auto-generate the file content adhering strictly to the naming and layout conventions.
* **When Asked to Validate a Model:** Compare the local file contents against the template schema and the core FORMAT specification rules (H1 headers, block comments, correct lowercase concept names, correct list formatting, matrix headers match element names).
