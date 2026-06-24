# Field Widget System

Each field type defined in a concept's `fields` array maps to a Vue component in this directory. `BlockSheet` resolves the widget via `resolveWidget(field.type)` and renders it with `<component :is>`.

## Widget Contract

Every widget accepts exactly **3 props**:

| Prop | Type | Description |
|------|------|-------------|
| `field` | `FieldDefinition` | The field schema from the concept's `fields` array |
| `value` | `any` | Current value from `block.fields[field.name]` |
| `readonly` | `boolean` | Whether the field is read-only |

The `updateField` callback is passed via **provide/inject** (not a 4th prop). Use `inject(UpdateFieldKey)` to access it.

## Registry

`WIDGET_REGISTRY` in `index.ts` maps type strings to components:

```typescript
import { WIDGET_REGISTRY, resolveWidget } from './widgets';
const widget = resolveWidget(field.type); // returns Component
```

Unknown types fall back to `FieldString`.

## Adding a New Field Type

1. Create `FieldYourType.vue` following the 3-prop contract
2. Import it in `index.ts`
3. Add the type string to `FieldType` in `src/types/index.ts`
4. Add the entry to `WIDGET_REGISTRY`
5. Add tests in `__tests__/`

## Files

| File | Purpose |
|------|---------|
| `index.ts` | Registry + `resolveWidget()` |
| `injection.ts` | `UpdateFieldKey` InjectionKey |
| `FieldString.vue` | Text input (`input[type=text]`) |
| `FieldBoolean.vue` | Checkbox + label |
| `FieldNumber.vue` | Number input (`input[type=number]`) |
| `FieldSelect.vue` | Dropdown from `field.options` |
| `FieldReference.vue` | Autocomplete filtered by `field.target_concepts` |
