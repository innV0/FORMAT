---
specification_version: "V_0-1-4"
specification_url: "https://raw.githubusercontent.com/innV0/FORMAT/main/docs/V_0-1-4/_format.md"
template:
  name: "procedures"
  version: "V_0-1-0"
  title: "FORMAT Procedures Template"
  last_updated: "2026-06-25T19:37:01.835Z"
  concepts: []
  markers: []
  matrices:
    - name: "work-roles matrix"
      source: "work"
      target: "roles"
      params: "Responsible;Accountable;Consulted;Informed"
    - name: "positions-roles matrix"
      source: "position"
      target: "roles"
      params: "Assumes"
    - name: "persons-positions matrix"
      source: "person"
      target: "position"
      params: "Occupies"
    - name: "work-tools matrix"
      source: "work"
      target: "tools"
      params: "Uses"
    - name: "work-artifacts matrix"
      source: "work"
      target: "artifact"
      params: "Creates;Modifies;Validates;Reviews"
    - name: "item-markers matrix"
      source: "elements"
      target: "markers"
title: "procedures"
last_saved: "2026-06-25T19:37:01.835Z"
---
> [!NOTE]
> This is a **FORMAT document** — a plain-text Markdown file that carries its own schema in the YAML frontmatter. You can edit it as raw text in any editor, or open it in the [FORMAT app](https://format.innv0.com) for a guided visual editor.

# <!-- block: matrices --> item-markers matrix

| Item \ Marker |  |
| :--- |  |

# <!-- block: matrices --> metamatrix

| Matrix Name | Source | Target | Widget Type | Widget Parameters |
| :--- | :--- | :--- | :--- | :--- |
| work-roles matrix | work | roles | cycle | Responsible;Accountable;Consulted;Informed |
| positions-roles matrix | position | roles | cycle | Assumes |
| persons-positions matrix | person | position | cycle | Occupies |
| work-tools matrix | work | tools | cycle | Uses |
| work-artifacts matrix | work | artifact | cycle | Creates;Modifies;Validates;Reviews |
| item-markers matrix | elements | markers | cycle | - |

# <!-- block: matrices --> work-roles matrix

| work \ roles | Role Name |
| :--- | :---: |
| Work Name | Responsible |

# <!-- block: matrices --> positions-roles matrix

| position \ roles | Role Name |
| :--- | :---: |
| Position Name | Assumes |

# <!-- block: matrices --> persons-positions matrix

| person \ position | Position Name |
| :--- | :---: |
| Person Name | Occupies |

# <!-- block: matrices --> work-tools matrix

| work \ tools | Tool Name |
| :--- | :---: |
| Work Name | Uses |

# <!-- block: matrices --> work-artifacts matrix

| work \ artifact | Artifact Name |
| :--- | :---: |
| Work Name | Creates |

# <!-- block: matrices --> item-markers matrix

| elements \ markers |  |
| :--- |  |