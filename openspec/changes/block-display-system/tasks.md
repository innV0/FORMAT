# Implementation Tasks: Block Display System

Implementation plan for consolidating every block rendering into the `BlockPill` / `BlockCard` / `BlockSheet` family, driven by `useBlockVisuals`.

---

## Phase A — Extract `useBlockVisuals` + slim `BlockPill` (no behavior change)

Sequential. All tasks in this phase must be done in order before Phase B starts.

- [x] **A1** — `src/composables/useBlockVisuals.ts` (NEW): extract `resolvedColor`, `resolvedEmoji`, `resolvedType`, `typeIcon`, `palette`, `iconToShow`, `containerClasses` verbatim from `BlockPill`'s current inline computeds; expose the `BlockVisualsOptions` interface. _Acceptance: unit-import the composable and verify it returns the same values as BlockPill's current computeds for both `kind="concept"` and `kind="instance"` samples._
- [x] **A2** — `src/components/BlockPill.vue`: replace inline visual computeds with a single `useBlockVisuals(...)` call; remove props `size`, `simplified`, `blockId`, `showMarkers`, `showAddChild`, `showEdit`, `showDelete`, `showReorder`, `isEditing`, `isFirst`, `isLast`; remove emits `add-child`, `edit-toggle`, `delete`, `move-up`, `move-down`; remove the hover "Opciones Expandidas" row, marker rendering, and `cycleMarker` logic; retain `selected`, `interactive`, `fullWidth`, `as`. _Acceptance: concepts sidebar renders identically; no TypeScript errors; removed props are absent from the component's type._
- [x] **A3** — `src/components/ConceptTreeNode.vue`: drop the `size` ternary (`activeName === node.name ? 'md' : 'sm'`); keep all other props. _Acceptance: sidebar still highlights the active concept; no `size` prop passed anywhere._
- [x] **A4** — `src/components/MatricesGrid.vue`: replace `size="xs"` usages with `kind="concept"` on axis source/target headers and `kind="instance"` on row/col item headers; remove dead computeds `sourceConceptEmoji`, `targetConceptEmoji`, `sourceColorClasses`, `targetColorClasses`; remove the now-unused `getColorClasses` import. _Acceptance: matrix headers render with correct concept/instance styling; TypeScript reports zero dead-variable warnings for the removed computeds; no `size` prop in file._

**Verify Phase A**: concepts sidebar unchanged, matrix headers unchanged, no size prop anywhere in the codebase.

---

## Phase B — Create `BlockCard` + migrate `TreeNodeItem`

Sequential after Phase A. B1 before B2.

- [x] **B1** — `src/components/BlockCard.vue` (NEW): compose `<BlockPill>` for identity + marker row (reuse `getMarkerIcon`/`getMarkerClasses`/`MarkerTooltip` + `cycleMarker` from `documentStore`) + hover quick-action toolbar (reorder up/down, add-child); props: `blockId`, `name`, `kind`, `conceptType`, `selected`, `interactive`, `showMarkers`, `showReorder` (default `false`), `showAddChild`, `isFirst`, `isLast`; emits: `click`, `add-child`, `move-up`, `move-down`; `aria-label` on every icon-only button; hover reveal animated (`150ms`). _Acceptance: a standalone smoke render shows markers and hover toolbar; `aria-label` present on reorder + add-child buttons._
- [x] **B2** — `src/components/TreeNodeItem.vue`: swap the current `<BlockPill show-markers show-add-child …>` for `<BlockCard :blockId="node.id" :conceptType="currentConcept" :showMarkers="conceptType==='weight'" :showAddChild="!!nextConcept" … @click="selectTreeNode" @add-child="addChildTreeNode">`; `showReorder` stays `false` (hierarchy tree has no reorder today). _Acceptance: hierarchy tree shows markers and add-child; reorder buttons absent; existing `TreeNodeItem` behavior unchanged._

**Verify Phase B**: hierarchy tree markers and add-child still work; `BlockPill` no longer carries marker or toolbar markup.

---

## Phase C — Create `BlockSheet` + replace `BlockViewer` usages

Sequential after Phase B. C1 before C2.

- [x] **C1** — `src/components/BlockSheet.vue` (NEW): controlled `collapsed` + `isEditing` props (NOT local refs); collapsed state = header `<BlockPill>` + name + fields list; expanded = + body via `renderInlineMarkdown(block.description)`; edit state = name input + per-field inputs + description textarea (ported from `BlockViewer`); explicit pencil button triggers `emit('edit-toggle')`, chevron triggers `emit('update:collapsed', !collapsed)`; reorder/delete controls in header; expand/collapse animated (`≤300ms`); pencil `aria-label="Edit"`; all props/emits as defined in design §5. _Acceptance: standalone smoke render cycles through collapsed/expanded/edit without entering edit on expand; TypeScript compiles; `isEditing` and `collapsed` are props, not refs._
- [x] **C2** — Replace all `BlockViewer.vue` usages with `<BlockSheet>`: audit every import/usage of `BlockViewer`; for each, wire `collapsed` and `isEditing` from local caller state; verify call sites compile. _Note: full deletion of `BlockViewer.vue` is deferred to Phase E after `TextEditor` migrates in Phase D._ _Acceptance: no remaining `<BlockViewer>` tags outside of `TextEditor.vue`; existing surfaces that showed `BlockViewer` now show `BlockSheet` with equivalent content._

