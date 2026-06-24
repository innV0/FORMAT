---
specification_version: "V_0-1-3"
model_version: "V_1-1-0"
specification_url: "https://raw.githubusercontent.com/innV0/FORMAT/main/docs/V_0-1-3/_format.md"
template:
  name: "procedures"
  version: "V_1-1-0"
  title: "FORMAT Template"
  last_updated: "2026-06-24T11:58:33.157Z"
  concepts:
    - name: "procedure summary"
      icon: "file-text"
      type: "text"
      color: "green"
      weight: 90
    - name: "roles"
      icon: "users"
      type: "list"
      color: "green"
      weight: 80
      fields:
        - name: "scope"
          type: "select"
          options:
            - "internal"
            - "external"
    - name: "steps"
      icon: "list-ordered"
      type: "sequence"
      color: "green"
      weight: 90
      fields:
        - name: "step_type"
          type: "select"
          options:
            - "task"
            - "decision"
            - "event"
        - name: "next"
          type: "string"
        - name: "condition"
          type: "string"
        - name: "input"
          type: "reference"
          target_concepts:
            - "artifact"
        - name: "output"
          type: "reference"
          target_concepts:
            - "artifact"
        - name: "output_status"
          type: "string"
        - name: "tool"
          type: "reference"
          target_concepts:
            - "tools"
    - name: "artifact"
      icon: "package"
      type: "list"
      color: "blue"
      weight: 75
    - name: "tools"
      icon: "wrench"
      type: "list"
      color: "orange"
      weight: 70
    - name: "position"
      icon: "briefcase"
      type: "list"
      color: "green"
      weight: 70
    - name: "person"
      icon: "user"
      type: "list"
      color: "green"
      weight: 60
  markers:
    - name: "complexity"
      icon: "gauge"
      color: "green"
      weight: 50
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
last_saved: "2026-06-24T11:58:33.157Z"
---

# <!-- block: concepts --> procedure summary

Brief explanation of the procedure's goals and scope.

# <!-- block: concepts --> roles

* <!-- block: roles --> Role Name
  ```yaml
  scope: internal
  ```
  Description of this role's general responsibilities.

# <!-- block: concepts --> steps

1. <!-- block: steps --> Step Name
   ```yaml
   step_type: task
   next: Next Step Name
   condition: Optional rule activation condition
   input: Related Artifact Name
   output: Produced Artifact Name
   output_status: draft
   tool: Tool Name
   ```
   Detailed explanation of what needs to be done.

# <!-- block: concepts --> artifact

* <!-- block: artifact --> Artifact Name
  Description of this artifact — a tangible or digital output that flows through the procedure (e.g. document, form, report, certificate).

# <!-- block: concepts --> tools

* <!-- block: tools --> Tool Name
  Description of this tool — a software application, instrument, or resource used to modify, generate, or process artifacts during a step (e.g. IDE, spreadsheet, design tool, CI pipeline).

# <!-- block: concepts --> position

* <!-- block: position --> Position Name
  Description of this job position or title.

# <!-- block: concepts --> person

* <!-- block: person --> Person Name
  Details about the individual occupying a position.

# <!-- block: matrices --> item-markers matrix

| Item \ Marker | complexity |
| :--- | :---: |
| Role Name | - |
| Step Name | - |
| Artifact Name | - |
| Tool Name | - |
| Position Name | - |
| Person Name | - |

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

| steps \ artifacts | Artifact Name |
| :--- | :---: |
| Step Name | Creates |

# <!-- block: matrices --> item-markers matrix

| elements \ markers |  |
| :--- |  |