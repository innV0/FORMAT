## Exploration: Relational Matrix View

### Current State
Today, the mockup at `mockups/index.html` has a basic generated matrix view tab (`matrix-view`). However, it has several limitations:
- **No proper Toolbar**: Only basic buttons to switch active matrices. No filter controls, AI simulation triggers, or widget parameter overrides.
- **Simplistic Grid**: The grid does not display hierarchy for rows/columns. Cells use basic HTML inputs (checkboxes, standard selects).
- **No MatrixPreviewPanel**: The right-side panel displays static metamodel information rather than contextual information about the selected intersection or cell details.
- **No AI Suggestions / Staged Changes**: There is no visual distinction for AI-suggested relations, and no controls to accept or reject them.

### Affected Areas
- `mockups/index.html` — This is the primary mockup file. We need to implement the Toolbar, MatrixGrid, MatrixPreviewPanel, intersection widgets, and AI suggestion staged changes directly in the Vue application markup and script.
- `relational_matrix_spec.md` — Referenced for technical requirements, definitions, and flows.

### Approaches
1. **Monolithic Vue Component Refactoring (Inline)** — Modify the existing Vue 3 application inside `mockups/index.html` by replacing the `matrix-view` tab content with a highly-styled, comprehensive set of inline components and sub-templates using Tailwind classes.
   - Pros: Easy to run, single file delivery, keeps the mockup fully static and zero-config.
   - Cons: The HTML file will grow larger, inline templates in one file can become harder to read.
   - Effort: Medium

2. **Component Separation via ES Modules** — Split `mockups/index.html` into separate component files using native JavaScript ES modules (e.g., `Toolbar.js`, `MatrixGrid.js`, etc.) imported into `index.html`.
   - Pros: Clean separation of concerns, modern modular architecture.
   - Cons: Requires a local web server to run due to CORS restrictions on `file://` protocol. Since the current mockup is designed to be opened directly as a local file, this would break the zero-config user experience.
   - Effort: High

### Recommendation
We recommend **Approach 1 (Monolithic Vue Component Refactoring)** because it preserves the standalone nature of the HTML mockup, allowing it to be opened directly in any browser without requiring a local web server, which aligns with the current workspace structure. We will structure the inline Vue template carefully with clear comments and separate logic methods.

### Risks
- **Tailwind class bloat**: The HTML file may become very large; we can mitigate this by keeping CSS clean and utilizing simple utility classes.
- **State Complexity**: Managing matrix grid state, selection, AI suggestions, and generated markdown sync in a single reactive object. We'll design a clean state structure in Vue's `setup()` method to keep it maintainable.

### Ready for Proposal
Yes. The orchestrator should propose the structural modifications to `mockups/index.html` to add the requested components and state.
