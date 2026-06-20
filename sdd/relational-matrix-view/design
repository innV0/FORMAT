# Technical Design: Relational Matrix View

This document describes the design and implementation details for upgrading the mockup `matrix-view` tab in `mockups/index.html`.

## 1. State Architecture & Data Models

To support interactive matrix manipulation, hierarchical headers, and AI simulation, the reactive state in Vue 3 will be structured as follows:

```javascript
// Currently active matrix definition (selected from toolbar)
const activeGeneratedMatrix = ref(metamatrixRows.value[0]);

// Parameter overrides for the AI Simulation
const simThreshold = ref(60); // Percentage threshold for simulation filter
const isSimulating = ref(false); // Indicates active simulation simulation runs

// Dictionary tracking staged AI suggestions: key = "MatrixName||RowName||ColName"
const stagedSuggestions = ref({
  // Example: "Profiles-Channels Matrix||Tech-savvy SME Owner||Canal Web Directo": { value: "Critical", confidence: 75 }
});

// Currently selected cell for the Contextual Preview Panel
const selectedCell = ref({
  matrixName: "",
  row: "",
  col: "",
  sourceNode: null, // Resolves to { name, type, description, weight, etc. }
  targetNode: null  // Resolves to { name, type, description }
});
```

---

## 2. UI Layout & Component Design

The `matrix-view` panel will be refactored into a three-part layout:
1. **Toolbar Controls** (Top)
2. **Interactive Hierarchical Grid** (Left/Center)
3. **Contextual Preview Panel** (Right Sidebar overlay)

```
+-------------------------------------------------------------------------+
| Toolbar: [Matrix Selector v]  [Threshold Slider: 60%]  [Run Simulation] |
+------------------------------------+------------------------------------+
|                                    | Contextual Preview Panel           |
| Hierarchical Matrix Grid           |                                    |
| (Row headers with breadcrumbs)     | Selected: Row -> Col               |
|                                    |                                    |
| Cells with custom widgets          | Source Node Details                |
| (Dashed borders for staged AI)     | Target Node Details                |
|                                    | Value / AI Action (Accept/Reject)  |
+------------------------------------+------------------------------------+
```

### 2.1 Toolbar Controls (REQ-1, REQ-2, REQ-3)
- **Matrix Selector**: HTML select dropdown bound to `activeGeneratedMatrix`.
- **Threshold Slider**: Range slider input bound to `simThreshold` (0 to 100).
- **Run Simulation Button**: Triggers `runAiSimulation()` mock function with a brief loading state (`isSimulating`).

### 2.2 Hierarchical Grid (REQ-4, REQ-5)
- **Hierarchical Headers**: Row and Column headers will display the breadcrumb trail (e.g., `Stakeholders > Segments > Profiles` or `Channels > Sales Channels`). Row/column lookup functions will resolve full parent hierarchies dynamically using the recursive tree structures.
- **Custom Interactive Cell Widgets**:
  - `boolean`: Toggles key in `matrixValues` on checkbox change.
  - `cycle`: Cycles state array `params.split(';')` using `rotateCycle()`.
  - `scale`: Horizontal range slider or dropdown input constrained by `min`/`max` parameters.
  - `set`: Dropdown selector populated by parameter list `params.split(';')`.

### 2.3 Contextual Preview Panel (REQ-6)
- Placed in the right sidebar when `activeTab === 'matrix-view'`.
- Displays detailed metadata of the selected cell's source node (Stakeholder/Segment/Profile) and target node.
- Renders Accept/Reject buttons if the cell has an active staged AI suggestion.

### 2.4 Staged AI Suggestions (REQ-7, REQ-8, REQ-9, REQ-10)
- Staged cells will receive a `border-dashed border-2 border-indigo-400 bg-indigo-50/30` styling to denote pending states.
- The UI exposes inline Accept/Reject buttons on cell hover, as well as inside the preview panel.
- **Accept Action**: Sets `matrixValues[key] = suggestion.value` and deletes the suggestion entry from `stagedSuggestions`.
- **Reject Action**: Preserves the original `matrixValues[key]` and deletes the entry from `stagedSuggestions`.

---

## 3. Simulated AI Algorithm

The toolbar trigger button fires `runAiSimulation()` which performs:
1. `isSimulating.value = true`
2. Simulates network latency (e.g. 800ms `setTimeout`).
3. Randomly selects a few cells across definitions.
4. If the mock recommendation confidence exceeds `simThreshold.value`, it inserts a suggestion into `stagedSuggestions`.
5. Sets `isSimulating.value = false`.
