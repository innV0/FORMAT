---
specification_version: "V_0-1-3"
model_version: "V_1-0-0"
specification_url: "https://raw.githubusercontent.com/innV0/FORMAT/main/docs/V_0-1-3/_format.md"
template:
  name: "procedures"
  version: "V_1-0-0"
  title: "FORMAT Template"
  last_updated: "2026-06-23T21:10:29.555Z"
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
    - name: "item-markers matrix"
      source: "elements"
      target: "markers"
title: "procedures"
last_saved: "2026-06-23T21:10:29.555Z"
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
   ```
   Detailed explanation of what needs to be done.

# <!-- block: concepts --> position

* <!-- block: position --> Position Name
  Description of this job position or title.

# <!-- block: concepts --> person

* <!-- block: person --> Person Name
  Details about the individual occupying a position.

# <!-- block: matrices --> item-markers matrix

| Item \ Marker | complexity |
| :--- | :---: |

# <!-- block: matrices --> metamatrix

| Matrix Name | Source | Target | Widget Type | Widget Parameters |
| :--- | :--- | :--- | :--- | :--- |
| steps-roles matrix | steps | roles | cycle | Responsible;Accountable;Consulted;Informed |
| positions-roles matrix | position | roles | cycle | Assumes |
| persons-positions matrix | person | position | cycle | Occupies |
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

# <!-- block: matrices --> item-markers matrix

| elements \ markers |  |
| :--- |  |