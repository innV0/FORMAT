# _FORMAT

**Flat, Omnipotent, Readable, Model, Annotated, Template**

One structured Markdown file gives any AI model instant, complete context of your entire business — and transforms into a visual, AI-validated, version-controlled strategy model.

---

## Quick Start

### 1. Open the Editor

**[Launch _FORMAT →](https://format.innv0.com/)**

No installation required. The editor runs entirely in your browser.

> **New here?** Read the [step-by-step How-To Guide →](https://format.innv0.com/docs/#/how-to) for a complete walkthrough.

### 2. Download a Template

Choose a template and save it to a folder on your computer:

| Template | Concepts | Best for | Download |
| :--- | :---: | :--- | :---: |
| **Business** | 70+ | Complete business strategy modeling | [`.md` file](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/templates/business/V_1-0-0/business_V_1-0-0_FORMAT.md) |
| **Procedures** | 3 | Workflows, SOPs, process documentation | [`.md` file](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/templates/procedures/V_1-0-0/procedures_V_1-0-0_FORMAT.md) |

> **New to _FORMAT?** Try the [Ghostbusters sample model](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/templates/business/V_1-0-0/samples/Ghostbusters_V_0-1-0_business_FORMAT.md) to see a filled-in example.

### 3. Connect and Edit

1. In the editor, click **"Connect Directory"** and select the folder containing your `.md` template.
2. Your model loads automatically — start editing.
3. Press **Ctrl+S** (or Cmd+S) to save changes directly to your file.

---

## How to Organize Your Files

_FORMAT works with a simple folder structure on your local machine:

```
my-business/
├── MyBusiness_V_1-0-0_business_FORMAT.md    ← your model file
├── backups/                                  ← auto-created on save (optional)
└── assets/                                   ← images referenced in your model (optional)
```

### File Naming Convention

Model files must follow this pattern:

```
<ModelName>_V_<major>-<minor>-<patch>_<template>_FORMAT.md
```

Examples:
- `Acme_V_1-0-0_business_FORMAT.md`
- `Onboarding_V_2-1-0_procedures_FORMAT.md`
- `Ghostbusters_V_0-1-0_business_FORMAT.md`

### What Goes Where

| Location | Purpose |
| :--- | :--- |
| **Root folder** | Your `.md` model files |
| **`backups/`** | Timestamped copies created automatically when backups are enabled |
| **`assets/`** | Images and media referenced in your model |
| **`.sources/`** | Raw documents ingested by the AI agent (if using the source incorporator skill) |

> **Tip:** Keep your model folder inside a Git repository for version control. Every save becomes a trackable commit.

---

## Using the Editor

### Connecting a Directory

The editor uses the **File System Access API** to read and write files directly on your disk.

1. Click **"Connect Directory"** in the sidebar.
2. Select the **parent folder** containing your `.md` files.
3. Grant read/write permission when prompted by your browser.

> **Note:** Your browser will ask for permission each time you reload the page. This is a security feature — the editor never uploads your files to any server.

### Navigating Your Model

- **Left sidebar** — Tree view of all concepts and their elements.
- **Main area** — Edit elements, fill in descriptions, adjust scores.
- **Right sidebar** — Contextual guidance and documentation for the selected concept.
- **Matrix view** — Configure and edit relational matrices between concepts.

### Saving

- **Ctrl+S** / **Cmd+S** — Save the current file.
- **Version bump** — Create a new file with an incremented version number (major/minor/patch).
- **Backups** — Toggle automatic backup creation in the editor settings.

### Creating New Files

1. Click the **"+"** button in the sidebar.
2. Enter a filename following the naming convention.
3. The editor creates the file from the current template.

---

## Templates

### Business Template

The complete business modeling template with **70+ concepts**, **13 relational matrices**, and **5 evaluation markers**.

**Categories covered:**

| Category | Key Concepts |
| :--- | :--- |
| **Market** | Stakeholders, Segments, Profiles, Persona, Competition |
| **Solutions** | Products & Services, Portfolio, Components, Features, Roadmap |
| **Marketing** | Naming, Branding, Visual Identity, Media Plan |
| **Communication** | Pitch, Brochure, Web, Storytelling, Presentations |
| **Organization** | Business Idea, Opportunity, Business Status |
| **Business Objectives** | Mission, Vision, Values, Goals |
| **Operations** | Activities, Functions, Resources |
| **Finance** | Revenue, Costs, CAC, LTV, Unit Economics, Projections |

**Download:** [business_V_1-0-0_FORMAT.md](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/templates/business/V_1-0-0/business_V_1-0-0_FORMAT.md)

**Full documentation:** [documentation.md](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/templates/business/V_1-0-0/documentation.md)

### Procedures Template

A lightweight template for documenting processes, workflows, and standard operating procedures.

| Concept | Type | Description |
| :--- | :--- | :--- |
| **Procedure Summary** | `text` | Goals and scope of the procedure |
| **Roles** | `list` | Actors participating in the procedure |
| **Steps** | `sequence` | Ordered steps to complete the procedure |

**Download:** [procedures_V_1-0-0_FORMAT.md](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/templates/procedures/V_1-0-0/procedures_V_1-0-0_FORMAT.md)

### Which Template Should I Use?

| Use Case | Template |
| :--- | :--- |
| Modeling market strategy, value propositions, finances | **Business** |
| Documenting a deployment workflow or SOP | **Procedures** |
| Validating product-market fit with matrices | **Business** |
| Creating an onboarding checklist | **Procedures** |
| Analyzing competitive landscape | **Business** |
| Standardizing a code review process | **Procedures** |

---

## Using with AI

The real power of _FORMAT is using your model file as **context for any AI model**.

### How It Works

1. Save your `.md` model file.
2. Open ChatGPT, Claude, Gemini, or any AI tool.
3. Paste the entire file contents into the conversation, or attach it as a file.
4. Ask strategic questions — the AI now knows your complete business.

### Example Prompts

```
Based on my business model, which value proposition has the weakest 
coverage for the Consulting Firms segment?
```

```
Review my problems-value propositions matrix. Are there any gaps 
where a problem has no matching value proposition?
```

```
Compare my cost structure against my revenue projections. 
What's the biggest financial risk?
```

```
Given my team composition and roadmap, do we have the resources 
to deliver Feature X by Q3?
```

### AI Agent Skills

_FORMAT includes specialized AI agent skills for automated model ingestion:

- **`_FORMAT-source-incorporator`** — Ingests raw source documents and maps facts to your model with full traceability.
- **`_FORMAT-skill`** — Creates, edits, and validates _FORMAT models from conversation.

These skills work with AI agents that support the Agent Skills protocol (e.g., OpenCode, Claude Code).

---

## Specification

_FORMAT is built on an open specification. Every file is a valid Markdown document readable by both humans and AI models.

### Document Structure

Every _FORMAT file has two parts:

**1. YAML Frontmatter** — Schema definition and metadata:
```yaml
specification_version: "V_0-1-4"
template:
  name: "business"
  version: "V_1-0-0"
title: "My Business Model"
```

**2. Markdown Body** — Concept blocks and matrices:
```markdown
# <!-- block: concepts --> problems

* <!-- block: problems --> High customer churn
  Retention below 60% after 3 months.

# <!-- block: matrices --> problems-value propositions matrix

| problems \ value propositions | Better Onboarding | Retention |
| :--- | :---: | :---: |
| **High customer churn** | High | Max |
```

### Specification Versions

| Version | Status | Link |
| :--- | :--- | :--- |
| **V_0-1-4** | Current | [_format.md](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/V_0-1-4/_format.md) |
| **V_0-1-3** | Stable | [_format.md](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/V_0-1-3/_format.md) |
| **V_0-1-2** | Stable | [_format.md](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/V_0-1-2/_format.md) |
| **V_0-1-1** | Legacy | [format-spec.md](https://raw.githubusercontent.com/innV0/FORMAT/v0.1.1/docs/spec/V_0-1-1/format-spec.md) |
| **V_0-1-0** | Legacy | [format-spec.md](https://raw.githubusercontent.com/innV0/FORMAT/v0.1.0/docs/spec/V_0-1-0/format-spec.md) |

---

## Local Development

If you want to run the editor locally or contribute to development:

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- npm

### Setup

```bash
git clone https://github.com/innV0/FORMAT.git
cd FORMAT
npm install
```

### Development Server

```bash
npm run dev
```

Opens at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Output goes to `dist/`.

### Run Tests

```bash
npm test
```

### Windows Quick Start

Double-click `run.bat` to install dependencies, start the dev server, and open the browser automatically.

---

## Project Structure

```
FORMAT/
├── src/
│   ├── main.ts                    # App entry point
│   ├── App.vue                    # Root component
│   ├── stores/                    # Pinia state management
│   │   ├── workspace.ts           # Directory connection, file I/O
│   │   ├── document.ts            # Model parsing and serialization
│   │   └── metamodel.ts           # Concepts, markers, perspectives
│   ├── composables/               # Vue composables
│   │   └── useFileSystem.ts       # File System Access API wrapper
│   ├── components/
│   │   ├── layout/                # Header, sidebar, directory picker
│   │   ├── editor/                # Text editor, tree view, matrices
│   │   └── ui/                    # Shared UI components
│   └── utils/                     # Parsing, versioning, helpers
├── docs/                          # Specification and template docs
│   ├── templates/                 # Downloadable templates
│   │   ├── business/              # Business template (V_1-0-0)
│   │   └── procedures/            # Procedures template (V_1-0-0)
│   └── spec/                      # FORMAT specification versions
├── .github/workflows/
│   ├── deploy-app.yml             # GitHub Pages deployment (app)
│   └── deploy.yml                 # GitHub Pages deployment (docs)
├── index.html                     # SPA shell
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
└── package.json                   # Dependencies and scripts
```

---

## How It Works (Technical)

_FORMAT runs entirely in the browser — no server, no accounts, no data leaves your machine.

1. **File System Access API** — The editor reads and writes directly to your local filesystem using the browser's native `showDirectoryPicker()` API.
2. **IndexedDB** — Your directory selection is persisted across sessions so you don't have to re-select your folder on every visit.
3. **Vue 3 + Pinia** — Reactive UI with state management for the model tree, document parsing, and matrix configuration.
4. **Markdown-first** — Your model is always a plain `.md` file. No proprietary format, no lock-in.

---

## Contributing

Contributions are welcome. Please:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/my-change`).
3. Make your changes and run `npm test`.
4. Submit a pull request with a clear description of the change.

---

## License

See [LICENSE](LICENSE) for details.

---

## Links

| Resource | Link |
| :--- | :--- |
| **Editor** | [format.innv0.com](https://format.innv0.com/) |
| **Documentation & How-To** | [format.innv0.com/docs](https://format.innv0.com/docs/) |
| **Specification** | [docs/V_0-1-4/_format.md](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/V_0-1-4/_format.md) |
| **Business Template** | [Download](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/templates/business/V_1-0-0/business_V_1-0-0_FORMAT.md) |
| **Procedures Template** | [Download](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/templates/procedures/V_1-0-0/procedures_V_1-0-0_FORMAT.md) |
| **Sample Model** | [Ghostbusters](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/templates/business/V_1-0-0/samples/Ghostbusters_V_0-1-0_business_FORMAT.md) |
| **Business Documentation** | [documentation.md](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/templates/business/V_1-0-0/documentation.md) |
| **GitHub** | [github.com/innV0/FORMAT](https://github.com/innV0/FORMAT) |
| **Contact** | [lucas@lucascervera.com](mailto:lucas@lucascervera.com) |
