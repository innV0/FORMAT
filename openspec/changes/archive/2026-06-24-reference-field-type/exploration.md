# Exploration: reference-field-type

## Current State

The FORMAT system currently supports four field types for concept elements: `string`, `boolean`, `number`, and `select` (with optional `options` array). These are defined in the FORMAT spec (V_0-1-3, §4.1) and implemented in the Vue application through inline conditional rendering in `BlockSheet.vue` (lines 142-191).

**Field rendering today:**
- `BlockSheet.vue` uses `v-if/v-else-if/v-else` chains to render each field type with different HTML inputs
- `BlockPill.vue` displays field values as plain text in the popup (lines 72-81, 248-259)
- No widget abstraction exists for field types — each is hardcoded in the template

**Matrix widget system:**
- Matrices already have a widget abstraction (`MatamatrixRow.widgetType`: `boolean | cycle | scale | set | text`)
- `MatricesGrid.vue` renders widgets using `v-if/v-else-if` chains (lines 108-159)
- This pattern could be extended to field types

**Rename propagation:**
- `renameBlock()` in `document.ts` (lines 109-217) handles renaming across:
  - `matrixValues` keys
  - `modelTextData` inline markers and headers
  - `metamatrix` source/target/name
  - `nodeMarkers` keys
  - Wiki-links `[[oldName]]` → `[[newName]]` in descriptions and text data

**Procedures template:**
- Current steps concept has fields: `step_type` (select), `next` (string), `condition` (string)
- No `artifact` concept exists
- No reference fields linking steps to artifacts

## Affected Areas

- `docs/V_0-1-3/_format.md` — Add `reference` to field type enum (§4.1)
- `src/types/index.ts` — Extend `Concept.fields` type definition if needed
- `src/components/editor/BlockSheet.vue` — Add reference field renderer (lines 142-191)
- `src/components/editor/BlockPill.vue` — Display reference fields as wiki-links (lines 72-81, 248-259)
- `src/stores/document.ts` — Extend `renameBlock()` to update reference field values (lines 109-217)
- `docs/templates/procedures/V_1-0-0/procedures_V_1-0-0_FORMAT.md` — Add `artifact` concept and update `steps` fields
- `src/utils/markdownParser.ts` — Parse reference field values from YAML blocks

## Approaches

### Approach 1: Inline Extension (Minimal)

Extend the existing `v-if/v-else-if/v-else` chains in `BlockSheet.vue` and `BlockPill.vue` to handle the new `reference` type.

**Implementation:**
- Add `reference` case to `BlockSheet.vue` inline rendering (after `number` type)
- Add `reference` case to `BlockPill.vue` `visibleFields` computed property
- Update `renameBlock()` to scan `fields` object for values matching renamed name
- Add `artifact` concept to procedures template

**Pros:**
- Minimal code changes
- Follows existing patterns
- Fast implementation

**Cons:**
- No widget abstraction for future field types
- Tight coupling between field types and rendering logic
- Hard to maintain if more field types are added

**Effort:** Low

### Approach 2: Widget Component Abstraction

Extract each field type into a dedicated widget component (`FieldWidget.vue` or `widgets/FieldString.vue`, `FieldBoolean.vue`, etc.).

**Implementation:**
- Create `src/components/editor/widgets/` directory
- Create `FieldWidget.vue` base component with props: `field`, `value`, `readonly`
- Create `FieldString.vue`, `FieldBoolean.vue`, `FieldNumber.vue`, `FieldSelect.vue`, `FieldReference.vue`
- Update `BlockSheet.vue` to use `<FieldWidget>` instead of inline rendering
- Update `BlockPill.vue` to use widget for display
- Extend `renameBlock()` for reference fields
- Add `artifact` concept

**Pros:**
- Clean separation of concerns
- Easy to add new field types
- Reusable components
- Better testability
- Consistent with matrix widget pattern

**Cons:**
- More initial code
- Requires refactoring existing field rendering
- Higher complexity for first implementation

**Effort:** Medium

### Approach 3: Hybrid — Widget for Display, Inline for Edit

Use widget components only for display in `BlockPill.vue`, keep inline rendering in `BlockSheet.vue` for editing.

**Implementation:**
- Create `FieldDisplay.vue` widget for `BlockPill.vue` popup display
- Keep `BlockSheet.vue` inline rendering but add `reference` case
- Extend `renameBlock()` for reference fields
- Add `artifact` concept

**Pros:**
- Partial abstraction without full refactor
- Display logic is cleaner
- Edit logic stays familiar

**Cons:**
- Inconsistent approach (widgets for display, inline for edit)
- Still tight coupling in edit mode
- Doesn't fully solve the maintainability problem

**Effort:** Low-Medium

## Recommendation

**Approach 2: Widget Component Abstraction** — Recommended.

**Rationale:**
1. The matrix system already demonstrates the widget pattern works well (MatricesGrid.vue)
2. Adding `reference` is the perfect opportunity to introduce field widgets
3. Future field types (e.g., `date`, `url`, `email`) will be trivial to add
4. The codebase is growing — abstraction now prevents tech debt later
5. Testing individual widget components is easier than testing inline conditionals

**Tradeoff:** Higher initial effort (Medium) pays off in maintainability and extensibility. The inline approach (Low effort) creates technical debt that will cost more to fix later.

## Risks

1. **Breaking existing documents**: Adding `reference` field type could break parsers if they don't handle unknown types gracefully. **Mitigation:** Ensure parsers default to `string` for unknown types.

2. **Reference field value format**: Need to decide if reference values are plain strings (e.g., `"Step Name"`) or wiki-link syntax (`[[Step Name]]`). **Mitigation:** Use plain strings in YAML, render as wiki-links in UI. Update in `renameBlock()` to handle plain string values.

3. **Circular references**: Reference fields could create circular dependencies (A references B, B references A). **Mitigation:** No runtime validation needed for v1; document this as a known limitation.

4. **Template migration**: Existing procedures documents won't have `artifact` concept. **Mitigation:** Documents are forward-compatible; missing concepts simply won't render.

5. **Widget component complexity**: Introducing widgets adds a new layer of abstraction. **Mitigation:** Keep widgets simple — each handles one field type with minimal logic.

## Ready for Proposal

**Yes** — The exploration is complete. The recommendation is clear (widget component abstraction), risks are identified with mitigations, and the approach aligns with existing patterns in the codebase.

**Next steps for orchestrator:**
1. Present recommendation to user
2. If approved, proceed to `sdd-propose` with Approach 2
3. Include widget component structure in proposal
4. Specify reference field format (plain strings in YAML, wiki-links in UI)
