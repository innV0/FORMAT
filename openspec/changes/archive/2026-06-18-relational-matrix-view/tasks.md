# Implementation Tasks: Relational Matrix View

Implementation plan for upgrading the interactive matrix view in `mockups/index.html`.

## Phase 1: State Initialization & Setup
- [x] Define reactive state variables: `activeGeneratedMatrix`, `simThreshold`, `isSimulating`, `stagedSuggestions`, and `selectedCell`.
- [x] Implement utility methods: hierarchy breadcrumb resolver for rows/columns (`Profiles`, `Segments`, `Channels`, etc.).

## Phase 2: Refactoring Grid Layout & Toolbar
- [x] Update `matrix-view` container to a three-part layout: Toolbar (Top), Interactive Grid (Left/Center), Contextual Preview Panel (Right Sidebar).
- [x] Implement toolbar controls: Matrix Selector dropdown, threshold range slider, and "Run Simulation" trigger button.

## Phase 3: Interactive Cell Widgets
- [x] Implement `boolean` widget: checkbox/switch toggling state in `matrixValues`.
- [x] Implement `cycle` widget: button cycling state list on click, applying color classes.
- [x] Implement `scale` widget: numeric input or range selector bound to min/max configuration.
- [x] Implement `set` widget: dropdown menu selection for managing tags.

## Phase 4: Contextual Preview Panel
- [x] Integrate `MatrixPreviewPanel` in the right sidebar.
- [x] Add click handler on cells to populate `selectedCell` and display detailed metadata.
- [x] Implement staged AI suggestion actions (Accept/Reject) within the panel.

## Phase 5: Simulated AI Engine
- [x] Write `runAiSimulation()` mock function with `setTimeout` delay (800ms) and `isSimulating` loading status.
- [x] Randomly inject staged suggestions into `stagedSuggestions` filtering by the threshold slider value.
- [x] Apply dashed border styling and inline Accept/Reject buttons to cells with staged suggestions.

## Phase 6: Verification
- [x] Verify Scenario 1: Clicking cell updates preview panel with source/target metadata.
- [x] Verify Scenario 2: Cycle widgets correctly transition states and colors.
- [x] Verify Scenario 3: AI recommendations commit correctly or discard, removing borders.

---

```text
Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low
```
