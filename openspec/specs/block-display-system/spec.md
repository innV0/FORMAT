# Spec: Block Display System

## 1. Overview

This specification defines the behavioral and structural requirements for the block display system — a two-axis (display × kind) component family that becomes the single sanctioned way to render any block in the UI.

**GOLDEN RULE**: Every block in the UI is rendered through exactly one of three display components — `BlockPill`, `BlockCard`, or `BlockSheet`. No hand-rolled block markup exists outside this family.

**Axes**:
- **display** (`pill` | `card` | `sheet`): level of engagement / surface context
- **kind** (`concept` | `instance`): what the block IS — orthogonal to display

Any `display × kind` combination is valid.

---

## 2. Requirements

### REQ-01 — Golden Rule (No Hand-Rolled Block Markup)

Every block rendered in the UI must go through exactly one of `BlockPill`, `BlockCard`, or `BlockSheet`. No call site may render a block's identity, icon, name, color, or markers using ad-hoc HTML/markup outside these three components.

**Scenarios:**

WHEN a developer adds a new surface that displays a block  
THEN the only valid render paths are `<BlockPill>`, `<BlockCard>`, or `<BlockSheet>` — no inline markup alternatives exist

WHEN the codebase is audited for block rendering  
THEN no `.vue` file outside `BlockPill.vue`, `BlockCard.vue`, `BlockSheet.vue`, and `BlockFeed.vue` contains block identity markup (emoji + name + icon + color combination) rendered directly

---

### REQ-02 — Two-Axis Orthogonality (display × kind)

The `display` and `kind` props are independent. Any combination must produce correct, non-broken visuals.

**Scenarios:**

WHEN `kind="concept"` is passed to any display component  
THEN the block renders with a dashed outline and a type icon (no emoji)

WHEN `kind="instance"` is passed to any display component  
THEN the block renders with a solid tinted fill and an emoji (no type icon)

WHEN `kind="concept"` is used with `display="pill"`  
THEN the Pill shows type icon + name + dashed border styling

WHEN `kind="instance"` is used with `display="pill"`  
THEN the Pill shows emoji + name + solid tinted background

WHEN `kind="concept"` is used with `display="card"`  
THEN the Card shows dashed outline, type icon, name, markers, and hover quick-actions

WHEN `kind="instance"` is used with `display="card"`  
THEN the Card shows solid tinted fill, emoji, name, markers, and hover quick-actions

WHEN `kind="concept"` is used with `display="sheet"`  
THEN the Sheet renders with dashed outline styling in its header pill

WHEN `kind="instance"` is used with `display="sheet"`  
THEN the Sheet renders with solid tinted fill styling in its header pill

---

### REQ-03 — `useBlockVisuals` Composable (Single Resolution Path)

A single `useBlockVisuals` composable centralizes all visual resolution: emoji vs. type icon, outline vs. solid fill, color/palette classes, and marker icon classes. No display component may hard-code these values directly.

**Scenarios:**

WHEN any of `BlockPill`, `BlockCard`, or `BlockSheet` resolves visual properties  
THEN it calls `useBlockVisuals` to obtain emoji/icon, outline/solid class, and color tokens — it does not compute these itself

WHEN the composable receives `kind="concept"` and a concept type  
THEN it returns the type icon from `getConceptTypeIcon` and outline/dashed border classes

WHEN the composable receives `kind="instance"` and an instance emoji  
THEN it returns the emoji and solid tinted background classes from the color palette

WHEN marker display is needed  
THEN `useBlockVisuals` delegates to `getMarkerIcon` and `getMarkerClasses` from `MarkerIcons.ts`

---

### REQ-04 — `BlockPill` (Reference / Slim Display)

`BlockPill` is the reference display: icon + name, optionally markers, optionally a hover toolbar. It is used in the concepts sidebar and as matrix row/column/axis headers. When `BlockPill` renders a value that is a reference field, it MUST display the value as a wiki-link (styled `[[Name]]`).

**Scenarios:**

WHEN `BlockPill` renders a concept  
THEN it displays type icon + name, with dashed border, fitting within a single inline pill

WHEN `BlockPill` renders an instance  
THEN it displays emoji + name, with solid tinted background, fitting within a single inline pill

WHEN `BlockPill` is rendered in the concepts sidebar  
THEN `kind="concept"` is passed by the sidebar call site

WHEN `BlockPill` receives a `size` prop  
THEN no such prop exists — the legacy `sm`/`md`/`lg`/`xs` size axis is absent from `BlockPill`

WHEN `BlockPill` receives a reference field value  
THEN it displays the value wrapped in `[[` and `]]` delimiters with wiki-link styling

WHEN `BlockPill` renders a non-reference value  
THEN it displays the value without wiki-link formatting

WHEN the user clicks a wiki-link rendered by `BlockPill`  
THEN the application navigates to or selects the referenced block

