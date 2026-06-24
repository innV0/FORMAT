# Delta for Format Spec

## ADDED Requirements

### Requirement: Reference Field Type

The FORMAT field type enum MUST include `reference` as a first-class field type alongside `string`, `boolean`, `number`, and `select`. Reference field values MUST be stored as plain strings in YAML. A `reference` field definition MUST accept an optional `target_concepts` property at the template level that constrains which concept types a reference may target.

#### Scenario: Define a reference field in a template

- GIVEN a Procedures template defines a step's `input` field as type `reference`
- WHEN the template author specifies `target_concepts: ["Artifact"]`
- THEN the field accepts string values that reference blocks of type `Artifact`

#### Scenario: Reference field without target constraint

- GIVEN a template defines a field as type `reference` without `target_concepts`
- WHEN a user sets a value on that field
- THEN the value MAY reference any block regardless of concept type

#### Scenario: Reference value stored as plain string

- GIVEN a concept instance has a reference field with a value
- WHEN the document is serialized to YAML
- THEN the reference value is stored as a plain string — no special YAML type or wrapper object

#### Scenario: Reference field in schema metadata

- GIVEN the FORMAT spec enumerates field types
- WHEN a tool validates a document's field definitions
- THEN `reference` is recognized as a valid field type and passes validation

---

### Requirement: Artifact Concept in Procedures

The Procedures template (V_1-1-0) MUST define an `artifact` concept type. Steps in Procedures MUST gain three new fields: `input` (type `reference`), `output` (type `reference`), and `output_status` (type `string`). The `artifact` concept is a first-class block that steps can reference via `input` and `output`.

#### Scenario: Step references an artifact as input

- GIVEN a Procedure document defines a step and an `artifact` block
- WHEN the step's `input` field is set to the artifact's name
- THEN the step's `input` value is a plain string matching the artifact block name

#### Scenario: Step declares an output artifact with status

- GIVEN a step has `output` set to an artifact name and `output_status` set to a string
- WHEN the document is displayed
- THEN both the output reference and status string are visible in the step's field list

#### Scenario: Artifact concept is defined at template level

- GIVEN the Procedures template declares an `artifact` concept
- WHEN a user creates a new document from that template
- THEN the template includes an `artifact` concept type available for block creation

---

### Requirement: Version Bump to V_0-1-4

The FORMAT specification version MUST be updated from V_0-1-3 to V_0-1-4. The canonical specification URL MUST use the `v0.1.4` tag and `V_0-1-4` folder segment.

#### Scenario: Canonical URL for V_0-1-4

- GIVEN the specification is at version V_0-1-4
- WHEN resolving the canonical specification URL
- THEN the URL MUST match `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.4/docs/V_0-1-4/format-spec.md`

---

## RENAMED Requirements

### Requirement: Version Bump to V_0-1-3 → Version Bump to V_0-1-4

(Reason: New field type requires a spec version increment)
(Migration: Update all references from V_0-1-3 to V_0-1-4 in templates, URLs, and frontmatter)
