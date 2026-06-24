# Proposal: Remove Hardcoded Business-Template Labels

## Status

Draft — Exploration complete.

## Problem

The application was originally built for a single template: **Business**. When **Procedures** support was added, several UI labels were **hardcoded** instead of being made dynamic. This causes incorrect labels when working with non-Business templates:

| Location | Current (Hardcoded) | Expected (Dynamic) |
|----------|---------------------|---------------------|
| `Header.vue:13` | `FORMAT Business Modeler` | `FORMAT Modeler` or template-aware name |
| `LeftSidebar.vue:43` | `Business Model` | `Model` |
| `document.ts:13,72` | `Business summary` (default concept) | Template-derived default |
| `ModelInfoPanel.vue:241` | `Business summary` | Template-derived default |

**Evidence from screenshot:** User opened `test_procedure` workspace, but UI still shows "Business Model" in sidebar and "Business Modeler" in header.

## Proposal

Replace hardcoded business-template labels with **generic** or **template-derived** alternatives:

### Quick Wins (this change)

1. **`LeftSidebar.vue`**: Change `Business Model` → `Model`
2. **`Header.vue`**: Change `FORMAT Business Modeler` → `FORMAT Modeler`
3. **`document.ts`**: Remove hardcoded `'Business summary'` fallback; derive from template or use first concept
4. **`ModelInfoPanel.vue`**: Same as above — derive concept selection from template

### Future Improvements

- Display template name in header (e.g., "FORMAT Business Modeler" when Business template is active)
- UI to switch between templates
- Template-aware concept naming throughout the app

## Non-goals (this change)

- Template switching UI
- Renaming all Business-specific strings in `innV0_master_data.json` (those are template content, not UI labels)
- Spec version bump

## Impact

- `src/components/layout/Header.vue` — label text
- `src/components/layout/LeftSidebar.vue` — label text
- `src/stores/document.ts` — default concept logic
- `src/components/editor/ModelInfoPanel.vue` — concept selection

## Files to Modify

```
src/components/layout/Header.vue
src/components/layout/LeftSidebar.vue
src/stores/document.ts
src/components/editor/ModelInfoPanel.vue
```
