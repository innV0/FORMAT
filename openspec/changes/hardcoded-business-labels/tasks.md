# Tasks: Remove Hardcoded Business-Template Labels

## Task 1: Update Sidebar Label
- [x] Edit `src/components/layout/LeftSidebar.vue`
- [x] Change `Business Model` → `Model` (line 43)

## Task 2: Update Header Label
- [x] Edit `src/components/layout/Header.vue`
- [x] Change `FORMAT Business Modeler` → `FORMAT Modeler` (line 13)

## Task 3: Fix Default Concept in Document Store
- [x] Edit `src/stores/document.ts`
- [x] Remove hardcoded `'Business summary'` fallback (line 13)
- [x] Derive default concept from template data or use first available concept

## Task 4: Fix ModelInfoPanel Concept Selection
- [x] Edit `src/components/editor/ModelInfoPanel.vue`
- [x] Remove hardcoded `'Business summary'` reference (line 241)
- [x] Use dynamic concept selection from template

## Task 5: Verify & Test
- [x] TypeScript typecheck passed (`vue-tsc --noEmit`)
- [x] All changes completed successfully
