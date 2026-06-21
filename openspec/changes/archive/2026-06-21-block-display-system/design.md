# Technical Design: Block Display System

This document describes the concrete architecture for consolidating every block rendering in the UI into a single component family driven by two orthogonal axes — **display** (`pill` | `card` | `sheet`) and **kind** (`concept` | `instance`) — replacing the legacy size-based (`xs`/`sm`/`md`/`lg`) approach and the ad hoc markup currently spread across `BlockPill`, `BlockViewer`, and their call sites.

The GOLDEN RULE this design enforces: every block in the UI renders through exactly ONE of `BlockPill` / `BlockCard` / `BlockSheet`, all three resolving their visuals through ONE shared composable (`useBlockVisuals`), and never through hand-rolled block markup.

---

## 1. Component Hierarchy

```
useBlockVisuals(opts)              ← single resolution path (composable, no template)
        │  resolves: typeIcon | emoji, container classes (outline vs solid), palette
        │
        ├── BlockPill   ── pure REFERENCE display (icon + name + states)
        │       used by: ConceptTreeNode (kind=concept), MatricesGrid headers, BlockCard, BlockSheet
        │
        ├── BlockCard   ── BROWSE display (pill visual + markers + hover quick-actions)
        │       composes: BlockPill (visual core) + reorder/add-child toolbar
        │       used by: TreeNodeItem
        │
        └── BlockSheet  ── WORK display (collapsed | expanded + explicit edit)
                composes: BlockPill (header identity) + fields list + body + edit form
                used by: BlockFeed
                          │
                          └── BlockFeed ── central-panel ORCHESTRATOR
                                  pinned concept Sheet (kind=concept) on top
                                  + indented, reorderable instance Sheets below
                                  owns the single-active-editor invariant
                                  used by: TextEditor
```

Call-site map after migration:

| Surface | Renders | Display × Kind |
|---|---|---|
| `ConceptTreeNode.vue` (sidebar) | `BlockPill` | pill × concept |
| `MatricesGrid.vue` axis headers | `BlockPill` | pill × concept (source/target) |
| `MatricesGrid.vue` row/col items | `BlockPill` | pill × instance |
| `TreeNodeItem.vue` (hierarchy) | `BlockCard` | card × instance |
| `TextEditor.vue` (central) | `BlockFeed` → `BlockSheet` | sheet × concept (pinned) + sheet × instance (feed) |

---

## 2. `useBlockVisuals` composable

`src/composables/useBlockVisuals.ts`. The single source for emoji-vs-type-icon, outline-vs-solid container styling, and palette resolution. Today this logic lives inline in `BlockPill` (`resolvedColor`, `resolvedEmoji`, `resolvedType`, `typeIcon`, `colorClasses`, and the `pillClasses` kind branch). It is extracted verbatim so all three displays share one path.

### Input

```ts
interface BlockVisualsOptions {
  kind: MaybeRef<BlockKind>;            // 'concept' | 'instance' (default 'instance')
  conceptType?: MaybeRef<string>;       // concept NAME, used to look up color/emoji/type in the store
  color?: MaybeRef<string>;             // explicit override, wins over store lookup
  emoji?: MaybeRef<string>;             // explicit override, wins over store lookup
  typeName?: MaybeRef<ConceptType>;     // explicit concept TYPE override ('text'|'category'|…)
}
```

### Returned shape

```ts
interface BlockVisuals {
  resolvedColor: ComputedRef<string>;        // resolves props.color ?? store(conceptType).color
  resolvedEmoji: ComputedRef<string>;        // resolves props.emoji ?? store(conceptType).emoji
  resolvedType:  ComputedRef<ConceptType>;   // resolves props.typeName ?? store(conceptType).type
  typeIcon:      ComputedRef<Component>;      // getConceptTypeIcon(resolvedType)
  palette:       ComputedRef<ColorPalette>;  // getColorClasses(resolvedColor)
  iconToShow:    ComputedRef<'type' | 'emoji'>; // 'type' when kind==='concept', else 'emoji'
  containerClasses: ComputedRef<string[]>;   // outline+dashed (concept) | solid tinted (instance)
}
```

