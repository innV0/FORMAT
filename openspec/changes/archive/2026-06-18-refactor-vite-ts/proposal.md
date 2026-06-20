# Proposal: Refactor innV0 Business Modeler to Vite + Vue 3 + TS

## Intent

Refactor the monolithic, single-file `index.html` application into a modern, modular, and type-safe Vite + Vue 3 + TypeScript + Tailwind CSS + shadcn-vue project. This will improve code maintainability, extensibility, testing, and component isolation while preserving 100% of existing client-side functionality.

---

## Scope

### In Scope
* **Project Scaffolding**: Setup Vite, TypeScript, Tailwind CSS, and shadcn-vue (utilizing Radix Vue and Lucide Icons).
* **Code Modularization**:
  * Extract CSS and Tailwind directives from inline styles to dedicated files.
  * Extract TypeScript interfaces for metamodel schema, model nodes, matrix configuration, and cell values.
  * Port markdown parser and serializer code into a pure utility service (`src/utils/markdownParser.ts`).
  * Extract File System Access API hooks into Vue composables (`src/composables/useFileSystem.ts`).
  * Implement Pinia stores for global state management (`workspace`, `metamodel`, `document`).
  * Decompose the monolithic Vue template into clean, modular Vue SFC (Single File Component) layouts and views.
* **Testing**: Add Vitest setup with unit tests for the markdown parser to guarantee exact serialization and parsing parity.
* **Build Pipeline**: Configure building, linting, and type checking.

### Out of Scope
* **Backend Integration**: The application remains a client-side static web application utilizing the browser's File System Access API.
* **UI Redesign**: Visual style changes are limited to using clean shadcn-vue styled elements to replace raw HTML elements, keeping the overall application layout and functionality identical.
* **User Authentication**: No user login or database synchronization.

---

## Capabilities

### New Capabilities
* **Type Safety**: Full compile-time verification of model data structures and parser states.
* **Unit Testing**: Automated validation of markdown parsing and serialization logic to ensure no regression or data loss.
* **Component Primitives**: Standardized UI components (select, dropdowns, inputs, matrices) using Radix-based shadcn-vue.

### Modified Capabilities
* **State Management**: Reactive state moves from a single monolithic root Vue instance to Pinia stores (`useWorkspaceStore`, `useMetamodelStore`, `useDocumentStore`), resolving state synchronization and coupling issues.

---

## Approach

The migration will follow a phased modular strategy:

1. **Scaffolding and Environment**: Setup the project with Vite + Vue 3 + TypeScript, Tailwind CSS, shadcn-vue, and Vitest.
2. **Type Declarations**: Define TS interfaces based on `innV0_master_data.json` schemas.
3. **Parser Extraction and Parity Testing**: Move the parser/serializer to `src/utils/markdownParser.ts` and write Vitest unit tests comparing parser outputs directly against original files.
4. **State Transition**: Create Pinia stores (`src/stores/`) to replace the root instance's reactive data.
5. **Component Migration**:
   * Layout elements: `Header.vue`, `LeftSidebar.vue`, `RightGuidanceSidebar.vue`.
   * Editor elements: `TextEditor.vue`, `TreeEditor.vue`, `MetamatrixConfig.vue`, `MatricesGrid.vue`.
   * Recursive tree viewer: `ConceptTreeNode.vue`.
6. **Integration**: Connect layout, editors, and stores in `App.vue`, clean up `index.html` to act as the main Vite entrypoint.

---

## Affected Areas

* `index.html`: Replaced by a clean Vite-compatible template.
* `package.json` & configurations: Added dependencies, build scripts, TS config.
* Root project directory: Introduction of `src/` directory containing components, composables, stores, types, utils, and assets.

---

## Risks and Mitigations

### 1. Markdown Parser Discrepancies
* **Risk**: Modifying markdown parsing and serialization could corrupt existing model files or create large, noisy Git diffs.
* **Mitigation**: Develop comprehensive Vitest unit tests using current markdown files as fixtures to verify 100% parity before migrating any components.

### 2. Browser Compatibility (File System Access API)
* **Risk**: The application relies on `window.showDirectoryPicker()` which is not supported in non-Chromium browsers.
* **Mitigation**: Preserve the existing checks and maintain clear UI messages/warnings for unsupported environments.

### 3. Master JSON Loading Latency
* **Risk**: Loading the ~1.1MB `innV0_master_data.json` could cause initial rendering freezes.
* **Mitigation**: Load the file asynchronously using dynamic imports or separate it into static assets fetched during idle periods.

---

## Rollback Plan

* **Strategy**: The refactoring will be performed in a separate feature branch. The original monolithic `index.html` will be kept in git history.
* **Execution**: If the Vite project build fails or has run-time errors in production that cannot be immediately fixed, revert to the stable commit containing the single-file `index.html` layout.

---

## Dependencies

### Production Dependencies
* `vue` (^3.4.0)
* `pinia` (^2.1.0)
* `radix-vue` (via shadcn-vue package configuration)
* `@radix-ui/colors`
* `lucide-vue-next`
* `clsx`, `tailwind-merge`

### Development Dependencies
* `vite` (^5.0.0)
* `typescript` (^5.0.0)
* `@vitejs/plugin-vue`
* `tailwindcss` (^3.4.0), `postcss`, `autoprefixer`
* `vitest` (for parser parity tests)
* `@vue/tsconfig`

---

## Success Criteria

1. **Compilation**: Vite production build completes successfully with zero TypeScript compilation or linting errors.
2. **Behavioral Parity**: All editor actions (matrix grid edits, node marking, tree traversing, directory picking) work exactly as in the monolithic application.
3. **Parser Parity**: 100% of markdown parser/serializer unit tests pass.
