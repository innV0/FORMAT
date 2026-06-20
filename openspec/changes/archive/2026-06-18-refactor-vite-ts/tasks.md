# Tasks: Refactor innV0 Business Modeler to Vite + Vue 3 + TS

This document details the step-by-step implementation tasks required to refactor the monolithic single-file application into a modular Vite + Vue 3 + TypeScript application.

---

## Review Workload Forecast

*   **Estimated Changed Lines**: > 1000 lines (High)
*   **Delivery Strategy**: `exception-ok` (Requested by user to run full automatic refactoring)
*   **Workload Classification**: Size Exception (`size-exception`)
*   **Rationale/Decisions**:
    *   Direct migration of a monolithic app into modular Vue components requires rewriting all templates, logic, styles, and state management at once.
    *   Splitting the changes into multiple small PRs is skipped to run the full transition automatically as an exception.
    *   Parser roundtrip parity tests will be set up first to validate output exactness before modifying workspace/UI modules.

---

## Phase 1: Environment & Project Scaffolding
- [x] **Task 1.1**: Update `package.json` with production dependencies (`vue`, `pinia`, `lucide-vue-next`, `radix-vue`, `clsx`, `tailwind-merge`) and development tools (`vite`, `vitest`, `typescript`, `@vitejs/plugin-vue`, `tailwindcss`, `postcss`, `autoprefixer`, `@vue/tsconfig`).
- [x] **Task 1.2**: Create `tsconfig.json` and `@/` path alias mappings.
- [x] **Task 1.3**: Create `vite.config.ts` with `@vitejs/plugin-vue` and alias resolution.
- [x] **Task 1.4**: Set up Tailwind CSS configuration (`tailwind.config.js` and `postcss.config.js`).
- [x] **Task 1.5**: Create `src/assets/index.css` containing Tailwind CSS directives and theme colors.

## Phase 2: Type Definitions
- [x] **Task 2.1**: Create `src/types/index.ts` containing type declarations for metamodels, nodes, matrices, and workspace items.

## Phase 3: Pure Utilities & Parity Testing
- [x] **Task 3.1**: Create `src/utils/markdownParser.ts` implementing stateless markdown serialization and parsing.
- [x] **Task 3.2**: Create Vitest setup and write parser parity tests in `src/utils/__tests__/markdownParser.test.ts` (asserting roundtrip serialization against sample models).
- [x] **Task 3.3**: Verify that the parser passes all parity checks.

## Phase 4: File System Composables
- [x] **Task 4.1**: Create `src/composables/useFileSystem.ts` with File System Access API routines (directory picker, scanning folders, exclusions, reading files, generating backups).

## Phase 5: Pinia Store Architecture
- [x] **Task 5.1**: Create `src/stores/workspace.ts` to manage connected directory handles, alphabetical file trees, and loading metamodels.
- [x] **Task 5.2**: Create `src/stores/metamodel.ts` for dynamic custom metamodel path resolving and defaults fallback.
- [x] **Task 5.3**: Create `src/stores/document.ts` to hold document states, tree mutations, node markers, config matrices, cell updates, and dirty state.

## Phase 6: UI Component Migration
- [x] **Task 6.1**: Port layout components (`src/components/layout/`):
  - `Header.vue` (top nav, demo status, directory connect buttons).
  - `LeftSidebar.vue` (files list, workspace navigation).
  - `RightGuidanceSidebar.vue` (metamodel concept details, markdown instructions).
  - `ConceptTreeNode.vue` (recursive concept hierarchy tree sidebar item).
- [x] **Task 6.2**: Port editor panels (`src/components/editor/`):
  - `TextEditor.vue` (raw content editor).
  - `TreeEditor.vue` (interactive `Stakeholder -> Segment -> Profile -> Persona` tree modifier).
  - `MetamatrixConfig.vue` (defining custom relation matrix tables).
  - `MatricesGrid.vue` (editing cell widget inputs: boolean/cycle/scale/set).
- [x] **Task 6.3**: Scaffold basic shadcn-vue custom component wrappers in `src/components/ui/` for buttons, cards, tables, selects, and inputs.

## Phase 7: App Integration & Entry Point
- [x] **Task 7.1**: Build main app structure in `src/App.vue` layout linking all sidebars and active editors.
- [x] **Task 7.2**: Create `src/main.ts` to mount the Vue application and register Pinia.
- [x] **Task 7.3**: Rewrite `index.html` to point to `/src/main.ts` and remove CDN imports.

## Phase 8: Verification & Parity Runs
- [x] **Task 8.1**: Run Vitest and confirm that all code compiles successfully (`npm run build`).
- [x] **Task 8.2**: Validate Scenario 1-4 parity tests to guarantee no functionality/formatting regressions.
