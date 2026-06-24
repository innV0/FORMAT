# Spec: Format Spec Immutability (V_0-1-2)

## 1. Overview

This delta specification defines the requirements for normalization and immutability of the FORMAT V_0-1-2 specification URLs. The custom domain is replaced by a raw GitHub URL pointing to an immutable git tag (`v0.1.2`), ensuring that all specification versions are locked and resolvable.

---

## 2. Requirements

### REQ-01 — Immutable Canonical URL Structure
The specification URL for version V_0-1-2 MUST use the exact raw GitHub path: `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/docs/V_0-1-2/format-spec.md`. The folder segment of the URL MUST preserve the uppercase and underscore format (`V_0-1-2`).

**Scenarios:**
WHEN resolving the canonical specification URL for V_0-1-2  
THEN the URL MUST match `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/docs/V_0-1-2/format-spec.md` exactly.

---

### REQ-02 — Store Default and Parser Fallback URL
The `document` store MUST initialize the default `specificationUrl` state to the canonical raw GitHub URL. The document parser MUST fall back to this exact URL when parsing a document that is missing the frontmatter `specification_url` field.

**Scenarios:**
GIVEN the application loads a document without a specified URL  
WHEN the parser extracts the metadata  
THEN the store's `specificationUrl` MUST fall back to the canonical raw GitHub URL.

---

### REQ-03 — Model Template Normalization
The inline template in the editor's Model Info Panel MUST use the canonical raw GitHub URL for any new files created.

**Scenarios:**
GIVEN a user clicks the button to create a new model file  
WHEN the default markdown template content is generated  
THEN the frontmatter `specification_url` field MUST be set to `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/docs/V_0-1-2/format-spec.md`.

---

### REQ-04 — Draft Spec Example Alignment
The frontmatter example block on line 123 of `docs/V_0-1-2/format-spec.md` MUST align with the canonical URL.

**Scenarios:**
GIVEN an external tool or human reads the draft specification `docs/V_0-1-2/format-spec.md`  
WHEN checking the frontmatter code example  
THEN the `specification_url` property MUST point to `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/docs/V_0-1-2/format-spec.md`.

---

### REQ-05 — Legacy Specs Preservation (No Migrations)
Older versions of the specification (V_0-1-0 and V_0-1-1) MUST NOT be modified, and no parser migrations SHALL be added to convert old spec URLs to new formats.

**Scenarios:**
WHEN this change is implemented and verified  
THEN files in `docs/V_0-1-0/` and `docs/V_0-1-1/` SHALL remain byte-for-byte identical to their pre-change state.

---

## 3. Out-of-Scope Constraints

- Parsing logic for legacy documents will continue using their respective version strings without runtime migration or automatic transformation.
- No network requests are made to validate the URLs at runtime.
