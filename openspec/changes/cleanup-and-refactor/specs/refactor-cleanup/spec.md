# Delta for Refactor Cleanup

## ADDED Requirements

### Requirement: Preserve Existing Behavior During Refactoring

All refactoring changes MUST preserve identical runtime behavior. No functional changes are permitted.

#### Scenario: Typecheck passes after refactoring

- GIVEN the codebase has been refactored
- WHEN `vue-tsc --noEmit` is executed
- THEN the exit code is 0 with no type errors

#### Scenario: Existing tests pass after refactoring

- GIVEN the codebase has been refactored
- WHEN `vitest run` is executed
- ALL previously passing tests continue to pass

### Requirement: Shared Utilities Must Be Importable

New shared utility functions MUST be exported from dedicated modules under `src/utils/`.

#### Scenario: generateId is available from utils/id.ts

- GIVEN a module imports `generateId` from `utils/id`
- WHEN `generateId()` is called
- THEN a unique string identifier is returned

#### Scenario: findNodeByName is available from utils/tree.ts

- GIVEN a module imports `findNodeByName` from `utils/tree`
- WHEN called with a tree of nodes and a target name
- THEN the matching node or null is returned

#### Scenario: deriveChain is available from utils/chain.ts

- GIVEN a module imports `deriveChain` from `utils/chain`
- WHEN called with concepts and taxonomy edges
- THEN a correctly ordered chain array is returned

#### Scenario: stripMarkdownFormatting is available from utils/sanitize.ts

- GIVEN a module imports `stripMarkdownFormatting` from `utils/sanitize`
- WHEN called with markdown-formatted text
- THEN all bold, italic, and wiki-link syntax is removed

### Requirement: No Duplicate Type Definitions

The file `src/types/index.ts` MUST contain each interface definition exactly once.

#### Scenario: PerspectiveEdge defined once

- GIVEN the codebase is searched for `interface PerspectiveEdge`
- THEN exactly one definition exists in `src/types/index.ts`

#### Scenario: Perspective defined once

- GIVEN the codebase is searched for `interface Perspective`
- THEN exactly one definition exists in `src/types/index.ts`

### Requirement: Dead Files Removed

Temporary and dead files MUST be deleted from the repository.

#### Scenario: Test debug output files removed

- GIVEN the root directory is listed
- THEN no `test_*.txt` files exist

#### Scenario: Stale copy directory removed

- GIVEN the root directory is listed
- THEN no `.agents - Copy/` directory exists

#### Scenario: Dead debug.js removed

- GIVEN `src/assets/` is listed
- THEN no `debug.js` file exists