Resolution rules (preserved from current `BlockPill`):
- `kind === 'concept'` → show `typeIcon`; container is `bg-white border-dashed` + `palette.text` + `palette.border`.
- `kind === 'instance'` → show `resolvedEmoji` (via `IconRenderer`); container is `palette.bg` + `palette.text` + `palette.border` (solid tint).
- `selected` / `simplified` styling stays in `BlockPill` (it is state, not block identity) — the composable owns identity only.

Dependencies it owns (centralizing the imports currently scattered): `getColorClasses` (`utils/colors.ts`), `getConceptTypeIcon` + `BlockKind` + `ConceptType` (`utils/conceptVisuals.ts`), `useMetamodelStore` (for `conceptType` → color/emoji/type lookups).

---

## 3. `BlockPill.vue` — pure reference display

Slimmed to icon + name + `selected`/`interactive` states. Everything reorder/marker/edit/delete/add-child related is **removed** (moves to `BlockCard`). The `size` axis is removed entirely; one intrinsic pill size remains.

### Props (after)

```ts
{
  name?: string;
  kind?: BlockKind;            // default 'instance'
  conceptType?: string;        // concept name for store lookup
  color?: string;              // override → useBlockVisuals
  emoji?: string;              // override → useBlockVisuals
  typeName?: ConceptType;      // override → useBlockVisuals
  selected?: boolean;
  interactive?: boolean;
  fullWidth?: boolean;
  as?: string;                 // default 'div' — keeps polymorphic root for headers
}
```

### Emits
- `(e: 'click')` — implicit via native listener; the pill itself emits nothing custom. `interactive` only toggles cursor/active styling.

### Removed
- Props: `size`, `simplified` (re-evaluate; if matrix still needs the muted look, keep `simplified` but drop `size`), `blockId`, `showMarkers`, `showAddChild`, `showEdit`, `showDelete`, `showReorder`, `isEditing`, `isFirst`, `isLast`.
- Emits: `add-child`, `edit-toggle`, `delete`, `move-up`, `move-down`.
- The entire hover "Opciones Expandidas" bottom row, marker rendering, and `cycleMarker`/`markerValue`/`markerClassesFor` logic.

Internal body becomes only the "Top Row" (icon + name slot), driven by `useBlockVisuals` for `iconToShow`, `typeIcon`, `resolvedEmoji`, and `containerClasses`.

UI/UX notes (`ui-ux-pro-max`): keep one icon size token (`w-3.5 h-3.5`) across the family; `focus-visible` ring on `interactive` pills (currently only `active:scale`); name uses `truncation-strategy` (wrap, `break-words`) — already present.

---

## 4. `BlockCard.vue` — browse/structure display (NEW)

Composes the pill visual + status markers + hover quick-actions (reorder up/down, add-child). This is exactly the markup `TreeNodeItem` inlines today via `BlockPill`'s expanded options; it moves here so `TreeNodeItem` delegates.

### Props

```ts
{
  blockId: string;             // node.id — anchor for markers
  name: string;
  kind?: BlockKind;            // default 'instance'
  conceptType?: string;        // concept name (currentConcept) for visuals + markers
  selected?: boolean;
  interactive?: boolean;       // default true
  showMarkers?: boolean;       // currently: conceptType === 'weight'
  showReorder?: boolean;
  showAddChild?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}
```

### Emits

```ts
{
  (e: 'click'): void;
  (e: 'add-child'): void;
  (e: 'move-up'): void;
  (e: 'move-down'): void;
}
```

Internals: renders `<BlockPill :kind :conceptType :name :selected :interactive />` as the identity core, plus the marker row and the hover quick-action toolbar (reusing `MarkerIcons` `getMarkerIcon`/`getMarkerClasses` + `MarkerTooltip` + `cycleMarker` against `documentStore`). Hover reveals the toolbar with `state-transition` animation (not snap); icon-only buttons get `aria-label`s (reorder/add-child) and ≥ comfortable hit area.

