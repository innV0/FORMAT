# Archive Report: block-display-system

**Date**: 2026-06-21  
**Status**: ARCHIVED  
**Verdict**: Complete — All 15 tasks implemented, verified, and shipped.

---

## What Shipped

The **Block Display System** consolidates every block rendering in the UI into a single, principled component family driven by two orthogonal axes: **display** (level of engagement: Pill / Card / Sheet) and **kind** (block identity: concept / instance). This replaces the legacy size-based approach (`xs`/`sm`/`md`/`lg`) and the ad hoc markup previously spread across `BlockPill`, `BlockViewer`, and the tree/sidebar/matrix call sites.

### Components Delivered

1. **`useBlockVisuals` composable** (NEW) — Centralizes emoji / type-icon / outline-vs-solid / color resolution. All three displays now share this single resolution path.
   - File: `src/composables/useBlockVisuals.ts`
   - Exports: `BlockVisualsOptions`, `BlockVisuals` interfaces; `useBlockVisuals(opts)` function

2. **`BlockPill.vue`** (MODIFIED) — Slimmed to pure reference display: icon + name + selected/interactive states. Removed all size props, markers, toolbar, and action emits.
   - File: `src/components/editor/BlockPill.vue`
   - Uses: `useBlockVisuals` for all visual resolution

3. **`BlockCard.vue`** (NEW) — Browse/structure display. Composes `BlockPill` for identity + adds marker row and hover quick-action toolbar (reorder up/down, add-child).
   - File: `src/components/editor/BlockCard.vue`
   - Used by: `TreeNodeItem.vue` (hierarchy tree)
   - Features: aria-labels on all icon-only buttons, animated hover reveal

4. **`BlockSheet.vue`** (NEW) — Work display, replacing `BlockViewer`. Controlled `collapsed` and `isEditing` props (NOT local refs). Collapsed state = header + fields list; Expanded = + body. Explicit pencil button triggers edit (expanding ≠ editing).
   - File: `src/components/editor/BlockSheet.vue`
   - Composed by: `BlockFeed.vue`
   - Key invariant: Expanding does NOT enter edit state; pencil is the sole edit entry point.

5. **`BlockFeed.vue`** (NEW) — Central panel orchestrator. Renders pinned concept Sheet at TOP (not reorderable) + indented reorderable instance Sheets below. Owns the single-active-editor invariant via local `editingId` ref (not a global store).
   - File: `src/components/editor/BlockFeed.vue`
   - Used by: `TextEditor.vue`
   - Invariant: Exactly one Sheet edits at a time; switching concept remounts feed and resets editor (acceptable, matches prior `BlockViewer` behavior)

6. **`BlockViewer.vue`** (REMOVED) — Superseded by `BlockSheet` + `BlockFeed`.
   - Deletion: `src/components/editor/BlockViewer.vue`
   - Migration: All `BlockViewer` call sites replaced with `BlockSheet` (rendered by `BlockFeed`)

### Call-Sites Migrated

- **`ConceptTreeNode.vue`** — Removed `size` prop ternary; keeps `kind="concept"`, `conceptType`, all existing props.
- **`MatricesGrid.vue`** — Replaced `size="xs"` with `kind="concept"` (axis headers) and `kind="instance"` (row/col items). Removed dead computeds: `sourceConceptEmoji`, `targetConceptEmoji`, `sourceColorClasses`, `targetColorClasses`, stale `getColorClasses` import.
- **`TreeNodeItem.vue`** — Swapped inline `BlockPill` for `<BlockCard>` with full marker + add-child logic.
- **`TextEditor.vue`** — Replaced both `BlockViewer` branches (single-block + list) with a single `<BlockFeed>`. Retained all data logic (markdown parse/sync, stable IDs, move operations).

### Legacy Code Removed

- **Size axis** (`sm`/`md`/`lg`/`xs` props on block components): zero occurrences after cleanup.
- **`simplified` prop**: removed from `BlockPill`; zero usages.
- **Hand-rolled block markup**: all block rendering now flows through one of the three displays + `useBlockVisuals`.

---

## Verification Outcome

**Build & Test Evidence**:
- `npx vue-tsc --noEmit` — EXIT 0, zero type errors
- `npx vitest run` — EXIT 0, 8/8 tests pass (2 test files)

**Task Completeness**:
- All 15 implementation tasks across Phases A–E marked `[x]` in `tasks.md`
- No unchecked implementation tasks remain

**Spec Compliance**:
- 13/13 requirements PASS
- All display × kind combos render correctly
- Marker delegation to `getMarkerIcon`/`getMarkerClasses` works
- Single-active-editor invariant enforced structurally
- Expanding does NOT enter edit state; pencil is sole edit entry point

