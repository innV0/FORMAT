# Design: reference-field-type

## 1. Technical Approach

**Widget Component Registry Pattern.** Each field type (`string`, `boolean`, `number`, `select`, `reference`) maps to one Vue component in `src/components/editor/widgets/`. A registry object maps type strings to components. `BlockSheet` resolves the widget via `resolveWidget(field.type)` and renders it with `<component :is="widget" .../>`. The inline `v-if/v-else-if/v-else` chain (lines 146–189) is replaced entirely.

Each widget accepts exactly three props: `field` (the definition object), `value` (current value), and `readonly` (boolean). The `updateField` callback is passed via Vue's provide/inject or a scoped slot — NOT as a fourth prop, to keep the contract clean.

**Reference values stored as plain strings.** The `reference` type stores the target block's name as a string. No IDs, no wrapper objects. This keeps YAML serialization trivial and matches existing `string` storage.

## 2. Architecture Decisions

### Decision 1: Widget registry vs. dynamic import

**Chosen:** Static registry in `src/components/editor/widgets/index.ts`.

**Alternatives considered:**
- *Dynamic `import()` by type string*: Fragile, breaks tree-shaking, adds async complexity for a set of 5 small components.
- *`v-if` chain in a wrapper component*: Not meaningfully different from the current inline chain.

**Rationale:** Static map is explicit, type-safe, and trivial to extend (add one component + one registry entry). The 5 components are small enough that bundling all is negligible.

### Decision 2: How BlockSheet passes updateField to widgets

**Chosen:** Provide/inject via `InjectionKey`. `BlockSheet` provides `updateField` under a key; widgets inject it.

**Alternatives considered:**
- *Fourth prop*: Violates the 3-prop contract from the spec.
- *Emit from widget to parent*: Requires each widget to define an `update:field` emit, duplicating the event plumbing.

**Rationale:** Provide/inject keeps the widget API clean (3 props only) while widgets still trigger mutations. Standard Vue pattern for ancestor-to-descendant callbacks.

### Decision 3: Reference widget suggestions source

**Chosen:** Inject the full `modelTree` (from document store) into the reference widget via provide/inject. The widget filters by `field.target_concepts` to produce suggestions.