> Note: `TreeNodeItem` today only uses `show-add-child` and `show-markers` (no reorder — the hierarchy tree has no up/down). `showReorder` is included for parity but defaults `false`; the tree keeps it off.

---

## 5. `BlockSheet.vue` — work display (NEW, replaces `BlockViewer.vue`)

Full block surface with a `collapsed | expanded` display state and an EXPLICIT edit toggle (pencil). The key behavioral change versus `BlockViewer`: **expanding does NOT enter edit**. `BlockViewer` conflated read/edit on a single `isEditing` ref; `BlockSheet` splits them into two orthogonal states owned by the parent (`BlockFeed`), so the feed can enforce single-active-editor.

- **Collapsed**: header pill (`BlockPill` identity) + block name + fields list (the breadcrumb chips). No body.
- **Expanded**: collapsed content + full body via `renderInlineMarkdown(block.description)`.
- **Editing** (only via pencil, independent of collapsed/expanded): the edit form (name input, per-field inputs, description textarea) from `BlockViewer`.

### Props

```ts
{
  block: { id?: string; name: string; description: string; fields?: Record<string, any> };
  kind: BlockKind;                 // 'concept' (pinned) | 'instance' (feed item)
  conceptType: string;             // concept TYPE ('text'|'weight'|…) — for icon + field semantics
  conceptName: string;             // concept display name (for header label)
  conceptFields?: any[];           // field definitions for the fields list + edit inputs
  conceptColor?: string;
  conceptEmoji?: string;
  collapsed: boolean;              // controlled by parent (BlockFeed)
  isEditing: boolean;              // controlled by parent (single-editor invariant)
  hasMarkers?: boolean;
  index?: number;                  // list ordinal (#1, #2…)
  isList?: boolean;                // instance-in-feed styling (left accent border)
  showDelete?: boolean;
  showReorder?: boolean;           // instances yes; pinned concept no
  isFirst?: boolean;
  isLast?: boolean;
}
```

### Emits

```ts
{
  (e: 'update:collapsed', val: boolean): void;   // chevron toggles collapse, NOT edit
  (e: 'edit-toggle'): void;                       // pencil → parent flips active editor
  (e: 'move-up'): void;
  (e: 'move-down'): void;
  (e: 'delete'): void;
  (e: 'change'): void;                            // body/name edited (drives markdown sync)
  (e: 'update:field', fieldName: string, value: any): void;
}
```

