# FORMAT Specification

This document defines the syntax and grammar rules for the flat, self-containing business model Markdown files used by FORMAT.

## 1. Document Structure

Every model file consists of two main parts:
1. **YAML Frontmatter**: Houses the document title, last saved timestamp, and the complete metamodel schema (concepts, markers, matrices).
2. **Markdown Body**: Contains the concept text, instantiable hierarchy lists, and relational matrices.

---

## 2. YAML Frontmatter

The frontmatter begins and ends with `---`. String values must be enclosed in double quotes.

```yaml
---
metamodel:
  title: "innV0 Metamodel"
  last_updated: "2026-06-19T17:48:57.477Z"
  concepts:
    - name: "business summary"
      category_id: null
      emoji: "📄"
      type: "text"
      color: "blue"
      weight: 90
    - name: "stakeholders"
      category_id: "market"
      emoji: "🤔"
      type: "weight"
      color: "blue"
      weight: 80
  markers:
    - name: "weight"
      symbol: "*"
      emoji: "➕"
      color: "blue"
  matrices:
    - name: "stakeholders-segments hierarchy matrix"
      source: "stakeholders"
      target: "segments"
title: "Ghostbusters Complete Model"
last_saved: "2026-06-19T17:48:57.479Z"
---
```

---

## 3. Markdown Body Grammar

### 3.1 Block Comment Separators
Separators use lowercase comments:
- Concept divider: `<!-- block: concepts -->`
- Matrix divider: `<!-- block: matrices -->`

### 3.2 Concept Headers
Each concept is introduced by H1 with its block comment prefix:
```markdown
# <!-- block: concepts --> business summary
```
The concept name must be in lowercase.

### 3.3 Node Instance Separators
For instantiable concepts (e.g. `stakeholders`), each item uses this separator:
```markdown
* <!-- block: stakeholders --> B2C Clients
```
- List item markers `*` or `-` at the start are optional.
- Formatting tags like `**`, `*`, `__`, `[[`, and `]]` inside the node name are stripped by the parser.
- The description of the node starts on the immediately following line with no indentation, and continues until the next `<!-- block: ... -->` or heading section.

```markdown
* <!-- block: stakeholders --> B2C Clients
Residential property owners experiencing scary, unexplained spiritual activity.
```

---

## 4. Matrices Section

All relationship matrices are listed under the matrices block comment:
```markdown
<!-- block: matrices -->
```

### 4.1 Hierarchy Matrices
Used to resolve parent-child tree relationships:
```markdown
# <!-- block: matrices --> stakeholders-segments hierarchy matrix

| stakeholders \ segments | Distressed Homeowners | Hotel Managers |
| :--- | :---: | :---: |
| **B2C Clients** | X | - |
| **B2B Commercial** | - | X |
```

### 4.2 Item-Markers Matrix
Stores numerical markers assigned to each node:
```markdown
# <!-- block: matrices --> item-markers matrix

| Item \ Marker | weight | certainty |
| :--- | :---: | :---: |
| **B2C Clients** | 4 | 5 |
| **B2B Commercial** | 5 | 4 |
```

### 4.3 Metamatrix
Registers custom relationship matrices:
```markdown
# <!-- block: matrices --> metamatrix

| Matrix Name | Source | Target | Widget Type | Widget Parameters |
| :--- | :--- | :--- | :--- | :--- |
| Problems-Value propositions Matrix | Problems | Value propositions | scale | min:1;max:5 |
```
