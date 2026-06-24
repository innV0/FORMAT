# Spec: Format Spec Immutability (V_0-1-2)

## 1. Overview

This delta specification defines the requirements for normalization and immutability of the FORMAT V_0-1-2 specification URLs. The custom domain is replaced by a raw GitHub URL pointing to an immutable git tag (`v0.1.2`), ensuring that all specification versions are locked and resolvable.

---

## 2. Requirements

### REQ-01 — Immutable Canonical URL Structure
The specification URL for version V_0-1-2 MUST use the exact raw GitHub path: `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/docs/V_0-1-2/format-spec.md`. The folder segment of the URL MUST preserve the uppercase and underscore format (`V_0-1-2`).

**Scenarios:**
WHEN resolving the canonical specification URL for V_0-1-2  
THEN the URL MUST match `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/docs/V_0-1-2/format-spec.md` exactly.

---

### REQ-02 — Store Default and Parser Fallback URL
The `document` store MUST initialize the default `specificationUrl` state to the canonical raw GitHub URL. The document parser MUST fall back to this exact URL when parsing a document that is missing the frontmatter `specification_url` field.

**Scenarios:**
GIVEN the application loads a document without a specified URL  
WHEN the parser extracts the metadata  
THEN the store's `specificationUrl` MUST fall back to the canonical raw GitHub URL.

---

### REQ-03 — Model Template Normalization
The inline template in the editor's Model Info Panel MUST use the canonical raw GitHub URL for any new files created.

**Scenarios:**
GIVEN a user clicks the button to create a new model file  
WHEN the default markdown template content is generated  
THEN the frontmatter `specification_url` field MUST be set to `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/docs/V_0-1-2/format-spec.md`.

---

### REQ-04 — Draft Spec Example Alignment
The frontmatter example block on line 123 of `docs/V_0-1-2/format-spec.md` MUST align with the canonical URL.

**Scenarios:**
GIVEN an external tool or human reads the draft specification `docs/V_0-1-2/format-spec.md`  
WHEN checking the frontmatter code example  
THEN the `specification_url` property MUST point to `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/docs/V_0-1-2/format-spec.md`.

---

### REQ-05 — Legacy Specs Preservation (No Migrations)
Older versions of the specification (V_0-1-0 and V_0-1-1) MUST NOT be modified, and no parser migrations SHALL be added to convert old spec URLs to new formats.

**Scenarios:**
WHEN this change is implemented and verified  
THEN files in `docs/V_0-1-0/` and `docs/V_0-1-1/` SHALL remain byte-for-byte identical to their pre-change state.

---

### REQ-06 — Reference Field Type
The FORMAT field type enum MUST include `reference` as a first-class field type alongside `string`, `boolean`, `number`, and `select`. Reference field values MUST be stored as plain strings in YAML. A `reference` field definition MUST accept an optional `target_concepts` property at the template level that constrains which concept types a reference may target.

**Scenarios:**
GIVEN a Procedures template defines a step's `input` field as type `reference`
WHEN the template author specifies `target_concepts: ["Artifact"]`
THEN the field accepts string values that reference blocks of type `Artifact`

GIVEN a template defines a field as type `reference` without `target_concepts`
WHEN a user sets a value on that field
THEN the value MAY reference any block regardless of concept type

GIVEN a concept instance has a reference field with a value
WHEN the document is serialized to YAML
THEN the reference value is stored as a plain string — no special YAML type or wrapper object

GIVEN the FORMAT spec enumerates field types
WHEN a tool validates a document's field definitions
THEN `reference` is recognized as a valid field type and passes validation

---

### REQ-07 — Artifact Concept in Procedures
The Procedures template (V_1-1-0) MUST define an `artifact` concept type. Steps in Procedures MUST gain three new fields: `input` (type `reference`), `output` (type `reference`), and `output_status` (type `string`). The `artifact` concept is a first-class block that steps can reference via `input` and `output`.

**Scenarios:**
GIVEN a Procedure document defines a step and an `artifact` block
WHEN the step's `input` field is set to the artifact's name
THEN the step's `input` value is a plain string matching the artifact block name

GIVEN a step has `output` set to an artifact name and `output_status` set to a string
WHEN the document is displayed
THEN both the output reference and status string are visible in the step's field list

GIVEN the Procedures template declares an `artifact` concept
WHEN a user creates a new document from that template
THEN the template includes an `artifact` concept type available for block creation

---

### REQ-08 — Version Bump to V_0-1-4
The FORMAT specification version MUST be updated from V_0-1-3 to V_0-1-4. The canonical specification URL MUST use the `v0.1.4` tag and `V_0-1-4` folder segment.

**Scenarios:**
GIVEN the specification is at version V_0-1-4
WHEN resolving the canonical specification URL
THEN the URL MUST match `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.4/docs/V_0-1-4/format-spec.md`

---

## 3. Out-of-Scope Constraints

- Parsing logic for legacy documents will continue using their respective version strings without runtime migration or automatic transformation.
- No network requests are made to validate the URLs at runtime.
