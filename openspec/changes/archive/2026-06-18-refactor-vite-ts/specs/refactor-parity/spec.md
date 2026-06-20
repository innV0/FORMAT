# Parity Specification: innV0 Business Modeler Refactoring (Vite + Vue 3 + TS)

## 1. Overview and Goal

This specification defines the functional and behavioral parity requirements for refactoring the monolithic, single-file `index.html` application into a modern Vite-based Vue 3 and TypeScript project. The primary goal is to preserve 100% of the client-side capability without any data loss or regression. 

The application utilizes local file access via the File System Access API, renders hierarchical business model concept editors, configures custom relational matrices, and serializes all project metadata back into structured Markdown files.

---

## 2. Core Parity Requirements

### 2.1 Workspace and Local Directory Access
*   **Browser Compatibility Guard**: The application relies on the browser's File System Access API. Since `window.showDirectoryPicker()` is not supported on all browsers, clear fallback UI text or messages must indicate directory connection is unsupported.
*   **Directory Picker**: Click "Connect Directory" to prompt the user to pick a folder using the File System Access API.
*   **File Tree Discovery**: 
    *   Recursively scan the connected directory for `.md` files.
    *   Exclude files inside `node_modules` and `backups` directories.
    *   List files alphabetically in the sidebar under "Workspace Files".
*   **Workspace Status Badge**:
    *   Show "Not Connected (Demo Mode)" if no directory is picked.
    *   Show "Synced" when all edits are saved.
    *   Show "Unsaved Changes" (yellow/orange warning badge) when any value, tree structure, or matrix config is modified.
*   **Ctrl+S Keyboard Shortcut**: Trigger saving of the active file when `Ctrl+S` or `Cmd+S` is pressed.
*   **Backups Generation**: On file save, write the serialized markdown contents to the target file. Additionally, create a timestamped backup inside a `backups/` sub-directory under the connected folder (formatted as `filename_YYYY-MM-DDTHH-MM-SS-MSZ.md`).

### 2.2 Metamodel Configuration and Guidance
*   **Metamodel Schema Loading**:
    *   Upon connecting a folder, attempt to read `innV0_master_data.json` at the root of the folder. If present, load concepts, markers, and matrix templates dynamically.
    *   If no local JSON exists, fall back to the built-in static metamodel definitions (representing default concepts such as Business Summary, Stakeholders, Segments, etc.).
*   **Relative Path Metamodel Resolution**: 
    *   When opening a markdown file, parse the `metamodel` path in the frontmatter.
    *   Resolve this path relative to the opened markdown file's directory within the workspace.
    *   Load and apply this metamodel configuration dynamically.
*   **Guidance Sidebar**:
    *   The right sidebar must display the active concept's summary/description, methodologies (rendered as Markdown), and prompts (with backticks stripped).

### 2.3 Concept Navigation and View Switching
*   **Sidebar Navigation Tree**: Build a hierarchical tree of concepts based on `category_id` references from the metamodel.
*   **Editor Views**:
    *   **Text Editor**: Used for concepts of type `text` or other non-hierarchical fields (e.g. Business Summary, Mission).
    *   **Hierarchy Tree Editor**: Used for the nested organizational concepts: Stakeholders, Segments, Profiles, Persona.
    *   **Metamatrix Config Editor**: Used for defining matrix connections.
    *   **Relational Matrices Grid**: Used for entering values into the generated matrices.

### 2.4 Hierarchical Tree Editing
*   **Tree Structure**: Renders a nested hierarchy representing `Stakeholders ➔ Segments ➔ Profiles ➔ Persona`.
*   **Tree Operations**:
    *   Add root-level Stakeholder.
    *   Add Segment to selected Stakeholder.
    *   Add Profile to selected Segment.
    *   Add Persona to selected Profile.
    *   Delete the selected node (and recursively all its children).
*   **Node Information Editing**:
    *   Edit name and description on selecting a node.
    *   Changes immediately mark the workspace as unsaved.
*   **Metrics and Markers**:
    *   Define scoring on a 1-3 scale for markers (e.g., weight `*`, certainty `?`, priority `!`, rating `+`).
    *   Visual representation: repeat the marker's symbol corresponding to its score (e.g., `***` for score 3, `!` for score 1).
    *   Reset button resets the marker value to 0.
    *   Render summary emojis next to Profile nodes in the hierarchy tree list.

### 2.5 Relational Matrix Configuration and Grid Editing
*   **Metamatrix Config Table**:
    *   Rows can be added or deleted.
    *   Fields include Matrix Name, Source Concept (rows), Target Concept (columns), Widget Type (`boolean`, `cycle`, `scale`, `set`), and Widget Parameters.
