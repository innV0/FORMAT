# FORMAT User Guide

This guide explains how to use the FORMAT application to manage, edit, and enrich business and procedural models using the visual interface and integrated AI agent skills.

---

## 1. Getting Started
To use the FORMAT editor:
1. Open the application.
2. Select your template (e.g., **Business** or **Procedures**) or load an existing `.md` model file.
3. Use the hierarchical tree and concept lists to view and edit elements.

---

## 2. Managing Matrix Views
The **Relational Matrix View** allows you to configure and edit many-to-many relationships between nodes (e.g., mapping Customer Segments to Problems):
- Switch matrix definitions via the toolbar selector.
- Edit values on the fly using specialized cell widgets (checkboxes, cycles, scale sliders).
- View intersection details in the contextual sidebar panel.

---

## 3. AI Ingestion & Customization (Agent Skills)
The application workspace incorporates specialized AI skills to automate importing and updating models based on external documents.

### Ingesting Sources via `_FORMAT-source-incorporator` Skill
When starting a new model or updating an existing one, the `_FORMAT-source-incorporator` skill allows the AI agent to ingest raw documentation and accurately map the facts.

#### Workflow:
1. **Attached Sources**: If you upload or attach files via the application's interface, the agent copies them directly to the `.sources/` subdirectory of your model.
2. **Raw Folder Scanning**: The agent will ask you if you have a `.raw/` folder in your model's directory where you have deposited files via Windows File Explorer. If confirmed, the agent scans and processes those files.
3. **Strict Fact Extraction**: The agent performs strict information extraction. To prevent hallucinations:
   - Only facts explicitly found in the sources are mapped to the model.
   - If there is no information in the sources for a concept, it is left empty or uncreated.
4. **AI Traceability**:
   - Any model element created or edited by the AI via this skill is annotated with the `#AI` tag.
   - Descriptions of AI-modified elements are appended with standard Markdown links referencing the original source filenames:
     `(Source: [filename.ext](.sources/filename.ext))`
5. **Handover**: Once the factual import is completed and you approve the changes, the agent can hand over the model to an independent optimization or suggestion skill for content enhancement.
