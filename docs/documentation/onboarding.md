> **💡 ¿Cansado de ver el documento como texto plano?**  
> En vez de leer el Markdown crudo, podés abrirlo en la **app de FORMAT** para verlo de forma visual e interactiva.  
> Cargá tu archivo `.md` en [format.innv0.com/app](https://format.innv0.com/app) y al instante tenés cards editables, matrices interactivas y un **graph view** que muestra todas las conexiones entre conceptos.  
> Abajo te dejamos un pantallazo del graph view con el modelo de Ghostbusters cargado — así se ve cuando lo visualizás en la app.

![Graph View — Sankey layout](/documentation/images/format-graph-view-sankey.png)
![Graph View — Force layout](/documentation/images/format-graph-view-force.png)

---

# Welcome to FORMAT

You just opened a **FORMAT document** — and it probably looks like a wall of text with symbols, dashes, and tables. That's normal. FORMAT documents are plain Markdown files that carry their own schema, designed to be both human-readable and machine-processable.

This guide is for first-time users who want to understand what's going on and how to work with these files visually.

> **👁️ This page itself is a raw Markdown file.** What you're reading — headings, text, code blocks — is rendered by Docsify directly from a `.md` file. A FORMAT document is the same: plain Markdown. But when you load it in the FORMAT app, that same raw text becomes an interactive dashboard with editable cards, scored matrices, and navigable concept trees. Keep scrolling to see the side-by-side comparison.

---

## What You're Looking At

A FORMAT document is a structured Markdown file that represents a **business or procedure model**. Everything — the schema, the data, the relationships — lives in a single `.md` file:

```
┌─ YAML Frontmatter ─────────────────────────┐
│  - Template definition (concepts, markers)  │
│  - Version info, metadata                   │
├─ Markdown Body ─────────────────────────────┤
│  - Document Notice                          │
│  - Concept blocks (business summary,        │
│    stakeholders, segments, etc.)            │
│  - Matrices (relationships between          │
│    concepts and elements)                   │
└─────────────────────────────────────────────┘
```

---

## Step-by-Step: Opening Your Document in the FORMAT App

### 1. Open the Project Website

Go to **[format.innv0.com](https://format.innv0.com)** in any modern browser (Chrome, Edge, Firefox, Safari).

This is the project website. It explains what FORMAT is and links to everything you need.

### 2. Go to the App

Open **[format.innv0.com/app](https://format.innv0.com/app)** or click **"App"** in the navigation bar. The app loads instantly — it's a client-side web application. Nothing is uploaded to a server; your files stay on your machine.

The app shows an empty workspace ready to load a document.

### 3. Load Your Document

You have two ways to load your `.md` file:

- **Drag & drop**: Drag the file from your file explorer directly into the app window.
- **File picker**: Click the load button and select your file from the dialog.

Once loaded, the app parses the frontmatter and body, and renders the model as an interactive visual interface with:
- Concept cards with their elements
- Editable fields and markers
- Relationship matrices as interactive tables
- A taxonomy tree showing how concepts relate to each other

---

## Raw Markdown vs. Visualized in the App

Here's the same content in both views so you can see what the app does for you.

### Raw Markdown (what you're seeing now)

```markdown
# <!-- block: concepts --> Business summary

A digital agency offering web design, SEO, and content marketing
to small and medium businesses in Latin America.

# <!-- block: concepts --> Stakeholders

* <!-- block: Stakeholders --> Founders
  ```yaml
  influence: high
  interest: high
  ```

* <!-- block: Stakeholders --> Investors
  ```yaml
  influence: high
  interest: medium
  ```

# <!-- block: matrices --> stakeholders-segments hierarchy matrix

| Stakeholders \ Segments | SMBs | Enterprise |
| :--- | :---: | :---: |
| Founders | X | - |
| Investors | - | X |
```

### Visualized in the App (what you'll see after loading)

When you load this file in the FORMAT app, the raw text becomes an interactive dashboard:

```
┌─────────────────────────────────────────────────┐
│  Business summary                               │
│  ┌─────────────────────────────────────────┐    │
│  │ A digital agency offering web design,   │    │
│  │ SEO, and content marketing to small     │    │
│  │ and medium businesses in Latin America. │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  Stakeholders                                   │
│  ┌──────────────┬───────────┬──────────┐        │
│  │ Name         │ Influence │ Interest │        │
│  ├──────────────┼───────────┼──────────┤        │
│  │ Founders     │ high      │ high     │        │
│  │ Investors    │ high      │ medium   │        │
│  └──────────────┴───────────┴──────────┘        │
│                                                 │
│  Stakeholders × Segments                        │
│  ┌──────────────┬──────┬──────────┐             │
│  │              │ SMBs │ Enterprise│             │
│  ├──────────────┼──────┼──────────┤             │
│  │ Founders     │  X   │    -     │             │
│  │ Investors    │  -   │    X     │             │
│  └──────────────┴──────┴──────────┘             │
└─────────────────────────────────────────────────┘
```

The app turns tables into interactive grids, YAML blocks into editable forms, and wikilinks into navigable connections.

---

## What's Next?

- **[User Guide](/documentation/app/user_guide)** — detailed reference for the app's features
- **[How To _FORMAT](/documentation/how-to)** — guide to authoring your own models
- **[Core Specification](/documentation/spec/V_0-1-0/_format)** — the full spec if you want to understand the format in depth