**Verify Phase C**: central panel read/edit flow works; expanding does NOT enter edit state; pencil is the sole edit entry point.

---

## Phase D — Create `BlockFeed` + refactor `TextEditor`

Sequential after Phase C. D1 before D2.

- [x] **D1** — `src/components/BlockFeed.vue` (NEW): local `editingId = ref<string|null>(null)` and `collapsed = reactive<Record<string, boolean>>({})`; renders pinned concept `<BlockSheet kind="concept" :showReorder="false">` on top; renders indented instance `<BlockSheet kind="instance" :showReorder="true">` list below; derives each Sheet's `:isEditing="editingId === key"` and `:collapsed="collapsed[key] ?? true"`; on `edit-toggle`: `editingId = (editingId === key ? null : key)` (single-active-editor enforced structurally); on `update:collapsed`: set `collapsed[key]`; bubbles `change-concept`, `change-item`, `add-item`, `delete-item`, `move-item-up`, `move-item-down` up to `TextEditor`; props/emits as defined in design §6; selecting a different concept causes feed remount which resets `editingId` (acceptable — matches existing `BlockViewer` remount behavior). _Acceptance: switching active editor closes the previous one; collapse/expand does not affect `editingId`; non-list concept shows only the pinned Sheet._
- [x] **D2** — `src/components/TextEditor.vue`: replace both `BlockViewer` branches (single-block + list) with a single `<BlockFeed>`; pass `conceptBlock=textBlock`, `items=parsedItems`, `isListConcept`, and all concept meta props; wire feed emits to existing `updateSingleBlockText`, `syncToMarkdown`, `addListItem`, `deleteListItem`, `moveItemUp`, `moveItemDown`; remove `BlockViewer` import; retain ALL data/parse/ID/move logic in `TextEditor` — nothing moves to the feed. _Acceptance: central panel renders concept + instances; reorder works; single-active-editor invariant holds; no `BlockViewer` import remains._

**Verify Phase D**: pinned concept Sheet at top, instance Sheets indented and reorderable; exactly one Sheet in edit at a time; markdown serialization byte-identical for a round-trip file open → no-edit → save.

---

## Phase E — Cleanup + final typecheck

Can be done task-by-task in any order once Phase D is complete.

- [x] **E1** — `src/components/MatricesGrid.vue`: confirm `kind="concept"` / `kind="instance"` are set correctly for all pill usages (axis source/target = concept, row/col items = instance); no `size` prop; dead computeds already removed in A4 — this is a final audit pass. _Acceptance: grep for `size=` on block components returns zero matches in `MatricesGrid.vue`._
- [x] **E2** — `src/components/BlockPill.vue`: remove the `simplified` prop entirely (matrices no longer need the muted look; it was never used by the matrix call sites once `kind` drives styling). _Acceptance: TypeScript emits a type error if any call site passes `simplified`; grep returns zero `simplified` usages._
- [x] **E3** — Delete `src/components/BlockViewer.vue` once `TextEditor.vue` (D2) no longer imports it. _Acceptance: file absent from repository; no import of `BlockViewer` exists anywhere._
- [x] **E4** — Global size-prop audit: search codebase for `size="sm"`, `size="md"`, `size="lg"`, `size="xs"` on block components; fix any stragglers. _Acceptance: zero matches._
- [x] **E5** — Final typecheck + linting pass: `tsc --noEmit` and linter pass with zero new errors; fix any type errors introduced by the removed props/emits across all phases. _Acceptance: clean build._
- [x] **E6** — Preview pass: open the app, navigate sidebar concepts, open hierarchy tree, open and edit a central panel block; verify no visual regressions on concepts sidebar, matrix headers, hierarchy tree markers/add-child, and central panel feed. _Acceptance: no visual regressions observed; single-active-editor invariant confirmed by manual test._

---

## Review Workload Forecast

```text
Estimated new files:       4  (useBlockVisuals.ts, BlockCard.vue, BlockSheet.vue, BlockFeed.vue)
Estimated modified files:  5  (BlockPill.vue, ConceptTreeNode.vue, MatricesGrid.vue, TreeNodeItem.vue, TextEditor.vue)
Estimated deleted files:   1  (BlockViewer.vue)

Estimated changed lines:   ~600–900
  Phase A: ~120 lines changed (composable extraction + BlockPill slim + 2 call-site updates)
  Phase B: ~150 lines added/changed (BlockCard new + TreeNodeItem swap)
  Phase C: ~200 lines added/changed (BlockSheet new + BlockViewer swap)
  Phase D: ~200 lines added/changed (BlockFeed new + TextEditor refactor)
  Phase E: ~50 lines removed (cleanup + deleted file)

Decision needed before apply: Yes — exceeds 400-line budget
Chained PRs recommended:    Yes (5 phases, each independently shippable and verifiable)
Chain strategy:             pending (orchestrator to decide: stacked-to-main or feature-branch-chain)
400-line budget risk:       High
```

> **Orchestrator note**: This change MUST be delivered as chained PRs (one per phase, A → B → C → D → E). Each phase is independently shippable and verifiable on its own surface. Do not apply all phases in a single PR.
