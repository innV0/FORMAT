# Proposal: Rename Lenses → Perspectives

## Intent

Rename the "lenses" abstraction to "perspectives" across the codebase. The term "perspectives" is semantically more accurate — these are *ways of viewing* concepts, not optical instruments. This is a pure rename with no behavioral changes.

## Scope

### In Scope
- Rename TypeScript interfaces: `LensEdge` → `PerspectiveEdge`, `Lens` → `Perspective`, `LensNeighborhood` → `PerspectiveNeighborhood`
- Rename store computed/ref: `lenses` → `perspectives`, `getConceptLenses` → `getConceptPerspectives`
- Rename component: `ConceptLensPanel.vue` → `ConceptPerspectivePanel.vue`
- Rename CSS classes: `.lens-*` → `.perspective-*`
- Rename function: `closeLens` → `closePerspective`
- Rename state value: `conceptView: 'lens'` → `conceptView: 'perspective'`
- Update all template refs, comments, and imports

### Out of Scope
- Behavioral changes to the perspective system
- Adding new perspectives beyond Taxonomy and Chain
- Element-level perspectives (future work)
- Spec version bump

## Capabilities

### New Capabilities
None — this is a rename.

### Modified Capabilities
None — behavior is unchanged.

## Approach

Mechanical find-and-replace across 7 source files. No logic changes. Verify with typecheck and build.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/types/index.ts` | Modified | Interface renames + comments |
| `src/stores/metamodel.ts` | Modified | Import, refs, computed, function, exports |
| `src/utils/markdownParser.ts` | Modified | Import, type annotations |
| `src/components/editor/ConceptLensPanel.vue` | Renamed+Modified | File rename + CSS + template |
| `src/components/editor/ConceptRelationshipGraph.vue` | Modified | Template refs + text |
| `src/components/layout/LeftSidebar.vue` | Modified | Import, state, function |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| TypeScript errors from missed rename | Low | Typecheck will catch |
| CSS class mismatch | Low | Visual inspection |

## Rollback Plan

`git checkout --` all changed files. Pure rename, no data changes.

## Success Criteria

- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] No references to `lens` remain in src/ (except comments explaining the rename history)
