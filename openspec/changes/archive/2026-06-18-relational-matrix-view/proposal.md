# Proposal: Implement Relational Matrix View

## Intent
Replace the basic mockup `matrix-view` tab with a premium, fully-functional Relational Matrix View to support advanced modeling of relationships, AI simulation, and contextual metadata.

## Scope

### In Scope
- Toolbar with matrix definitions selector, AI simulation triggers, and parameter overrides.
- Hierarchical grid headers (rows/cols) with custom widgets (boolean, cycle, scale, set).
- `MatrixPreviewPanel` displaying contextual info for selected intersections.
- Staged AI suggestions with visual status indicators and action buttons (Accept/Reject).

### Out of Scope
- Backend API implementation (mocked purely in-memory/Vue state).
- Multi-user collaboration features.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `matrix-view`: Upgrades the basic matrix view to a hierarchical, interactive grid with toolbar options, preview panel, and AI-staged suggestions.

## Approach
Implement inline Vue 3 logic and Tailwind CSS UI in `mockups/index.html` (Approach 1 from exploration) to keep the mockup standalone. Add reactive state variables for simulated AI recommendations, widgets data model, and selected intersection highlights.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `mockups/index.html` | Modified | Refactor Vue template/script to add toolbar, hierarchical grid, preview panel, and AI widgets. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Tailwind class bloat | Medium | Use clean, reuse-oriented utility styling. |
| Complex state management | Medium | Structure state using clear Vue reactive objects for matrix configuration and values. |

## Rollback Plan
Discard working directory changes in Git via `git checkout -- mockups/index.html`.

## Dependencies
- Vue 3 (loaded via CDN)
- Tailwind CSS (loaded via CDN)

## Success Criteria
- [ ] Users can switch matrix definitions via the toolbar selector.
- [ ] Cells display correctly based on configured widget type (boolean/cycle/scale/set).
- [ ] Selecting a cell displays relevant details in `MatrixPreviewPanel`.
- [ ] AI simulation highlights suggestion cells (dashed borders) and permits Accept/Reject options.

## Proposal question round
### Assumptions & Clarifications
1. **AI Mocking**: AI simulation is simulated locally in Vue state with predefined static recommendations; no actual AI API call is required.
2. **Persistence**: State changes are saved in-memory and reflected in the Markdown Storage Preview block.
3. **Hierarchy**: Rows/cols hierarchy reflects the Stakeholder -> Segment -> Profile -> Persona tree.
