# Delta for Block Display System

## MODIFIED Requirements

### REQ-06 — `BlockSheet` (Work Display — Collapsed / Expanded / Edit States)

`BlockSheet` is the work display, replacing `BlockViewer`. It has three mutually exclusive visual states: **Collapsed**, **Expanded**, and **Edit**. In Edit state, `BlockSheet` MUST render each field through the corresponding widget component from the field-widget-system instead of inline `v-if/v-else-if/v-else` chains. Each widget receives `field`, `value`, and `readonly` props.

(Previously: BlockSheet rendered field values inline without a widget abstraction)

#### Scenario: BlockSheet renders a reference field in Edit state

- GIVEN a `BlockSheet` is in Edit state with a reference field
- WHEN the Sheet renders the field
- THEN it delegates to the reference widget component — no inline type-checking logic

#### Scenario: BlockSheet renders a string field in Edit state

- GIVEN a `BlockSheet` is in Edit state with a string field
- WHEN the Sheet renders the field
- THEN it delegates to the string widget component with `field`, `value`, and `readonly` props

#### Scenario: BlockSheet preserves non-edit display behavior

- GIVEN a `BlockSheet` is in Collapsed or Expanded state
- WHEN the Sheet renders fields
- THEN the display is identical to pre-widget-system behavior — widgets are only used in Edit state

#### Scenario: BlockSheet widget receives readonly flag

- GIVEN a `BlockSheet` is in Expanded state (not Edit)
- WHEN a widget is rendered for display purposes
- THEN `readonly` is `true` and the widget renders as read-only

---

### REQ-04 — `BlockPill` (Reference / Slim Display)

`BlockPill` is the reference display: icon + name, optionally markers, optionally a hover toolbar. When `BlockPill` renders a value that is a reference field, it MUST display the value as a wiki-link (styled `[[Name]]`).

(Previously: BlockPill only displayed name with icon/emoji — no reference link rendering)

#### Scenario: BlockPill renders a reference value as wiki-link

- GIVEN a `BlockPill` receives a reference field value
- WHEN the Pill renders the value
- THEN it displays the value wrapped in `[[` and `]]` delimiters with wiki-link styling

#### Scenario: BlockPill renders a non-reference value normally

- GIVEN a `BlockPill` receives a non-reference value
- WHEN the Pill renders the value
- THEN it displays the value without wiki-link formatting

#### Scenario: BlockPill wiki-link is clickable

- GIVEN a `BlockPill` renders a reference value as a wiki-link
- WHEN the user clicks the wiki-link
- THEN the application navigates to or selects the referenced block

---

## ADDED Requirements

### REQ-14 — Reference Field Display in Sheets

Reference fields rendered inside `BlockSheet` (Collapsed or Expanded state) MUST display their value as a clickable wiki-link. The wiki-link MUST use the `[[Name]]` delimiter pattern and MUST be visually distinct from plain string values.

#### Scenario: Sheet displays reference field as wiki-link in Collapsed state

- GIVEN a `BlockSheet` is in Collapsed state with a reference field
- WHEN the field is rendered
- THEN the value appears as a clickable `[[Name]]` link

#### Scenario: Sheet displays reference field as wiki-link in Expanded state

- GIVEN a `BlockSheet` is in Expanded state with a reference field
- WHEN the field is rendered
- THEN the value appears as a clickable `[[Name]]` link

#### Scenario: Wiki-link navigates to referenced block

- GIVEN a `BlockSheet` displays a reference field as a wiki-link
- WHEN the user clicks the link
- THEN the application selects or navigates to the referenced block in the feed
