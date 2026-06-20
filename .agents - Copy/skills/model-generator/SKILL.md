---
name: model-generator
description: Synthesize a complete, syntactically correct markdown business model matching the new flat self-containing template format from raw unstructured or narrative descriptions.
---

# Model Generator Skill

Use this skill when the user requests to generate, build, or parse a complete business model from raw, unstructured, or narrative descriptions.

## Guidelines

1. **Read Metamodel**:
   - Locate and inspect the metamodel definitions inside `Samples/metamodel_template.md` under the `metamodel` frontmatter key.
   - Copy the `metamodel` object (containing `concepts`, `markers`, and `matrices` definitions) exactly to the frontmatter of the new document.

2. **Generate Document Frontmatter**:
   - Every generated model must begin with this YAML frontmatter structure:
     ```yaml
     ---
     specification_version: "1.0.0"
     documentation_location: "DOCS/v1.0.0/"
     metamodel:
       title: "innV0 Metamodel"
       last_updated: "[Current Timestamp]"
       concepts:
         # ... copy list from Samples/metamodel_template.md ...
       markers:
         # ... copy list from Samples/metamodel_template.md ...
       matrices:
         # ... copy list from Samples/metamodel_template.md ...
     title: "[Name of the Business] Model"
     last_saved: "[Current UTC Timestamp]"
     ---
     ```

3. **Map and Populate Sections**:
   - For every concept present in the metamodel, generate a corresponding markdown header: `# <!-- block: concepts --> [concept name]` (where `[concept name]` is in lowercase, matching the name in the metamodel).
   - If the concept is a hierarchy/instantiable concept (e.g. `stakeholders`, `segments`, `profiles`, `persona`):
     - Generate each extracted item as a list item separator:
       `* <!-- block: [concept name] --> [Item Name]` (e.g. `* <!-- block: stakeholders --> Susana Ocampo`).
       - Ensure `[Item Name]` has no formatting tags like `**`, `*`, `__`, `[[`, or `]]`.
     - Output its description immediately on the next line (without any indentation).
     - Separate item blocks with a blank line.
   - If the concept is a standard text concept (e.g. `business summary`):
     - Output the content as standard text paragraphs.
   - **Crucial Rule for Missing Information**: If the narrative lacks information for a concept, do NOT omit the concept section. Output the concept header and include the following fallback placeholder:
     - For instantiable concepts:
       `* <!-- block: [concept name] --> Sin especificar`
       `No se cuenta con datos en la narrativa.`
     - For text concepts:
       `[Falta información: Este concepto no cuenta con datos suficientes en la narrativa facilitada para ser completado.]`

4. **Construct Matrices**:
   - At the end of the document, generate the matrices section header: `<!-- block: matrices -->`.
   - For each matrix in the metamodel, create a section header: `# <!-- block: matrices --> [matrix name]` (lowercase).
   - Generate the corresponding markdown table:
     - For hierarchy matrices (e.g., `stakeholders-segments hierarchy matrix`), rows are source items, columns are target items, and cells contain `X` if associated or `-` if not.
     - For the `item-markers matrix`, rows are all node items, columns are markers (weight, certainty, priority, rating), and cells contain numeric values or `-`.
     - For the `metamatrix`, list all matrices with columns: Matrix Name, Source, Target, Widget Type, Widget Parameters.
     - For other relationship matrices, populate cells with widget values based on logical inference.

5. **Aesthetics & Integrity**:
   - Ensure the markdown is clean, containing no trailing whitespaces, and fully parseable by the application's markdown parser.
