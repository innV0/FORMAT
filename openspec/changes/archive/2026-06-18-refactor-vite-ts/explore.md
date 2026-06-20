# Exploration: Refactor innV0 Business Modeler to Vite + Vue 3 + TS + Tailwind + shadcn-vue

## Current State

The current project is a single-page HTML application (`index.html`) containing:
1. **CDNs & Global Imports**:
   - Tailwind CSS via CDN.
   - Vue 3 via global UMD build (`unpkg`).
   - Font loading (Inter) from Google Fonts.
2. **Monolithic Vue App Script**:
   - A recursive component `ConceptTreeNode` for traversing categories in the sidebar.
   - Global reactive state (`ref`s for file handles, workspace file list, metamodel schema, model data, hierarchical tree, node markers, metamatrix configurations, and matrix cells values).
   - Hardcoded default fallback metamodel with 100+ concepts (synchronized with `innV0_master_data.json` schema).
   - Core utility methods:
     - File System Access API hooks (`window.showDirectoryPicker`, reading/writing files, folder scanning).
     - Markdown parser/serializer to/from dynamic Vue state. It parses section titles prefixed by `# `, frontmatter, markdown tables for metamodel configurations, markers, hierarchy lists, and relational matrices.
     - Basic markdown renderer using simple regex strings.
     - Matrix generation & UI handlers (cell widgets, rotation cycles, parameter parsing).
3. **Master Metamodel Data (`innV0_master_data.json`)**:
   - A ~1.1MB JSON file containing unified business modeling definitions, methodologies, prompts, and types.
   - Used for enriching the UI dynamically when a workspace is connected.

---

## Affected Areas

1. **Routing & Views**:
   - While the current app is single-view, it has distinct editor panels ("Text Concept Editor", "Unified Tree View", "Metamatrix Config Editor", "Relational Matrices Grid").
2. **State Management**:
   - Currently, a single Vue App instance manages all reactive variables. This needs to be moved to a centralized store or clean composables.
3. **Components & Layout**:
   - Top Header (Nav, Connection buttons, sync status).
   - Sidebar (Metamodel status, connected directory files list, category hierarchical tree navigation).
   - Main Workspace Editor (Text Editor with preview, Tree node hierarchy editor, Metamatrix configuration, Relational Matrices grid).
   - Guidance Sidebar (contextual metadata, methodologies, prompts).
4. **Services / Composables**:
   - File system handling (File System Access API).
   - Markdown parsing & serialization.

---

## Approaches

### Option A: Monolithic Composable-based Architecture
Keep state in shared composables (`useWorkspace.ts`, `useMetamodel.ts`, `useMarkdown.ts`).
* **Pros**: Simple, highly modular, no additional state libraries (like Pinia) required if not strictly needed.
* **Cons**: Shared state across multiple composables might lead to coupling or race conditions if not designed carefully.

### Option B: Pinia + Component Splitting (Recommended)
Use Pinia for global state (`workspaceStore`, `metamodelStore`, `documentStore`) and extract UI panels into discrete Vue components utilizing Tailwind CSS + shadcn-vue components.
* **Pros**: Explicit state actions, easy testing, clean separation of concerns, TypeScript type-safety out of the box, shadcn-vue components simplify standard widgets (select, inputs, modals).
* **Cons**: Slightly higher setup overhead.

---

## Recommendation

Implement **Option B (Pinia + Vue 3 Component Decomposition)**.

### Target Directory Structure:
```text
src/
├── assets/          # Tailwind, global CSS, images
├── components/      # UI & Core components
│   ├── layout/      # Header, Left Sidebar, Right Guidance Sidebar
│   ├── editor/      # TextEditor, TreeEditor, MetamatrixConfig, MatricesGrid
│   └── ui/          # shadcn-vue primitives (Button, Dropdown, Table, Input, Textarea, Card)
├── composables/     # Hooks (useFileSystem, useMarkdownParser)
├── stores/          # Pinia stores (workspace, metamodel, document)
├── types/           # TS Interfaces (Concept, Node, Matrix, Metamatrix)
├── utils/           # Helper functions (regex rendering, cycle coloring)
├── App.vue          # Main wrapper
└── main.ts          # Mount app, load plugins
```

### Key Refactoring Steps:
1. **Scaffold Project**: Initialize Vite + Vue 3 + TS + Tailwind CSS + shadcn-vue (Radix Vue + Lucide Icons).
2. **Define Type Specifications**: Translate structures in `innV0_master_data.json` and the markdown parser states into clean TypeScript types (`types/metamodel.ts`, `types/document.ts`).
3. **Extract Parser Logic**: Move `parseMarkdownModel` and `generateMarkdownFileContent` into a pure utility service, adding unit tests to guarantee 100% format parity with the original single-file implementation.
4. **Implement Global Stores**:
   - `useMetamodelStore`: Loads master definitions from the JSON file.
   - `useWorkspaceStore`: Interfaces with directory picker handles and maintains list of local markdown documents.
   - `useDocumentStore`: Holds the active parsed model state, handling changes, tracking dirty/unsaved states, and serializing outputs.
5. **Component Componentization**:
   - Convert `ConceptTreeNode` into a dedicated recursive component.
   - Port matrix grid widgets to Tailwind/shadcn-vue styled elements.
   - Implement clean views for hierarchy, text, metamatrix, and matrix grid views.

---

## Risks

1. **File System Access API Compatibility**:
   - The app uses `window.showDirectoryPicker()` which is fully supported in Chromium browsers but has limitations or requires specific permissions in others. We must maintain proper fallbacks or clear environment warnings.
2. **Markdown Parser Parity**:
   - The regex-based markdown parser/serializer must output exact matching syntax to avoid breaking current user markdown files or causing git diff noise. Comprehensive test coverage is necessary.
3. **Master JSON Payload**:
   - Loading a ~1.1MB JSON file in the frontend. We should handle it asynchronously or pre-compile/minify if possible.

---

## Ready for Proposal

**Yes**
