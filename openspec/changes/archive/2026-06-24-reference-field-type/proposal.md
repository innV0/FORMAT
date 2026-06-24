# Proposal: reference-field-type

## Intent

FORMAT supports only `string`, `boolean`, `number`, and `select` field types. Steps in Procedures need to reference artifacts, but there is no `reference` field type — and no widget abstraction makes adding one fragile. This change adds `reference` as a first-class field type and introduces a widget component system so future types (date, url, email) are trivial.

## Scope

### In Scope
- Add `reference` to FORMAT spec field type enum (V_0-1-3 → V_0-1-4)
- Create widget component system: one component per field type (`FieldString.vue`, `FieldBoolean.vue`, `FieldNumber.vue`, `FieldSelect.vue`, `FieldReference.vue`)
- Add `artifact` concept to Procedures template (V_1-0-0 → V_1-1-0)
- Steps gain `input` (reference), `output` (reference), `output_status` (string) fields
- Reference values stored as plain strings in YAML, rendered as wiki-links in UI
- Extend `renameBlock()` to scan `fields` object for reference values
- `target_concepts` as template-level field definition property (NOT spec-level)

### Out of Scope
- Reference field validation or circular-reference detection
- Reference fields in matrices or non-concept contexts
- Changes to existing field type behavior
- Persistence format changes (save/load untouched)

## Capabilities

### New Capabilities
- `field-widget-system`: Widget component system — one component per field type, props: `field`, `value`, `readonly`. Replaces inline `v-if/v-else-if/v-else` chains in `BlockSheet.vue`.

### Modified Capabilities
- `format-spec`: Add `reference` to the field type enum (§4.1). Reference values are plain strings. Template-level `target_concepts` property defines which concept types a reference can target.
- `block-display-system`: `BlockSheet` uses widget components for field rendering. `BlockPill` displays reference fields as wiki-links (clickable, styled like `[[Name]]`).

## Approach

Widget Component Abstraction (Approach 2 from exploration). Create `src/components/editor/widgets/` with a base `FieldWidget.vue` and five type-specific widgets. `BlockSheet.vue` replaces inline rendering with `<FieldWidget>`. `BlockPill.vue` uses widgets for display. Extend `renameBlock()` for reference field values.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `docs/V_0-1-3/_format.md` | Modified | Add `reference` to field type enum |
| `src/components/editor/widgets/` | New | Widget components per field type |
| `src/components/editor/BlockSheet.vue` | Modified | Replace inline rendering with `<FieldWidget>` |
| `src/components/editor/BlockPill.vue` | Modified | Reference fields display as wiki-links |
| `src/stores/document.ts` | Modified | `renameBlock()` scans `fields` for reference values |
| `docs/templates/procedures/V_1-0-0/procedures_V_1-0-0_FORMAT.md` | Modified | Add `artifact` concept, step reference fields |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Existing documents with unknown field types | Low | Parsers default to `string` for unknown types |
| Circular references between artifacts | Low | No runtime validation in v1; documented limitation |
| Widget refactor breaks existing field rendering | Medium | Incremental: add widgets alongside existing code, then swap |

## Rollback Plan

1. Revert `src/components/editor/widgets/` (delete directory)
2. Restore `BlockSheet.vue` and `BlockPill.vue` from pre-change versions
3. Revert `renameBlock()` changes in `document.ts`
4. Remove `reference` from FORMAT spec; remove `artifact` from procedures template
5. No data migration needed — reference field values are plain strings, harmless if unrecognized

## Dependencies

None. All changes are self-contained within the Vue app and docs.

## Success Criteria

- [ ] `reference` field type appears in FORMAT spec V_0-1-4
- [ ] Widget components render all five field types without regression
- [ ] `BlockPill` displays reference values as clickable wiki-links
- [ ] `renameBlock()` updates reference field values when referenced name changes
- [ ] Procedures template V_1-1-0 includes `artifact` concept with step reference fields
- [ ] Existing documents load and save correctly after the change
- [ ] No TypeScript errors; no visual regressions in field rendering
