---
specification_version: "V_0-1-2"
specification_url: "https://raw.githubusercontent.com/innV0/FORMAT/main/DOCS/V_0-1-2/_format.md"
title: "procedures Template — V_1-0-0"
model_version: "V_1-0-0"
last_saved: "2026-06-23T00:00:00.000Z"
template:
  name: "procedures"
  version: "V_1-0-0"
  title: "innV0 Procedures Model Template"
  concepts:
    - name: "procedure summary"
      icon: "file-text"
      type: "text"
      color: "green"
      weight: 90

    - name: "roles involved"
      icon: "users"
      type: "category"
      color: "green"
      weight: 80

    - name: "steps"
      icon: "list-ordered"
      type: "steps"
      color: "green"
      weight: 90

  markers:
    - name: "complexity"
      icon: "gauge"
      description: "How complex is the procedure to execute"
      color: "green"
      weight: 50

  matrices:
    - name: "item-markers matrix"
      source: "elements"
      target: "markers"
---

# <!-- block: concepts --> procedure summary

Brief explanation of the procedure's goals and scope.

# <!-- block: concepts --> roles involved

* <!-- block: roles involved --> Role name
  Description of this role and their responsibilities in the procedure.

# <!-- block: concepts --> steps

1. <!-- block: steps --> Step name
   - description: Explanation of what needs to be done.
   - duration: Estimate of time required.

# <!-- block: matrices --> item-markers matrix

| Item \ Marker | complexity |
| :--- | :---: |
| Element name | - |
