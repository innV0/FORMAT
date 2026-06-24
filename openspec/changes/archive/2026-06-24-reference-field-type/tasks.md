# Tasks: Reference Field Type

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 450-500 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Widget system foundation: types, 5 widget components, registry | PR 1 | base = main; self-contained, no existing code modified |
| 2 | Integration: BlockSheet widget swap, BlockPill wiki-links, renameBlock | PR 2 | base = PR 1; modifies existing components |
| 3 | Testing + docs: unit/component tests, spec updates, template update | PR 3 | base = PR 2; verification and documentation |

## Phase 1: Foundation

- [x] 1.1 Add `FieldType` type alias and `FieldDefinition` interface to `src/types/index.ts`
- [x] 1.2 Create `src/components/editor/widgets/injection.ts` with `UpdateFieldKey` InjectionKey
- [x] 1.3 Create `src/components/editor/widgets/FieldString.vue` (input[type=text], 3 props)
- [x] 1.4 Create `src/components/editor/widgets/FieldBoolean.vue` (checkbox + label, 3 props)
- [x] 1.5 Create `src/components/editor/widgets/FieldNumber.vue` (input[type=number], 3 props)
- [x] 1.6 Create `src/components/editor/widgets/FieldSelect.vue` (dropdown from field.options, 3 props)
- [x] 1.7 Create `src/components/editor/widgets/FieldReference.vue` (autocomplete from modelTree, 3 props)
- [x] 1.8 Create `src/components/editor/widgets/index.ts` with `WIDGET_REGISTRY` and `resolveWidget()`

## Phase 2: Core Integration

- [x] 2.1 Replace inline v-if chain in `src/components/editor/BlockSheet.vue` (lines 146-189) with `<component :is="resolveWidget(field.type)">` + provide `UpdateFieldKey`
- [x] 2.2 Update `src/components/editor/BlockPill.vue` `visibleFields` computed to detect reference-type fields and format as `[[Name]]` wiki-link with clickable navigation
- [x] 2.3 Add step 7 to `renameBlock()` in `src/stores/document.ts` — scan modelTree nodes' fields for reference-type values matching oldName

## Phase 3: Testing

- [x] 3.1 Add unit tests to `src/stores/__tests__/document.test.ts` for `renameBlock` reference field scanning (3 cases: updates matching, ignores non-matching, handles multiple nodes)
- [x] 3.2 Add unit test for `resolveWidget()` — returns correct component per type, falls back to string for unknown
- [x] 3.3 Add component test for `FieldReference.vue` — renders suggestions filtered by `target_concepts`, clears value on empty input
- [x] 3.4 Add component tests for `FieldString.vue`, `FieldBoolean.vue`, `FieldNumber.vue`, `FieldSelect.vue` — render correct input element, emit `updateField` on change

## Phase 4: Documentation & Specs

- [x] 4.1 Create `src/components/editor/widgets/README.md` — developer docs for adding new field type widgets
- [x] 4.2 Update `docs/V_0-1-3/_format.md` → copy to `docs/V_0-1-4/format-spec.md` with `reference` in field type enum
- [x] 4.3 Update `docs/templates/procedures/V_1-0-0/procedures_V_1-0-0_FORMAT.md` — add `artifact` concept, step `input`/`output`/`output_status` fields
- [x] 4.4 Bump FORMAT spec version references from V_0-1-3 to V_0-1-4 in template frontmatter and URLs
