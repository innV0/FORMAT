# Tasks: Lens System — Phase 1

## Types
- [x] Add `LensEdge` and `Lens` interfaces to `src/types/index.ts` (+ `LensNeighborhood`).

## Metamodel store
- [x] Add `lenses` computed (Taxonomy + Hierarchy Chain) to `src/stores/metamodel.ts`.
- [x] Add `getConceptLenses(name)` returning per-lens local neighborhoods.
- [x] Export `lenses` and `getConceptLenses`.

## Components
- [x] Create `src/components/editor/ConceptLensPanel.vue` rendering stacked neighborhood strips.
- [x] `LeftSidebar.vue`: replace nested concept tree with a flat list.
- [x] `LeftSidebar.vue`: add `list`/`lens` view state + transform + back.
- [x] `LeftSidebar.vue`: remove the auto-switch-to-Hierarchy watch.

## Verify
- [x] `npm run build` / typecheck passes.
- [x] Existing parser tests still green (9 passing).
- [x] Browser-verified: flat list renders; selecting a concept transforms the sidebar into
      stacked lens neighborhoods (`Problems` → Taxonomy `Segments → Problems`; `Segments` →
      Taxonomy + Hierarchy Chain both shown). Chip navigation works.