**Rationale:** The reference widget needs the list of all blocks to suggest names. Passing the entire tree is cheap (it's reactive and already in memory). Filtering by `target_concepts` is done client-side in the widget.

## 3. Data Flow

```
User edits field in BlockSheet
  → BlockSheet.renderField(field)
  → resolveWidget(field.type) returns FieldXxx.vue
  → Widget renders with { field, value, readonly: false }
  → Widget calls injected updateField(fieldName, newValue)
  → BlockSheet.updateField writes to block.fields[fieldName]
  → emit('update:field') propagates to parent
  → documentStore.triggerUnsavedChanges()
```

For reference values specifically:
```
User types in FieldReference.vue input
  → Widget filters modelTree by field.target_concepts
  → Suggestions displayed as dropdown
  → User selects a block name
  → updateField(fieldName, blockName) — plain string
```

For rename propagation:
```
documentStore.renameBlock(oldName, newName, context)
  → Step 7 (NEW): scan all modelTree nodes' fields
  → For each field definition with type === 'reference':
    → If block.fields[field.name] === oldName, set to newName
  → triggerUnsavedChanges()
```

## 4. File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/editor/widgets/index.ts` | **New** | Widget registry: `{ string, boolean, number, select, reference }` → component mapping + `resolveWidget()` helper |
| `src/components/editor/widgets/FieldString.vue` | **New** | String field widget (input[type=text]) |
| `src/components/editor/widgets/FieldBoolean.vue` | **New** | Boolean field widget (checkbox + label) |
| `src/components/editor/widgets/FieldNumber.vue` | **New** | Number field widget (input[type=number]) |
| `src/components/editor/widgets/FieldSelect.vue` | **New** | Select field widget (dropdown from `field.options`) |
| `src/components/editor/widgets/FieldReference.vue` | **New** | Reference field widget (text input with autocomplete from modelTree) |
| `src/components/editor/widgets/README.md` | **New** | Developer docs: how to add a new field type widget |
| `src/components/editor/BlockSheet.vue` | **Modified** | Replace inline `v-if/v-else-if/v-else` chain (lines 146–189) with `<component :is="resolveWidget(field.type)">` + provide `updateField` |
| `src/components/editor/BlockPill.vue` | **Modified** | In `visibleFields` computed (line 248–259), detect reference-type fields and format value as `[[Name]]` with wiki-link styling. Add `isWikiLink` flag to visible field objects |
| `src/stores/document.ts` | **Modified** | Add step 7 to `renameBlock()` (after wiki-link replacement at line 215): scan `modelTree` nodes' `fields` for reference-type fields matching `oldName` |
| `src/types/index.ts` | **Modified** | Add `FieldType` type alias: `'string' \| 'boolean' \| 'number' \| 'select' \| 'reference'`; optionally tighten `fields` type on `TreeNode` from `Record<string, any>` |
| `src/stores/__tests__/document.test.ts` | **Modified** | Add tests for `renameBlock` reference field scanning |

## 5. Interfaces / Contracts

```typescript
// src/types/index.ts
export type FieldType = 'string' | 'boolean' | 'number' | 'select' | 'reference';

export interface FieldDefinition {
  name: string;
  type: FieldType;
  default?: any;
  options?: string[];
  target_concepts?: string[];  // reference-only, template-level
}

// src/components/editor/widgets/index.ts
export interface FieldWidgetProps {
  field: FieldDefinition;
  value: any;
  readonly: boolean;
}

// Widget registry
import type { Component } from 'vue';
export const WIDGET_REGISTRY: Record<FieldType, Component> = {
  string: FieldString,
  boolean: FieldBoolean,
  number: FieldNumber,
  select: FieldSelect,
  reference: FieldReference,
};

export function resolveWidget(type: string): Component {
  return WIDGET_REGISTRY[type as FieldType] ?? WIDGET_REGISTRY.string;
}
```

The `updateField` injection key:

```typescript
// src/components/editor/widgets/injection.ts
import type { InjectionKey } from 'vue';
export const UpdateFieldKey: InjectionKey<(fieldName: string, value: any) => void> =
  Symbol('updateField');
```

## 6. Testing Strategy

**Unit tests (Vitest):**
- `renameBlock` reference field scanning: 3 tests — rename updates matching field, ignores non-matching, handles multiple nodes
- `resolveWidget`: returns correct component for each type, falls back to string for unknown

**Component tests (Vitest + @vue/test-utils):**
- `FieldReference.vue`: renders suggestions filtered by `target_concepts`; clears value on empty input
- `FieldString.vue`, `FieldBoolean.vue`, `FieldNumber.vue`, `FieldSelect.vue`: render with correct input element, emit `updateField` on change

**Integration (manual):**
- Create a document with reference fields → verify autocomplete works
- Rename a block that is referenced → verify reference values update
- Verify BlockPill displays `[[Name]]` for reference values

## 7. Migration / Rollout

1. **Add widgets alongside existing code.** Create `src/components/editor/widgets/` with all 5 components. Existing code untouched. No regression risk.
2. **Swap BlockSheet.** Replace the inline chain with `<component :is>`. Since each widget replicates the exact same HTML/behavior, this is a 1:1 swap. Verify visually.
3. **Add reference field support.** `FieldReference.vue` is a new widget, not a modification. Add `reference` to `FieldType` union. No existing documents use it yet.
4. **Extend `renameBlock()`.** Add step 7 after existing wiki-link step. Runs only when `block.fields` exists; harmless if no fields.
5. **Update specs.** Bump FORMAT to V_0-1-4, update procedures template.
6. **No data migration.** Reference values are plain strings. Existing documents unaffected. Unknown field types already fall back to string display.

**Rollback:** Delete `widgets/` directory, restore `BlockSheet.vue` and `BlockPill.vue` from git, revert `renameBlock()` addition. No data changes needed.

---

## Open Questions

None. All decisions resolved with rationale above.

## Summary

| Metric | Value |
|--------|-------|
| Approach | Widget component registry with provide/inject for field mutation |
| Key Decisions | 3 (registry, updateField plumbing, suggestions source) |
| Files Affected | 7 new, 4 modified |
| Testing Strategy | Unit (store + registry) + component (widget render/emit) + manual integration |
