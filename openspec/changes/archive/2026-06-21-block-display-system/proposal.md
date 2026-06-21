# Proposal: Block Display System

## Intent
Consolidate every block rendering in the UI into a single, principled component family driven by two orthogonal axes — **display** (level of engagement) and **kind** (what the block IS) — replacing the legacy size-based (`sm`/`md`/`lg`) approach and the ad hoc markup currently spread across `BlockPill`, `BlockViewer`, and the tree/sidebar/matrix call sites.

A **Block** is the umbrella term for a *concept* (an instantiable definition / mold) or an *instance* (a concrete block created from a concept). The GOLDEN RULE this change enforces: every block in the UI is rendered through exactly ONE of three displays — **Pill**, **Card**, or **Sheet** — and never through hand-rolled markup outside that family.

This matters now because the foundations (phases 1-4) already shipped on this branch — a single-source color palette, concept visuals, shared markdown rendering, marker icons, and a `kind`-aware `BlockPill`. The conceptual model is settled; the remaining cost is a fragmented component surface where `BlockPill` does Pill AND Card AND `lg`, `BlockViewer` is an unnamed "Sheet precursor", and the central panel renders an implicit feed. Consolidating now locks the mental model before more views are built on the old size axis.

Success looks like: a developer adding any new block-displaying surface picks `display` + `kind`, drops in the matching component, and gets correct visuals, states, and interactions for free — with zero block markup written outside the family.

## Scope

### In Scope
- Define the two-axis model in code: **display** axis (`pill` | `card` | `sheet`) and the existing `kind` prop (`concept` | `instance`), valid in any combination.
- Extract a `useBlockVisuals` composable centralizing emoji / type-icon / outline-vs-solid / color resolution currently embedded inside `BlockPill`.
- `BlockPill` — slim reference display (icon + name + markers + hover toolbar). Used in concepts sidebar and matrix row/col/axis headers. Trim it down to pure Pill responsibility.
- `BlockCard` — browse/structure display (identity + status markers + hover quick-actions: reorder, add-child). Used in the hierarchy tree.
- `BlockSheet` — work display, replacing `BlockViewer`. Collapsed = header pill + name + fields list; Expanded = + full body/description; explicit edit via pencil button (expanding does NOT enter edit); only one Sheet edits at a time across the feed.
- `BlockFeed` — orchestrates the central panel as a feed of Sheets: concept Sheet pinned at TOP as context, its instance Sheets following slightly indented and reorderable (up/down arrows reusing existing `moveItemUp`/`moveItemDown`); concept is not reorderable.
- Repoint all call sites: `ConceptTreeNode` (Pill, kind=concept), `TreeNodeItem` (Card), `TextEditor` → `BlockFeed`, `MatricesGrid` headers (Pills with correct `kind`).
- Remove the size axis (`sm`/`md`/`lg`/`xs`) from block components and clean dead matrix computeds (`sourceConceptEmoji`, `targetConceptEmoji`, `sourceColorClasses`, `targetColorClasses`, stale `getColorClasses` import).
- "No derived summary": the first paragraph is normal body content; a summary, if wanted, is a regular field in the fields list.

### Out of Scope
- Any backend, persistence, or data-model change. This is UI consolidation only.
- Matrices as blocks — matrices stay a **relation view** (grid). The grid is the container; blocks inside it (headers) render as Pills. No `BlockMatrix` component.
- New markers, new concept types, or new field types.
- Drag-and-drop reordering (keep the existing up/down arrow logic).
- Multi-Sheet simultaneous editing or collaborative editing.

## Capabilities

### New Capabilities
- `block-display-system`: A two-axis (display × kind) block rendering family — `BlockPill`, `BlockCard`, `BlockSheet`, `BlockFeed` — plus a `useBlockVisuals` composable, as the single sanctioned way to render any block in the UI.

### Modified Capabilities
- `concept-tree` (sidebar): renders concepts as `BlockPill` (kind=concept) instead of legacy sized `BlockPill`.
- `hierarchy-tree`: `TreeNodeItem` renders `BlockCard` instead of `BlockPill`.
- `central-editor`: `TextEditor` delegates to `BlockFeed`; `BlockViewer` is replaced by `BlockSheet`.
- `matrix-view`: row/col/axis headers render `BlockPill` with correct `kind` (axis source/target = concept; row/col items = instance) and lose the legacy size prop and dead computeds.

## Approach
Build the new family on top of the shipped foundations, not beside them. `useBlockVisuals` is extracted first so all three displays share one resolution path for emoji vs type-icon, outline (concept) vs solid tinted (instance), and palette/marker classes from `colors.ts`, `conceptVisuals.ts`, and `MarkerIcons.ts`.