*   **Generated Matrix Grid**:
    *   Dynamically lists all configured matrices in a dropdown.
    *   Rows are dynamically populated using the flattened hierarchy nodes of the source concept.
    *   Columns are resolved based on the target concept (matching hardcoded options for Channels, Emotions, or default Val Propositions).
    *   Render input cells according to the defined widget type:
        *   `boolean`: Checkbox.
        *   `cycle`: Cycle button toggling through a list of values (e.g. Neutral ➔ Low ➔ High) defined in the parameters.
        *   `scale`: Select list from 0 to 5.
        *   `set`: Text dropdown filled with parameters option strings.
*   **Markdown Preview**: Displays the exact markdown table output preview for the active grid.

---

## 3. Markdown Parser and Serializer Specifications

The parser utility (`src/utils/markdownParser.ts`) must support bidirectional parity mapping.

### 3.1 Serialization Format
*   **Frontmatter**: Must preserve metadata keys (`metamodel`, `title`, `last_saved`) enclosed in standard `---` block wrappers.
*   **Text Concept Headers**: Each text concept section is output as `# Concept Name` followed by its body text.
*   **Hierarchy Matrices**: 
    *   Reconstructs the hierarchical tree into three separate relation tables:
        1.  `# Stakeholders-Segments Hierarchy Matrix`
        2.  `# Segments-Profiles Hierarchy Matrix`
        3.  `# Profiles-Persona Hierarchy Matrix`
    *   Cell value is `X` if a parent-child relationship exists, and `-` otherwise.
*   **Item-Markers Matrix**:
    *   `# Item-Markers Matrix`
    *   Columns map to configured markers (e.g., weight, certainty, priority, rating).
    *   Rows map to all flattened hierarchy nodes. Cell value is the integer score (1-3) or `-` if none.
*   **Metamatrix Definitions**:
    *   `# Metamatrix`
    *   Table listing Matrix Name, Source, Target, Widget Type, Widget Parameters.
*   **Dynamic Relation Matrices**:
    *   `# [Matrix Name]`
    *   A markdown table for each configured relationship matrix mapping the source nodes to the target choices.

### 3.2 Parser Behavior
*   The parser must successfully decompose the generated markdown back into Vue/Pinia reactive states:
    *   Extract frontmatter and relative metamodel path.
    *   Identify headers starting with `# `.
    *   Rebuild `modelTree` by reading parent-child coordinates marked with `X` in the hierarchy matrices.
    *   Load scores from the `Item-Markers Matrix` back into the node markers state.
    *   Load definitions into `metamatrix` state.
    *   Load all cell values from relationship matrices back into the `matrixValues` state.

---

## 4. Parity Test Scenarios

### Scenario 1: Markdown Parity Cycle
*   **Preconditions**: A complete, complex model markdown file exists in the directory.
*   **Action**: Open the file in the editor, make no modifications, and click "Save".
*   **Expectation**: The resulting saved markdown content must be identical to the input file, generating a net-zero git diff (excluding the updated `last_saved` timestamp in the frontmatter).

### Scenario 2: Dynamic Metamodel Load
*   **Preconditions**: A project folder containing custom categories in `innV0_master_data.json` is selected.
*   **Action**: Connect the folder and check the sidebar categories and guidance panel.
*   **Expectation**: The app renders custom categories, emojis, and descriptions according to the local JSON file.

### Scenario 3: Tree Node Editing and Cascading Persistence
*   **Preconditions**: Hierarchical tree has existing nodes.
*   **Action**: Add a new Profile "VIP Customer", set weight marker to 3 (`***`), delete an old stakeholder, and save the document.
*   **Expectation**: 
    *   The visual hierarchy reflects the new Profile.
    *   The `Profiles` text list generates the correct bullet points.
    *   The hierarchy matrices tables write `X` for the new profile association.
    *   The `Item-Markers Matrix` table includes the row `**VIP Customer** | 3 | - | - | -`.
    *   The deleted stakeholder and all its nested subnodes are removed from all serialized tables.

### Scenario 4: Relational Matrix Input Interaction
*   **Preconditions**: Metamatrix has a cycle matrix configured.
*   **Action**: Go to the Relational Matrices tab, select the cycle matrix grid, and click a cell button three times.
*   **Expectation**: The cell value cycles through the parameter states, updates the preview markdown table block in real-time, marks the project state as unsaved, and serializes the selected cycle text state to the file on save.
