# Delta for Block Display System

## MODIFIED Requirements

### REQ-06 — `BlockSheet` (Work Display — Collapsed / Expanded / Edit States)

`BlockSheet` is the work display, replacing `BlockViewer`. It has three mutually exclusive visual states: **Collapsed**, **Expanded**, and **Edit**. In Edit state, `BlockSheet` MUST render each field through the corresponding widget component from the field-widget-system instead of inline `v-if/v-else-if/v-else` chains. Each widget receives `field`, `value`, and `readonly` props. In Expanded (non-edit) state, `BlockSheet` MUST render a `BlockRelationships` section between the rendered description and the `ConceptRelationshipGraph`.

(Previously: Expanded state shows header pill + fields list + full body/description content with no relationship section)

#### Scenario: Collapsed state unchanged

- GIVEN a `BlockSheet` is in the Collapsed state
- WHEN it renders
- THEN it displays: header pill (icon/emoji + name) + fields list only (no body/description, no relationships)

#### Scenario: Expanded state includes relationships

- GIVEN a `BlockSheet` is in the Expanded state (not Edit)
- AND the current block has incoming or outgoing wikilink relationships
- WHEN it renders the read-mode body
- THEN the `BlockRelationships` component is rendered between the `renderedDescription` div and the `ConceptRelationshipGraph`

#### Scenario: Expanded state, no relationships

- GIVEN a `BlockSheet` is in the Expanded state
- AND the current block has no incoming or outgoing relationships
- WHEN it renders the read-mode body
- THEN no `BlockRelationships` section is rendered (no empty placeholder)

#### Scenario: Edit state unchanged

- GIVEN a `BlockSheet` is in the Edit state
- WHEN it renders
- THEN no `BlockRelationships` section is rendered — editing shows field inputs and description textarea only

#### Scenario: Click to expand transitions correctly

- GIVEN a `BlockSheet` is in the Collapsed state
- WHEN the user clicks to expand it
- THEN it transitions to Expanded state (not Edit) and the relationship section becomes visible if relationships exist