---

### REQ-05 — `BlockCard` (Browse / Structure Display)

`BlockCard` is the browse display: identity + status markers + hover quick-actions (reorder, add-child). It is used in the hierarchy tree (`TreeNodeItem`).

**Scenarios:**

WHEN `TreeNodeItem` renders a node  
THEN it uses `<BlockCard>` instead of `<BlockPill>`

WHEN the user hovers over a `BlockCard`  
THEN quick-action buttons appear: reorder (up/down) and add-child

WHEN an add-child button is activated on a `BlockCard`  
THEN the appropriate add-child action is triggered for that node

WHEN a reorder button is activated on a `BlockCard`  
THEN the node's position changes using the existing `moveItemUp`/`moveItemDown` logic

WHEN `BlockCard` renders accessible icon-only buttons in the hover toolbar  
THEN each button has an `aria-label` describing its action (e.g., "Move up", "Add child", "Delete")

---

### REQ-06 — `BlockSheet` (Work Display — Collapsed / Expanded / Edit States)

`BlockSheet` is the work display, replacing `BlockViewer`. It has three mutually exclusive visual states: **Collapsed**, **Expanded**, and **Edit**. In Edit state, `BlockSheet` MUST render each field through the corresponding widget component from the field-widget-system instead of inline `v-if/v-else-if/v-else` chains. Each widget receives `field`, `value`, and `readonly` props. In Expanded (non-edit) state, `BlockSheet` MUST render a `BlockRelationships` section between the rendered description and the `ConceptRelationshipGraph`.

**Scenarios:**

WHEN a `BlockSheet` is in the Collapsed state  
THEN it displays: header pill (icon/emoji + name) + fields list only (no body/description, no relationships)

WHEN a `BlockSheet` is in the Expanded state (not Edit)  
AND the current block has incoming or outgoing wikilink relationships  
THEN the `BlockRelationships` component is rendered between the `renderedDescription` div and the `ConceptRelationshipGraph`

WHEN a `BlockSheet` is in the Expanded state  
AND the current block has no incoming or outgoing relationships  
THEN no `BlockRelationships` section is rendered (no empty placeholder)

WHEN a user clicks to expand a Collapsed `BlockSheet`  
THEN the Sheet transitions to Expanded state — it does NOT enter Edit state, and the relationship section becomes visible if relationships exist

WHEN a user clicks the pencil (edit) button on a `BlockSheet`  
THEN the Sheet enters Edit state, enabling inline editing of name, fields, and body

WHEN `BlockSheet` enters Edit state  
THEN any other Sheet currently in Edit state across the feed reverts to its previous non-edit state (Collapsed or Expanded)

WHEN expanding a `BlockSheet` (Collapsed → Expanded)  
THEN the transition is animated (not a snap/instant change)

WHEN collapsing a `BlockSheet` (Expanded → Collapsed)  
THEN the transition is animated

WHEN a `BlockSheet` is in Edit state  
THEN a save/confirm action and a cancel action are available

WHEN a `BlockSheet` renders the body section  
THEN the first paragraph of the body is rendered as normal body content — there is no "derived summary" field auto-generated from it

WHEN a `BlockSheet` is in Edit state with a reference field  
THEN it delegates to the reference widget component — no inline type-checking logic

WHEN a `BlockSheet` is in Edit state with a string field  
THEN it delegates to the string widget component with `field`, `value`, and `readonly` props

WHEN a `BlockSheet` is in Collapsed or Expanded state  
THEN the display is identical to pre-widget-system behavior — widgets are only used in Edit state

WHEN a `BlockSheet` is in Expanded state (not Edit)  
AND a widget is rendered for display purposes  
THEN `readonly` is `true` and the widget renders as read-only

WHEN a `BlockSheet` is in Edit state  
THEN no `BlockRelationships` section is rendered — editing shows field inputs and description textarea only

---

### REQ-07 — Single-Active-Editor Invariant

Only one `BlockSheet` may be in Edit state at any moment across the entire feed.

**Scenarios:**

WHEN Sheet A is in Edit state and the user activates the pencil button on Sheet B  
THEN Sheet A exits Edit state (reverts to Collapsed or Expanded) and Sheet B enters Edit state

WHEN the feed contains N sheets and the user activates edit on any one of them  
THEN exactly 1 Sheet is in Edit state and N-1 Sheets are in non-edit state

WHEN the edit-lock state is implemented  
THEN it is scoped to `BlockFeed` and passed to child Sheets via props/emit — it is NOT a global store or singleton

---

### REQ-08 — `BlockFeed` (Central Panel Composition)

`BlockFeed` orchestrates the central panel as a feed of `BlockSheet` components: one concept Sheet pinned at top, followed by its instance Sheets, slightly indented and reorderable.

**Scenarios:**

