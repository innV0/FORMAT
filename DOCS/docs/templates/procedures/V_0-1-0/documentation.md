---
specification_version: "V_0-1-0"
specification_url: "https://raw.githubusercontent.com/innV0/FORMAT/main/docs/spec/V_0-1-0/_format.md"
template:
  name: "procedures"
  version: "V_0-1-0"
  title: "FORMAT Procedures Template"
  last_updated: "2026-06-24T00:00:00.000Z"
  concepts:
    - name: "procedure"
      icon: "file-text"
      type: "text"
      mode: "basic"
      color: "purple"
      weight: 100
      ai_applicability: 9

    - name: "work"
      icon: "list-ordered"
      type: "sequence"
      mode: "basic"
      color: "purple"
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
      mode: "basic"
      color: "blue"
      weight: 80
      ai_applicability: 7

    - name: "tools"
      icon: "wrench"
      type: "list"
      mode: "basic"
      color: "orange"
      weight: 70
      ai_applicability: 8

    - name: "roles"
      icon: "users"
      type: "list"
      mode: "basic"
      color: "green"
      weight: 60
      ai_applicability: 8
      fields:
        - name: "scope"
          type: "select"
          options:
            - "internal"
            - "external"

    - name: "position"
      icon: "briefcase"
      type: "list"
      mode: "basic"
      color: "green"
      weight: 50
      ai_applicability: 7

    - name: "person"
      icon: "user"
      type: "list"
      mode: "basic"
      color: "green"
      weight: 40
      ai_applicability: 6

  markers:
    - name: "complexity"
      icon: "gauge"
      description: "How complex is the procedure to execute"
      mode: "basic"
      color: "green"
      weight: 50

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
---

# FORMAT Procedures Template

This is the expanded template for document-driven procedures, modeling workflows, roles, positions, and operational personnel mapping.

## Concepts
- **procedure**: Brief explanation of the procedure goals.
- **work**: Sequence of actions, decisions, and events in the workflow. Work items can reference artifacts as inputs and outputs, and tools as resources.
- **artifact**: Tangible or digital outputs that flow through the procedure (e.g. documents, forms, reports, certificates). Work items interact with artifacts via the work-artifacts matrix (Creates, Modifies, Validates, Reviews).
- **tools**: Software applications, instruments, or resources used to modify, generate, or process artifacts during a work item (e.g. IDE, spreadsheet, design tool, CI pipeline). Connected to work via the work-tools matrix.
- **roles**: The functional responsibilities/actors in the workflow (e.g. Developer, QA).
- **position**: Job roles or titles within the organization (e.g. Senior Developer).
- **person**: The actual team members occupying those positions.
