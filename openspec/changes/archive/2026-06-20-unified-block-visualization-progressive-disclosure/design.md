# Implementation Plan - Unified Block Visualization Panel (Progressive Disclosure)

Refactor the central panel UI in `FORMAT` to unify the visual representation of all concepts and elements. This implementation establishes a consistent design language where everything is treated as a **BLOCK** (either a concept category or an element instance). It adopts a clean Material-style progressive disclosure pattern: displaying elements in read-only visualization mode with a giant pill and metadata breadcrumbs, and providing an explicit "Edit" button to toggle editing controls.

---

## Proposed Changes

### 1. New Component: `BlockViewer.vue`

Create a reusable component to handle the unified block visualization:
- **Header**: Renders a giant pill grouping type (emoji + name) and the element name with a single border.
- **Fields Breadcrumbs**: Renders a horizontal meta-field row displaying values for fields configured in the Template frontmatter.
- **Content Area**: Renders the element description in read-only format (using standard markdown/text).
- **Edit Trigger**: Renders an "Edit" button. Toggling edit mode swaps the description display with a text editor/textarea.

#### [NEW] [BlockViewer.vue](file:///d:/Users/lucas/Documents/GitHub/innV0/FORMAT/src/components/editor/BlockViewer.vue)
- Create the component at `src/components/editor/BlockViewer.vue`.

---

### 2. Modify: `TreeEditor.vue` (Hierarchical Concepts View)

Update `TreeEditor.vue` to adopt the split-panel layout:
- **Left Panel (Tree Navigator)**: Takes 35% width, displays the local hierarchy tree, and includes a collapse/expand toggle button.
- **Right Panel (Details View)**: Takes 65% width (expands to 100% when Left Panel is collapsed), rendering the `BlockViewer` component for the selected node.

#### [MODIFY] [TreeEditor.vue](file:///d:/Users/lucas/Documents/GitHub/innV0/FORMAT/src/components/editor/TreeEditor.vue)
- Refactor columns to support logical dimensions (35% tree, 65% content).
- Replace the custom detail form with the new `BlockViewer.vue` component.
- Implement the collapse/expand trigger for the tree panel.

---

### 3. Modify: `TextEditor.vue` (Flat Concepts & Lists View)

Update `TextEditor.vue` to render flat list concepts (like `problems` or `business summary`) using the unified block layout:
- If the concept has `type: 'text'` (single instance), render a single `BlockViewer` spanning the entire width.
- If the concept has list type (like `weight`), render a vertical stack of `BlockViewer` elements (one for each item in the list), each having its own giant pill and inline edit toggle.

#### [MODIFY] [TextEditor.vue](file:///d:/Users/lucas/Documents/GitHub/innV0/FORMAT/src/components/editor/TextEditor.vue)
- Load concept instances dynamically.
- Render either a single `BlockViewer` or a list of `BlockViewer` components based on cardinality.

---

### 4. Modify: `App.vue` (Shell & Routing)

Update `App.vue` to default to an empty placeholder state upon startup, rendering the central workspace panel only when a block is explicitly selected in the left sidebar navigation.

#### [MODIFY] [App.vue](file:///d:/Users/lucas/Documents/GitHub/innV0/FORMAT/src/App.vue)
- Bind active selections to clear empty states.
- Clean up duplicate layouts.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify there are no typescript compilation or packaging errors.

### Manual Verification
1. Load `Samples/comprehensive_demo.md` in the workspace.
2. Verify that on startup, only the left sidebar navigation is visible.
3. Select `single text block`: verify it shows a single giant pill and a content block with an Edit button.
4. Select `flat list items`: verify it shows a list of elements, each formatted as a block with its own pill and description.
5. Select `multilevel parent tree`: verify the center workspace splits into a tree navigator on the left (collapsible) and a visualization panel on the right.
6. Verify that clicking "Edit" toggles form controls and textareas, and saving works correctly.
