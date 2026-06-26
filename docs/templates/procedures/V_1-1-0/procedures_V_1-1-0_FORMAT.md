<!-- @spec-version V_0-1-4 -->
---
template:
  name: "procedures"
  version: "V_1-1-0"
  title: "FORMAT Procedures Template"
  last_updated: "2026-06-25T19:37:01.835Z"
  concepts: []
  markers: []
  matrices:
    - name: "steps-roles matrix"
      source: "steps"
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
    - name: "steps-tools matrix"
      source: "steps"
      target: "tools"
      params: "Uses"
    - name: "steps-artifacts matrix"
      source: "steps"
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
| steps-roles matrix | steps | roles | cycle | Responsible;Accountable;Consulted;Informed |
| positions-roles matrix | position | roles | cycle | Assumes |
| persons-positions matrix | person | position | cycle | Occupies |
| steps-tools matrix | steps | tools | cycle | Uses |
| steps-artifacts matrix | steps | artifact | cycle | Creates;Modifies;Validates;Reviews |
| item-markers matrix | elements | markers | cycle | - |

# <!-- block: matrices --> steps-roles matrix

| steps \ roles | Role Name |
| :--- | :---: |
| Step Name | Responsible |

# <!-- block: matrices --> positions-roles matrix

| position \ roles | Role Name |
| :--- | :---: |
| Position Name | Assumes |

# <!-- block: matrices --> persons-positions matrix

| person \ position | Position Name |
| :--- | :---: |
| Person Name | Occupies |

# <!-- block: matrices --> steps-tools matrix

| steps \ tools | Tool Name |
| :--- | :---: |
| Step Name | Uses |

# <!-- block: matrices --> steps-artifacts matrix

| steps \ artifact | Artifact Name |
| :--- | :---: |
| Step Name | Creates |

# <!-- block: matrices --> item-markers matrix

| elements \ markers |  |
| :--- |  |