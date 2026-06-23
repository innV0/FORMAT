---
name: _FORMAT-source-incorporator
description: "Ingests raw source documents, copies them to the model's `.sources/` directory, extracts facts to update a FORMAT model strictly without hallucinating, tags changes with `#AI`, and references them via original filenames."
---

# Source Incorporator Skill

This skill guides the agent in ingesting raw knowledge documents, copying them to the target model's source folder under their original filenames, and updating a FORMAT model with strict factual constraint mapping.

## Operational Workflow

### 1. Source Discovery and Setup
- Locate the files attached by the user via the UI. Copy these files to `[ModelDirectory]/.sources/` using their **exact original filenames**.
- **Ask the user** if they have a `.raw/` folder in the model's directory (i.e., `[ModelDirectory]/.raw/`) where they have deposited raw documentation via Windows File Explorer. If they do, scan and read the files inside that folder.
- If there are filename collisions, do not attempt to rename the files; let the user manage them in the Windows file system.

### 2. Strictly Factual Extraction (No Hallucination)
- Read and analyze the contents of all discovered files.
- Map the facts found in the documents to the target FORMAT template (e.g., `business` template concepts).
- **CRITICAL CONSTRAINT**: You must ONLY write content that is directly and explicitly supported by the sources. 
- If a concept has no supporting evidence in the sources, **do NOT invent, extrapolate, or assume any information**. Leave the concept blank or do not create it in the model.
- If the source information is insufficient to write anything meaningful for a concept, write nothing at all.

### 3. Drafting and Annotation Conventions
- Write or update the model file (`.md`) conforming to the FORMAT specification.
- For every block, concept, or element written, appended, or modified by this skill, append the **`#AI`** tag to clearly identify AI-generated content.
- At the end of the description of each modified/created element, append a reference to the source file(s) using a standard Markdown link with the original filename:
  ```markdown
  (Source: [filename.ext](.sources/filename.ext))
  ```

### 4. Completion and Handover
- Present the generated or updated model to the user for review.
- Once the user gives their approval on the imported facts, suggest handing over the next steps to an independent optimization or suggestion skill (e.g., to propose enhancements or fill missing sections using strategic reasoning), keeping the factual import phase completely separate from creative improvements.