**Verification Report Summary**:
- **CRITICAL**: 0
- **WARNING**: 1 (W-01 — concept Sheet initially expanded, now fixed: concept sheets collapse by type and feed remounts per concept as intended)
- **SUGGESTION**: 3 (low-priority code hygiene)

**Verdict**: PASS WITH WARNINGS → PASS (W-01 resolved per orchestrator confirmation)

---

## Key Architectural Decisions

1. **Two orthogonal axes** — display (`Pill`/`Card`/`Sheet`) and kind (`concept`/`instance`) are independent, never a single size enum.
2. **Single resolution path** — `useBlockVisuals` is the ONLY place emoji, type-icon, outline, color, and palette are resolved. No duplicated logic.
3. **Composable, no template** — `useBlockVisuals` is a pure composable; the family (`BlockPill`/`BlockCard`/`BlockSheet`) shares visuals by importing it, not by composition.
4. **Controlled component model** — `BlockSheet` (and by extension `BlockFeed`) use controlled `collapsed` and `isEditing` props, not internal refs. Parent (`TextEditor` via `BlockFeed`) owns state.
5. **Single-active-editor scoped to feed** — `editingId` is a local ref in `BlockFeed`, not in a global store. Siblings communicate only through props/emits; edit state is feed-local.
6. **No behavior loss on migration** — `TextEditor` retains ALL data logic (markdown parse/sync, stable list IDs, move operations). `BlockFeed` is presentation-only.

---

## Commit Range

Branch: `feat/block-display-system`  
Commits: `fbc2437` → `73cb2b0` (5 phase commits, one per PR slice)

| Commit | Phase | Title |
|--------|-------|-------|
| (to be provided by orchestrator) | A | Extract useBlockVisuals + slim BlockPill |
| (to be provided by orchestrator) | B | Create BlockCard + migrate TreeNodeItem |
| (to be provided by orchestrator) | C | Create BlockSheet + replace BlockViewer usages |
| (to be provided by orchestrator) | D | Create BlockFeed + refactor TextEditor |
| (to be provided by orchestrator) | E | Cleanup + final typecheck |

> Full commit range will be verified by orchestrator from git history on merge.

---

## SDD Artifacts

| Artifact | Location | Status |
|----------|----------|--------|
| Proposal | `proposal.md` | ✅ Complete |
| Design | `design.md` | ✅ Complete |
| Tasks | `tasks.md` | ✅ Complete (15/15 tasks, all checked) |
| Verification Report | `verification-report.md` | ✅ Complete (PASS WITH WARNINGS → PASS) |
| Delta Spec | `specs/block-display-system/spec.md` | ✅ Complete |

---

## Artifacts Merged into Main Specs

After archiving, the following main specs were updated with delta spec content:

| Domain | Spec | Action | Summary |
|--------|------|--------|---------|
| `block-display-system` | `openspec/specs/block-display-system/spec.md` | Created (new domain) | Full requirements for display × kind family, visual resolution, and component APIs |

---

## Golden Rule: Enforced

After this archive:
- ✅ Every block in the UI renders through exactly ONE of `BlockPill` / `BlockCard` / `BlockSheet`
- ✅ All three displays resolve visuals through ONE composable (`useBlockVisuals`)
- ✅ No hand-rolled block markup exists outside the family
- ✅ Grep for `size="sm"`, `size="md"`, `size="lg"`, `size="xs"` on block components = 0 matches
- ✅ Grep for `size=` prop or `.simplified` usage in `BlockPill` = 0 matches
- ✅ Grep for `BlockViewer` imports = 0 matches (file deleted)

---

## Next Steps

1. Orchestrator merges all chained PRs (A → B → C → D → E) to `main`.
2. Remove this change folder from active workflow; archive is read-only audit trail.
3. Ready for next change (e.g., new feature on the consolidated display foundation).

---

## Files Archived

This folder (`openspec/changes/archive/2026-06-21-block-display-system/`) contains:
- `proposal.md` — original business case and scope
- `design.md` — technical architecture and migration plan
- `tasks.md` — all 15 implementation tasks (all completed)
- `verification-report.md` — test, build, and spec compliance evidence
- `specs/block-display-system/spec.md` — delta spec merged into main
- `archive-report.md` — this file

All artifacts are read-only and serve as the permanent record of the change's planning, implementation, and verification.

---

**Archive closed by**: sdd-archive executor (claude-haiku-4-5)  
**Archive timestamp**: 2026-06-21T00:00:00Z  
**SDD Cycle**: COMPLETE