State model: `collapsed` and `isEditing` are **props, not local refs** (the critical departure from `BlockViewer`'s internal `isEditing = ref(false)`). The Sheet is a controlled component; the feed lifts both. Header uses `BlockPill` for the identity row; the pencil/chevron/reorder/delete controls live in the Sheet header (NOT in the pill anymore). Expand/collapse animates (`state-transition`, `≤300ms`); pencil is the single edit affordance with `aria-label` and a visible `primary-action`-style emphasis only when active.

---

## 6. `BlockFeed.vue` — central-panel orchestrator (NEW)

Owns the central panel layout and the single-active-editor invariant. Replaces the two `BlockViewer` branches currently inside `TextEditor` (single-block + list). `TextEditor` keeps ALL data logic (markdown parse/sync, `parsedItems`, stable IDs, `moveItemUp`/`moveItemDown`, `addListItem`, `deleteListItem`) and passes data + handlers down to `BlockFeed`; `BlockFeed` owns only presentation + display state.

### Layout
- **Pinned concept Sheet** (`kind=concept`, `isList=false`, `showReorder=false`, not deletable) at the TOP as context.
- **Instance Sheets** below, slightly indented, each reorderable (up/down arrows), in `parsedItems` order. For the non-list (single text) concept, the feed renders just the pinned concept Sheet and no instance list.

### Props

```ts
{
  conceptName: string;
  conceptType: string;
  conceptColor?: string;
  conceptEmoji?: string;
  conceptFields?: any[];
  conceptBlock: { name: string; description: string; fields?: Record<string,any> }; // the pinned concept sheet's block
  items: ParsedItem[];             // instance blocks (stable ids from TextEditor)
  isListConcept: boolean;
  hasMarkers?: boolean;
}
```

### Emits

```ts
{
  (e: 'change-concept'): void;                 // pinned concept body changed → updateSingleBlockText
  (e: 'change-item'): void;                     // an instance changed → syncToMarkdown
  (e: 'add-item'): void;
  (e: 'delete-item', index: number): void;
  (e: 'move-item-up', index: number): void;
  (e: 'move-item-down', index: number): void;
}
```

### Single-active-editor state model (the invariant)

`BlockFeed` holds local feed state — **NOT a global store** (per proposal risk mitigation):

```ts
// keys: 'concept' for the pinned sheet, item.id for instances
const editingId = ref<string | null>(null);     // at most ONE active editor
const collapsed = reactive<Record<string, boolean>>({}); // per-sheet collapse, independent of editing
```

- Each Sheet receives `:isEditing="editingId === sheetKey"` and `:collapsed="collapsed[sheetKey] ?? true"`.
- On a Sheet's `edit-toggle`: `editingId = (editingId === key ? null : key)`. Because only the matching Sheet gets `isEditing=true`, opening one editor closes any other — the invariant is structural, not enforced by scanning.
- On `update:collapsed`: set `collapsed[key]`. Collapsing/expanding never touches `editingId` (expanding ≠ editing).
- Reorder/add/delete events bubble up unchanged to `TextEditor` (which mutates `parsedItems` + syncs markdown). Stable `item.id` keeps the active editor anchored across re-parse, so reordering does not lose edit focus.

This keeps edit-lock coupling scoped to the feed; siblings communicate only through `editingId` derived props.

---

## 7. Migration path per call-site

| Call-site | Change |
|---|---|
| `BlockPill.vue` | Adopt `useBlockVisuals`; remove size axis, markers, hover toolbar, all action emits. Pure identity. |
| `ConceptTreeNode.vue` | Drop `:size` (the `activeName === node.name ? 'md':'sm'` ternary). Keep `kind="concept"`, `conceptType`, `typeName`, `emoji`, `selected`, `interactive`, `@click`. No other change. |
| `MatricesGrid.vue` | Replace `size="xs"` usages: axis headers `kind="concept"`, row/col items `kind="instance"`. Remove dead computeds `sourceConceptEmoji`, `targetConceptEmoji`, `sourceColorClasses`, `targetColorClasses` and the now-unused `getColorClasses` import (lines ~169, 203-208, 223-224). |
| `TreeNodeItem.vue` | Swap inline `BlockPill` (with `show-markers`/`show-add-child`) for `BlockCard`; forward `blockId=node.id`, `conceptType=currentConcept`, `selected`, `showMarkers=(conceptType==='weight')`, `showAddChild=!!nextConcept`; wire `@click`→`selectTreeNode`, `@add-child`→`addChildTreeNode`. |
| `TextEditor.vue` | Replace both `BlockViewer` branches with a single `<BlockFeed>`; pass `conceptBlock=textBlock`, `items=parsedItems`, `isListConcept`, concept meta; wire feed emits to existing `updateSingleBlockText`/`syncToMarkdown`/`addListItem`/`deleteListItem`/`moveItemUp`/`moveItemDown`. Delete `BlockViewer` import. |
| `App.vue` | No structural change expected (central panel mounts `TextEditor`). Verify no direct `BlockViewer`/`size`-prop references remain after the others migrate; if present, repoint. |
| `BlockViewer.vue` | Delete after `BlockSheet` + `BlockFeed` land and `TextEditor` no longer imports it. |

---

## 8. Phased migration order

1. **Composable + slim pill**: add `useBlockVisuals`; refactor `BlockPill` to use it and strip size/markers/toolbar. Update `ConceptTreeNode` + `MatricesGrid` (the two pure-pill consumers) and remove matrix dead computeds. Verify sidebar + matrix headers visually.
2. **Card**: add `BlockCard`; migrate `TreeNodeItem`. Verify hierarchy tree (markers + add-child still work).
3. **Sheet**: add `BlockSheet` (controlled `collapsed`/`isEditing`), porting `BlockViewer`'s read/edit/fields. Not yet wired to feed — can be smoke-tested standalone.
4. **Feed**: add `BlockFeed` with the single-editor state model; migrate `TextEditor` to delegate; verify pinned concept + reorderable instances + single-active-editor.
5. **Cleanup**: delete `BlockViewer.vue`; remove any residual `size`/`xs`/`sm`/`md`/`lg` props from block components and stale imports; final pass on `App.vue`.

Each phase is independently verifiable on its own surface before the next, so a regression is isolated to one display.

---

## 9. How the GOLDEN RULE is enforced

- **One resolution path**: all three displays import visuals ONLY from `useBlockVisuals`; no component re-implements emoji/type-icon/outline/palette logic. `BlockCard` and `BlockSheet` compose `BlockPill` for identity rather than re-rolling the icon+name markup.
- **No size axis**: removing `size` from `BlockPill` makes "which display" the only structural choice — you cannot accidentally fake a Card with a big Pill.
- **No hand-rolled block markup**: after phase 5, no call-site renders a block except via `BlockPill`/`BlockCard`/`BlockSheet`. A reviewer greps for raw `getColorClasses`/`getConceptTypeIcon`/emoji rendering outside the family + composable; zero hits = rule held.
- **Single-active-editor** is enforced structurally by deriving every Sheet's `isEditing` from one `editingId` ref — it is impossible for two Sheets to be editing simultaneously.

---

## 10. Risks & tradeoffs

| Risk / Tradeoff | Mitigation |
|---|---|
| `BlockSheet` controlled `collapsed`/`isEditing` is a behavior change from `BlockViewer`'s internal state; central panel edit flow could regress. | Phase 3 smoke-tests Sheet standalone; phase 4 verifies feed before deleting `BlockViewer`. |
| `useBlockVisuals` must reproduce `BlockPill`'s resolution EXACTLY, or all displays drift at once. | Extract first (phase 1) and diff against the current `BlockPill` computeds; the pill is the canary. |
| `BlockCard` composing `BlockPill` adds a layer vs the current single component. | Acceptable: identity stays DRY; the extra wrapper is presentational only. |
| Single-editor state in `BlockFeed` (not a store) means edit state is lost if `TextEditor` remounts. | Matches existing behavior (`BlockViewer` reset on remount too); stable `item.id` keeps anchoring within a session. |
| Reorder focus loss during markdown re-parse. | Reuse `TextEditor`'s stable content-derived IDs + `moveItemUp`/`moveItemDown`; do not reimplement reorder in the feed. |
| `simplified`/matrix muted styling could be lost when stripping the pill. | Decide in phase 1 whether matrix keeps `simplified`; if so, retain that one state prop (it is identity-adjacent), drop only `size`. |

---

## 11. UI/UX conventions applied (`ui-ux-pro-max`)

- Consistent icon size token across the family (`w-3.5 h-3.5`); single icon set (Lucide) — `no-emoji-icons` honored for structural icons, while instance "emoji" remains intentional user content via `IconRenderer`.
- Distinct hover / edit / disabled / selected states; `disabled-states` keep reduced opacity on reorder buttons at list ends (already `disabled:opacity-20`).
- `aria-label` on all icon-only buttons (reorder, edit/pencil, delete, add-child) — currently only `title`; add labels.
- `focus-states`: add `focus-visible` rings on interactive pills/cards/sheet controls.
- `state-transition` / `duration-timing`: animate expand/collapse and hover-toolbar reveal (150–300ms), no snapping; reorder uses transform, not layout thrash, respecting `reduced-motion`.