WHEN a concept with N instances is selected  
THEN the central panel shows 1 concept Sheet (`kind="concept"`) pinned at the top followed by N instance Sheets (`kind="instance"`) slightly indented below it

WHEN the concept Sheet is displayed in the feed  
THEN it is not reorderable — no reorder controls are shown on it

WHEN an instance Sheet is displayed in the feed  
THEN it has up/down arrow reorder controls visible

WHEN the user activates the "move up" control on instance Sheet at position i (i > 1)  
THEN that instance Sheet moves to position i-1, using `moveItemUp` with stable list-item IDs

WHEN the user activates the "move down" control on instance Sheet at position i (i < N)  
THEN that instance Sheet moves to position i+1, using `moveItemDown` with stable list-item IDs

WHEN the first instance Sheet's "move up" control is activated  
THEN no reorder occurs (already at top of instance list)

WHEN the last instance Sheet's "move down" control is activated  
THEN no reorder occurs (already at bottom)

WHEN `TextEditor` renders the central panel  
THEN it delegates all feed rendering to `<BlockFeed>` and retains only list-item IDs and move logic

---

### REQ-09 — Concepts Sidebar (`ConceptTreeNode`)

The concepts sidebar renders each concept as a `BlockPill` with `kind="concept"`.

**Scenarios:**

WHEN `ConceptTreeNode` renders a concept entry  
THEN it uses `<BlockPill kind="concept">` without any `size` prop

WHEN the sidebar is displayed  
THEN no concept entry contains hand-rolled identity markup outside `BlockPill`

---

### REQ-10 — Matrix Headers as Pills (Matrices Are Not Blocks)

Matrices are relation containers, not blocks. The matrix grid (`MatricesGrid`) is not a block component. Block display inside the matrix is limited to header Pills.

**Scenarios:**

WHEN `MatricesGrid` renders axis source/target headers  
THEN it uses `<BlockPill kind="concept">` for each axis header

WHEN `MatricesGrid` renders row or column item headers  
THEN it uses `<BlockPill kind="instance">` for each row/column item

WHEN `MatricesGrid` is audited for dead computeds  
THEN `sourceConceptEmoji`, `targetConceptEmoji`, `sourceColorClasses`, `targetColorClasses`, and the stale `getColorClasses` import are absent

WHEN any matrix header is rendered  
THEN no `size` prop is passed to `BlockPill`

---

### REQ-11 — Legacy Size Axis Removal

The `sm` / `md` / `lg` / `xs` size prop is fully removed from all block components.

**Scenarios:**

WHEN any component passes a `size` prop to `BlockPill`, `BlockCard`, or `BlockSheet`  
THEN TypeScript compilation emits a type error (prop does not exist)

WHEN the codebase is searched for `size="sm"`, `size="md"`, `size="lg"`, `size="xs"` on block components  
THEN zero matches are found

---

### REQ-12 — No Backend or Persistence Changes

This change is purely a presentation-layer consolidation. No data model, API, or persistence behavior is modified.

**Scenarios:**

WHEN the block display system is fully applied  
THEN the markdown serialization format, frontmatter structure, and file save behavior are identical to pre-change behavior

WHEN a file is opened, not modified, and saved after the change  
THEN the output markdown is byte-for-byte identical to the input (excluding `last_saved` timestamp)

---

### REQ-13 — Accessibility on Icon-Only Controls

All icon-only interactive elements in the block family (hover toolbar buttons: reorder, add-child, delete, edit pencil) must have accessible labels.

**Scenarios:**

WHEN a hover toolbar button renders with icon only (no visible text)  
THEN it has an `aria-label` attribute describing the action

WHEN focus-visible styling is applied  
THEN all interactive elements in `BlockPill`, `BlockCard`, `BlockSheet`, and `BlockFeed` show a visible focus ring

---

### REQ-14 — Reference Field Display in Sheets

Reference fields rendered inside `BlockSheet` (Collapsed or Expanded state) MUST display their value as a clickable wiki-link. The wiki-link MUST use the `[[Name]]` delimiter pattern and MUST be visually distinct from plain string values.

**Scenarios:**

WHEN a `BlockSheet` is in Collapsed state with a reference field  
AND the field is rendered  
THEN the value appears as a clickable `[[Name]]` link

WHEN a `BlockSheet` is in Expanded state with a reference field  
AND the field is rendered  
THEN the value appears as a clickable `[[Name]]` link

WHEN a `BlockSheet` displays a reference field as a wiki-link  
AND the user clicks the link  
THEN the application selects or navigates to the referenced block in the feed

---

## 3. Out-of-Scope Constraints

- No `BlockMatrix` component — matrices are relation containers, not blocks.
- No drag-and-drop reorder — only up/down arrow controls.
- No multi-Sheet simultaneous editing.
- No new markers, concept types, or field types.
- No backend or persistence changes.
