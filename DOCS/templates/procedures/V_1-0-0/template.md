---
specification_version: "V_0-1-3"
specification_url: "https://raw.githubusercontent.com/innV0/FORMAT/main/DOCS/V_0-1-3/_format.md"
template:
  name: "procedures"
  version: "V_1-0-0"
  title: "FORMAT Procedures Template"
  last_updated: "2026-06-23T18:20:00.000Z"
  concepts:
    - name: "procedure summary"
      icon: "file-text"
      type: "text"
      mode: "basic"
      color: "green"
      weight: 90
      ai_applicability: 9

    - name: "roles"
      icon: "users"
      type: "list"
      mode: "basic"
      color: "green"
      weight: 80
      ai_applicability: 8
      fields:
        - name: "scope"
          type: "select"
          options:
            - "internal"
            - "external"

    - name: "steps"
      icon: "list-ordered"
      type: "sequence"
      mode: "basic"
      color: "green"
      weight: 90
      ai_applicability: 9
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
      mode: "basic"
      color: "green"
      weight: 70
      ai_applicability: 7

    - name: "person"
      icon: "user"
      type: "list"
      mode: "basic"
      color: "green"
      weight: 60
      ai_applicability: 6

  markers:
    - name: "complexity"
      icon: "gauge"
      description: "How complex is the procedure to execute"
      mode: "basic"
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
---

# FORMAT Procedures Template

This is the expanded template for document-driven procedures, modeling workflows, roles, positions, and operational personnel mapping.

## Concepts
- **procedure summary**: Brief explanation of the procedure goals.
- **roles**: The functional responsibilities/actors in the workflow (e.g. Developer, QA).
- **steps**: Sequence of actions, decisions, and events in the workflow.
- **position**: Job roles or titles within the organization (e.g. Senior Developer).
- **person**: The actual team members occupying those positions.
