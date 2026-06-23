---
format_version: "V_0-1-2"
template:
  name: "procedures"
  version: "V_1-0-0"
  title: "FORMAT Procedures Template"
  last_updated: "2026-06-23T07:37:00.000Z"
  concepts:
    - name: "procedure summary"
      icon: "file-text"
      type: "text"
      mode: "basic"
      color: "green"
      weight: 90
      ai_applicability: 9
    - name: "roles involved"
      icon: "users"
      type: "category"
      mode: "basic"
      color: "green"
      weight: 80
      ai_applicability: 8
    - name: "steps"
      icon: "list-ordered"
      type: "steps"
      mode: "basic"
      color: "green"
      weight: 90
      ai_applicability: 9
  markers:
    - name: "complexity"
      icon: "gauge"
      description: "How complex is the procedure to execute"
      mode: "basic"
      color: "green"
      weight: 50
  matrices: []
---

# FORMAT Procedures Template

This is the default template for document-driven procedures.

## Concepts
- **procedure summary**: Brief explanation of the procedure goals.
- **roles involved**: The actors/roles that take part in the procedure.
- **steps**: Ordered steps required to complete the procedure.
