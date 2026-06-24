# Design: Codebase Cleanup and Refactoring

## Architecture Decisions

### Centralized Utility Modules

Create dedicated utility modules under `src/utils/` following existing patterns:

| Module | Responsibility | Consumers |
|--------|---------------|-----------|
| `src/utils/id.ts` | `generateId()` — single source for ID generation | document.ts, markdownParser.ts, TextEditor.vue |
| `src/utils/tree.ts` | `findNodeByName()`, `findParentNodeOfType()` — tree traversal | App.vue, markdownParser.ts, BlockRelationships.vue |
| `src/utils/chain.ts` | `deriveChain()` — hierarchy chain derivation | metamodel.ts, markdownParser.ts |
| `src/utils/constants.ts` | `DEFAULT_FORMAT_VERSION`, `DEFAULT_TEMPLATE_NAME`, `MAX_MARKER_SCORE` | document.ts, ModelInfoPanel.vue, BlockPill.vue, BlockSheet.vue |

### Extend Existing Module: `src/utils/sanitize.ts`

Add `stripMarkdownFormatting()` alongside existing `slugify()`. Both deal with text sanitization — same domain.

### Types Consolidation

Single source of truth in `src/types/index.ts`. Component-local duplicate interfaces (BlockData, ParsedItem, Marker) are replaced with imports from the canonical types module.

## Implementation Order

```
Phase 1: Delete dead files (zero risk, immediate wins)
Phase 2: Create new utility modules (no consumers yet, safe)
Phase 3: Fix duplicate types in types/index.ts (correctness fix)
Phase 4: Update consumers to use new utilities (the main refactor)
Phase 5: Remove unused imports (cleanup)
Phase 6: Verify (typecheck + tests)
```

## Key Decisions

1. **`generateId()`**: Use `crypto.randomUUID()` — available in all modern browsers and Node 19+. Falls back to `Math.random()` only if needed.
2. **`deriveChain()`**: Extract the algorithm from metamodel.ts (the canonical version referenced by markdownParser.ts comments) into `chain.ts`.
3. **Marker cycling `% 4`**: Replace with `(current + 1) % (MAX_MARKER_SCORE + 1)` where `MAX_MARKER_SCORE = 3`.
4. **`getMatrixRowsList`/`getMatrixColsList`**: Extract shared logic into a single `extractListFromTextData(textData, mode: 'rows' | 'cols')` helper within document.ts (not a separate file — too store-specific).

## Verification

After each phase:
1. `npx vue-tsc --noEmit` — type safety
2. `npx vitest run` — behavioral correctness
