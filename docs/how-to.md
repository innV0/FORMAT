# How To Use _FORMAT

A complete step-by-step guide to modeling your business strategy in a single Markdown file.

---

## What You Need

- A modern browser (Chrome, Edge, or Opera recommended — **Firefox and Safari do not support the File System Access API**)
- A folder on your computer where you'll store your model files
- 5 minutes

---

## Step 1 — Open the Editor

Go to **[format.innv0.com](https://format.innv0.com/)** — opens in a new tab.

No installation. No account. The editor runs entirely in your browser.

> **Tip:** Bookmark this URL for quick access.

---

## Step 2 — Download a Template

Choose the template that fits your goal and save the `.md` file to a folder on your computer.

### Business Template
For modeling complete business strategies — market, solutions, finance, roadmap, and more.

**[Download business template →](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/templates/business/V_1-0-0/business_V_1-0-0_FORMAT.md)**

Right-click → **Save link as...** → save to your chosen folder.

### Procedures Template
For documenting workflows, SOPs, and step-by-step processes.

**[Download procedures template →](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/templates/procedures/V_1-1-0/procedures_V_1-1-0_FORMAT.md)**

Right-click → **Save link as...** → save to the same folder.

> **New to _FORMAT?** Try the [Ghostbusters sample model](https://raw.githubusercontent.com/innV0/FORMAT/main/docs/templates/business/V_1-0-0/samples/Ghostbusters_V_0-1-0_business_FORMAT.md) first — it's a filled-in example showing what a complete model looks like.

---

## Step 3 — Organize Your Folder

Your folder should look like this:

```
my-business/
└── MyBusiness_V_1-0-0_business_FORMAT.md
```

That's it. One folder, one file. The editor will create `backups/` and `assets/` subfolders automatically as needed.

### File Naming Rules

Files **must** follow this pattern:

```
<ModelName>_V_<major>-<minor>-<patch>_<template>_FORMAT.md
```

| Part | Example | Meaning |
| :--- | :--- | :--- |
| `<ModelName>` | `Acme` | Your business or project name |
| `V_<major>-<minor>-<patch>` | `V_1-0-0` | Version number (SemVer) |
| `<template>` | `business` | Template type: `business` or `procedures` |
| `_FORMAT.md` | `_FORMAT.md` | Fixed suffix |

**Examples:**
- `Acme_V_1-0-0_business_FORMAT.md`
- `Onboarding_V_2-1-0_procedures_FORMAT.md`
- `StartupX_V_0-1-0_business_FORMAT.md`

---

## Step 4 — Connect the Directory

1. In the editor, click the **"Connect Directory"** button in the sidebar.

2. A file picker dialog opens. **Select the folder** that contains your `.md` file (not the file itself — the folder).

   > If you saved the template in `Documents/my-business/`, select `my-business/`.

3. Your browser asks for permission to read and write files in that folder. Click **"View files"** or **"Allow"**.

4. The editor scans the folder and shows your `.md` file in the sidebar. If there's only one file, it opens automatically.

### Permission Notes

- **Your files never leave your computer.** The editor reads and writes directly to your disk using the browser's File System Access API. Nothing is uploaded to any server.
- **On page reload**, the browser will ask for permission again. Click "Allow" to reconnect. The editor remembers your folder selection, but the browser requires explicit permission each session.
- **If you close and reopen the browser**, you'll need to reconnect. Your edits are saved to disk, so nothing is lost.

---

## Step 5 — Understand the Interface

The editor has three main areas:

### Left Sidebar — Concept Tree
Shows all concepts in your template as a hierarchical tree. Click any concept to see its elements. Click an element to edit it.

**For the Business Template, key concepts include:**
- Business summary
- Stakeholders, Segments, Profiles
- Problems, Value propositions
- Features, Roadmap
- Revenue, Costs
- Mission, Vision, Values

### Main Area — Editor
Where you edit the selected element. Depending on the concept type, you'll see:
- **Text fields** — for descriptions and summaries
- **Score sliders** — for markers (weight, completion, certainty, priority, rating)
- **Matrix tables** — for mapping relationships between concepts

### Right Sidebar — Guidance
Contextual help and documentation for the currently selected concept. Explains what the concept means, how to fill it in, and provides examples.

---

## Step 6 — Fill In Your Model

Start with the big picture and work down:

### 1. Business Summary
Describe what your business does in 2-3 sentences. This is the anchor for everything else.

### 2. Problems
List the problems you solve. For each problem:
- Give it a clear name (e.g., "High customer churn")
- Add a description (what, why it matters, who experiences it)
- Set a **weight** score (how important is this problem?)

### 3. Value Propositions
List your solutions. For each:
- Name and describe it
- Set its weight
- In the **Problems × Value Propositions matrix**, mark which problems each proposition addresses

### 4. Segments
Who are your customers? Define each segment with a name and description.

### 5. Continue with other concepts
Fill in Features, Revenue, Costs, Team, Roadmap — whatever is relevant to your business.

> **You don't have to fill everything.** Leave concepts empty if they don't apply. The template is comprehensive by design — use what you need.

---

## Step 7 — Work with Matrices

Matrices are the core of _FORMAT. They map relationships between concepts.

### Viewing a Matrix

1. Click **"Matrices"** in the sidebar or navigate to a matrix concept.
2. Select the matrix you want to view from the toolbar dropdown.
3. Rows = source concept elements. Columns = target concept elements.

### Editing a Matrix

Click any cell to set the relationship value. Depending on the matrix type, you'll see:
- **Scale** — a numeric slider (e.g., Low → High)
- **Cycle** — click to cycle through states
- **Boolean** — check/uncheck

### Key Matrices to Fill

| Matrix | Why It Matters |
| :--- | :--- |
| **Problems × Value Propositions** | Shows which solutions address which problems. Gaps = missing coverage. |
| **Features × Milestones** | Maps your product roadmap. |
| **Metrics × Organizational Goals** | Aligns KPIs to objectives (OKR style). |

---

## Step 8 — Save Your Work

- **Ctrl+S** (or **Cmd+S** on Mac) saves the current file to disk.
- The editor writes directly to your `.md` file — no export needed.
- If **auto-backup** is enabled, a timestamped copy is also saved to `backups/`.

### Creating a New Version

1. Click the version bump button in the header.
2. Choose **major**, **minor**, or **patch**.
3. The editor creates a **new file** with the incremented version number and switches to it.

Example: `Acme_V_1-0-0_business_FORMAT.md` → `Acme_V_1-1-0_business_FORMAT.md`

---

## Step 9 — Use Your Model with AI

This is where _FORMAT shines. Your `.md` file is **AI-ready context**.

### How to Use It

1. Save your model file.
2. Open ChatGPT, Claude, Gemini, or any AI tool.
3. **Paste the entire file** into the chat, or **attach it as a file**.
4. Ask strategic questions.

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
Given my team and roadmap, do we have resources to deliver 
Feature X by Q3?
```

### Why This Works

Without _FORMAT, you spend the first 10 minutes of every AI conversation explaining your business. With _FORMAT, the AI has your complete context — segments, problems, solutions, finances, team — all interconnected. You jump straight to strategic analysis.

---

## Step 10 — Version Control (Optional but Recommended)

_FORMAT files are plain Markdown. They work perfectly with Git.

### Basic Workflow

```bash
cd my-business/
git init
git add MyBusiness_V_1-0-0_business_FORMAT.md
git commit -m "Initial business model"
```

After editing in the app:

```bash
git add MyBusiness_V_1-0-0_business_FORMAT.md
git commit -m "Updated value propositions and problem weights"
```

### Why Git?

- **History** — see how your strategy evolved over time
- **Diff** — compare changes between versions
- **Branching** — explore "what if" scenarios without risk
- **Collaboration** — share model changes via pull requests

---

## Quick Reference

| Action | How |
| :--- | :--- |
| Open the editor | Go to [format.innv0.com](https://format.innv0.com/) |
| Download template | Right-click link → Save link as... |
| Connect folder | Click "Connect Directory" → select folder → Allow |
| Save | Ctrl+S / Cmd+S |
| New version | Click version bump → choose major/minor/patch |
| View matrix | Click Matrices → select from dropdown |
| Use with AI | Paste file contents into any AI chat |

---

## Troubleshooting

### "The editor says Demo Mode"
You haven't connected a directory, or the browser lost permission. Click "Connect Directory" and re-select your folder.

### "My changes aren't saving"
Make sure you granted **read/write** permission (not just read) when the browser asked. Try reconnecting the directory.

### "The file picker doesn't open"
You're using Firefox or Safari. Switch to **Chrome, Edge, or Opera** — only these browsers support the File System Access API.

### "I see a blank page after reload"
The editor tries to reconnect to your last directory. If permission was denied, it shows the connection modal. Click "Connect Directory" to reconnect.

### "My file name is wrong"
Follow the naming convention exactly:
```
<ModelName>_V_<major>-<minor>-<patch>_<template>_FORMAT.md
```
Example: `MyStartup_V_1-0-0_business_FORMAT.md`

---

## Next Steps

- [Read the full specification →](spec/V_0-1-2/spec.md)
- [Business template documentation →](templates/business/V_1-0-0/documentation.md)
- [View on GitHub →](https://github.com/innV0/FORMAT)
