# Field Widget System Specification

## Purpose

The field-widget-system defines a component-per-type abstraction for rendering field values in `BlockSheet` Edit state. Each field type (`string`, `boolean`, `number`, `select`, `reference`) maps to exactly one widget component. This replaces inline type-checking chains and makes adding future field types trivial.

## Requirements

### Requirement: One Widget Per Field Type

The system MUST provide exactly one widget component for each field type: `string`, `boolean`, `number`, `select`, and `reference`. A mapping MUST associate each type string to its corresponding widget component. No widget MAY handle more than one field type.

#### Scenario: Resolve widget for a known field type

- GIVEN the widget mapping contains an entry for `string`
- WHEN the system resolves the widget for a field with `type: "string"`
- THEN it returns the string widget component

#### Scenario: Resolve widget for reference type

- GIVEN the widget mapping contains an entry for `reference`
- WHEN the system resolves the widget for a field with `type: "reference"`
- THEN it returns the reference widget component

#### Scenario: Unknown field type falls back

- GIVEN the widget mapping has no entry for a given type string
- WHEN the system resolves the widget for that field
- THEN it returns a fallback widget (string-like) that renders the value as plain text

---

### Requirement: Widget Props Contract

Every widget component MUST accept exactly three props: `field` (the field definition object), `value` (the current field value), and `readonly` (boolean). No widget MAY accept additional props beyond this contract.

#### Scenario: Widget receives field definition

- GIVEN a widget is instantiated for a field
- WHEN the component mounts
- THEN `field` contains the full field definition (name, type, options, target_concepts, etc.)

#### Scenario: Widget receives current value

- GIVEN a widget is instantiated for a field with an existing value
- WHEN the component mounts
- THEN `value` is the current value of that field (may be `null` or `undefined` if unset)

#### Scenario: Widget respects readonly flag

- GIVEN a widget receives `readonly: true`
- WHEN the widget renders
- THEN no editable input is presented — the value is displayed as read-only text

---

### Requirement: Reference Widget Behavior

The reference widget MUST render a text input that suggests matching block names from the document. When `target_concepts` is defined on the field, suggestions MUST be filtered to blocks of those concept types. The widget MUST store the selected value as a plain string (the block name).

#### Scenario: Reference widget shows suggestions

- GIVEN a reference field with `target_concepts: ["Artifact"]`
- WHEN the user begins typing in the input
- THEN the widget suggests block names whose concept type is `Artifact`

#### Scenario: Reference widget without target filter

- GIVEN a reference field without `target_concepts`
- WHEN the user types in the input
- THEN the widget suggests all block names in the document regardless of concept type

#### Scenario: Reference widget stores plain string

- GIVEN the user selects a block name from suggestions
- WHEN the value is committed
- THEN the stored value is a plain string matching the block name — no reference ID or wrapper

#### Scenario: Reference widget clears value

- GIVEN a reference field has an existing value
- WHEN the user clears the input
- THEN the value becomes an empty string or `null`

---

### Requirement: Widget Registration Extensibility

The widget mapping MUST be defined in a single registry file. Adding a new field type SHALL require only: (1) creating the widget component, and (2) adding one entry to the registry. No other files SHOULD need modification.

#### Scenario: Add a new field type widget

- GIVEN a developer creates a `date` widget component
- WHEN they add `{ date: DateWidget }` to the registry
- THEN `BlockSheet` automatically renders `date` fields using the new widget

#### Scenario: Existing widgets unaffected by new registration

- GIVEN a new widget is added to the registry
- WHEN `BlockSheet` renders a `string` field
- THEN the string widget is used — unchanged by the new entry