`BlockPill` is reduced to its pure reference role (the Card behavior it currently hosts moves to `BlockCard`; the `lg` behavior moves to `BlockSheet`). `BlockSheet` absorbs `BlockViewer`'s read/edit modes and adds the collapsed/expanded distinction with explicit pencil-triggered editing and a single-active-editor guard. `BlockFeed` owns the concept-pinned-top + indented-reorderable-instances layout, reusing `TextEditor`'s stable list-item IDs and `moveItemUp`/`moveItemDown`.

Call sites are migrated one at a time (sidebar → tree → central panel → matrix) so each surface can be visually verified before the next, and the size axis is removed only after the last consumer stops using it.

Rationale: this preserves the GOLDEN RULE (one of three displays, never hand-rolled markup), keeps `kind` as the stable prop name, and avoids touching persistence — the change is purely a presentation-layer consolidation. Per the `ui-ux-pro-max` conventions: consistent icon sizing/style tokens across the family, distinct hover/edit/disabled states, accessible labels on icon-only hover-toolbar buttons (reorder/edit/delete/add-child), focus-visible rings, and animated (not snapped) expand/collapse and reorder transitions.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/composables/useBlockVisuals.ts` | New | Centralizes emoji / type-icon / outline-vs-solid / color resolution. |
| `src/components/editor/BlockPill.vue` | Modified | Trimmed to pure Pill display; size axis removed; uses `useBlockVisuals`. |
| `src/components/editor/BlockCard.vue` | New | Browse/structure display with reorder + add-child quick-actions. |
| `src/components/editor/BlockSheet.vue` | New | Work display; replaces `BlockViewer`; collapsed/expanded + explicit edit. |
| `src/components/editor/BlockViewer.vue` | Removed | Superseded by `BlockSheet`. |
| `src/components/editor/BlockFeed.vue` | New | Central feed: pinned concept Sheet + indented reorderable instance Sheets. |
| `src/components/editor/TextEditor.vue` | Modified | Delegates feed rendering to `BlockFeed`; retains list IDs + move logic. |
| `src/components/editor/TreeNodeItem.vue` | Modified | Renders `BlockCard` instead of `BlockPill`. |
| `src/components/layout/ConceptTreeNode.vue` | Modified | Renders `BlockPill` (kind=concept) without size prop. |
| `src/components/editor/MatricesGrid.vue` | Modified | Headers as Pills with correct `kind`; remove dead computeds + stale import. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Regression in existing read/edit flows when `BlockViewer` → `BlockSheet`. | Medium | Migrate one call site at a time; verify each surface before removing the old path. |
| Single-active-editor guard introduces shared state coupling across the feed. | Medium | Scope edit-lock state to `BlockFeed`; pass down via props/emit, not a global. |
| Hidden coupling between `BlockPill`'s Pill/Card/lg modes breaks when split. | Medium | Extract `useBlockVisuals` first so all displays share one resolution path. |
| Reorder logic divergence between feed and tree. | Low | Reuse the existing `moveItemUp`/`moveItemDown` + stable list IDs; do not reimplement. |
| Tailwind/utility drift across three displays. | Low | Drive icon sizes, states, and colors from shared tokens/composable, not per-component literals. |

## Rollback Plan
All work is on this branch with the foundations already committed. Revert by discarding the working tree (`git checkout -- src/`) or reverting the change commits; no migrations or persisted data are touched, so rollback is purely code-level with no data implications.

## Dependencies
- Vue 3 + TypeScript + Vite + Tailwind (existing stack).
- Shipped foundations (phases 1-4): `src/utils/colors.ts`, `src/utils/conceptVisuals.ts` (`getConceptTypeIcon`, `BlockKind`), `src/utils/renderMarkdown.ts` (`renderInlineMarkdown`), `src/components/editor/MarkerIcons.ts` (`getMarkerIcon`, `getMarkerClasses`).
- Existing `BlockPill` `kind` prop and `TextEditor` list-item IDs + `moveItemUp`/`moveItemDown`.

## Success Criteria
- [ ] Every block in the UI renders through exactly one of `BlockPill` / `BlockCard` / `BlockSheet`; no hand-rolled block markup remains.
- [ ] `display` and `kind` are orthogonal: any display × any kind renders correctly (concept = dashed outline + type icon; instance = solid tinted fill + emoji).
- [ ] The legacy size axis (`sm`/`md`/`lg`/`xs`) is fully removed from block components.
- [ ] `useBlockVisuals` is the single resolution path for emoji / type-icon / outline-vs-solid / color across all three displays.
- [ ] Central panel renders as a `BlockFeed`: concept Sheet pinned at top, instance Sheets indented and reorderable via up/down arrows; concept not reorderable.
- [ ] `BlockSheet` collapses to identity + fields, expands to add body; editing is entered only via the pencil button; only one Sheet edits at a time across the feed.
- [ ] Sidebar, tree, central panel, and matrix headers all consume the new family with correct `display` + `kind`.
- [ ] Matrix headers render as Pills with correct kinds; dead computeds and the stale `getColorClasses` import are removed.
- [ ] No backend or persistence behavior changes.
