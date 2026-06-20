# Specification: Relational Matrix View

This document specifies the behavior of the upgraded `matrix-view` component, introducing a hierarchical interactive matrix grid with toolbar controls, custom widgets, a details preview panel, and simulated AI-staged suggestions.

## 1. Capabilities

### Modified: `matrix-view`
Upgrades the basic matrix view to a hierarchical, interactive grid with toolbar options, preview panel, and AI-staged suggestions.

## 2. Requirements

### 2.1 Toolbar Controls
* **REQ-1**: The toolbar MUST contain a matrix definitions selector dropdown to switch between available matrices.
* **REQ-2**: The toolbar MUST include a trigger button to run the AI simulation.
* **REQ-3**: The toolbar MUST feature parameter overrides (e.g., simulation threshold sliders).

### 2.2 Hierarchical Grid & Interactive Widgets
* **REQ-4**: Grid headers MUST display hierarchical relationships for rows and columns (e.g., Stakeholder -> Segment -> Profile -> Persona).
* **REQ-5**: Intersection cells MUST render interactive widgets based on the definition's widget type:
  * **boolean**: MUST display a switch or checkbox that toggles relationship existence.
  * **cycle**: MUST cycle sequentially through a defined array of states and colors on click.
  * **scale**: MUST render a slider/input to adjust numeric values within a configured min/max range.
  * **set**: MUST render a multiselect or dropdown to manage connection tags.

### 2.3 Contextual Preview Panel
* **REQ-6**: Clicking any cell MUST display its contextual source-to-target intersection details inside the `MatrixPreviewPanel`.

### 2.4 Staged AI Suggestions
* **REQ-7**: AI suggestions MUST display in cells with a distinct dashed border and a staged visual status.
* **REQ-8**: Staged suggestions MUST expose Accept and Reject actions.
* **REQ-9**: Accepting a suggestion MUST apply the suggested value to the cell and remove the staged state.
* **REQ-10**: Rejecting a suggestion MUST discard the recommendation and preserve the pre-existing state.

---

## 3. Scenarios

### Scenario 1: Displaying intersection details
* **Given** a user is viewing the Relational Matrix View
* **When** the user clicks an intersection cell between source "Customer Support" and target "AI Chatbot"
* **Then** the `MatrixPreviewPanel` MUST update to show information for both nodes and their current relationship value.

### Scenario 2: Changing widget state via click cycles
* **Given** a cell configured with a `cycle` widget type currently in state "Pending"
* **When** the user clicks the cell
* **Then** the cell's state MUST transition to "In Progress" and update the background color accordingly.

### Scenario 3: Resolving AI simulation suggestion
* **Given** the AI simulation has completed and a cell contains a staged recommendation value
* **When** the user clicks the "Accept" button on the staged cell
* **Then** the relationship value MUST commit to the model
* **And** the dashed border MUST disappear.
