# Spec: FORMAT Agent Skill

## 1. Overview

This specification defines the structural, metadata, and instruction requirements for the new `FORMAT-skill` agent skill. This skill guides AI agents in understanding the FORMAT document grammar, layout rules, and metadata, providing a single index of canonical and immutable specification URLs.

---

## 2. Requirements

### REQ-01 — Skill Manifest and Metadata
The skill file MUST be created at `.agents/skills/FORMAT-skill/SKILL.md`. It MUST begin with standard frontmatter containing:
- `name`: `FORMAT-skill`
- `description`: "Guides AI agents on FORMAT specifications, grammar rules, schema metadata, and constraint verification."

**Scenarios:**
GIVEN an agent loader parses the skill directory  
WHEN reading `.agents/skills/FORMAT-skill/SKILL.md`  
THEN it MUST locate the frontmatter containing the name and description.

---

### REQ-02 — Canonical Specification Index
The skill file MUST contain an index table referencing the canonical, raw GitHub URLs for all historical and draft specifications:
- V_0-1-0: `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.0/DOCS/V_0-1-0/format-spec.md`
- V_0-1-1: `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.1/DOCS/V_0-1-1/format-spec.md`
- V_0-1-2: `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/DOCS/V_0-1-2/format-spec.md`

**Scenarios:**
WHEN an agent reads the specification index in the skill file  
THEN all referenced URLs MUST point to raw GitHub URLs targeting specific release tags.

---

### REQ-03 — Modeling Reference Integration
The skill MUST explicitly direct agents to the syntax and grammar rules stored in `references/modeling-spec.md`.

**Scenarios:**
GIVEN an agent is tasked with writing or editing a FORMAT model document  
WHEN it searches the skill for syntax constraints  
THEN the skill MUST instruct the agent to read and follow the constraints in `references/modeling-spec.md`.

---

### REQ-04 — English Default and Immutability Instructions
The skill MUST instruct agents to:
- Default all generated technical outputs, frontmatter keys, and file contents to English.
- Strictly respect specification immutability by refusing to modify historical folders (V_0-1-0, V_0-1-1).

**Scenarios:**
WHEN an agent executes a model generation task using this skill  
THEN it SHALL produce English-language key names and refuse to modify old spec files.

---

## 3. Out-of-Scope Constraints

- The skill file does not contain copy-paste duplications of the full specification documents.
- The skill does not define custom command scripts.
