# Design: Immutable Specs

## Technical Approach

The goal is to normalize specification URLs to point directly to raw, immutable GitHub URLs on release tags. This eliminates reliance on the custom domain `https://format.innv0.com/spec/v0-1-2/format-spec.md` for `V_0-1-2` documents while maintaining strict immutability. The folder segment `V_0-1-2` remains capitalized and underscored.

Additionally, a dedicated agent skill `FORMAT-skill` is created at `.agents/skills/FORMAT-skill/SKILL.md` to catalog all canonical specifications and guide LLMs during formatting tasks.

## Architecture Decisions

| Decision | Option | Tradeoff | Decision |
|---|---|---|---|
| **Spec URL Target** | Raw GitHub release tag | Restricts dynamic updates without git tags, but guarantees absolute immutability. | Use `https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/DOCS/V_0-1-2/format-spec.md`. |
| **Legacy Support** | No migrations/URL rewriting | Old models are left with old URLs. Avoids modifying immutable released specs. | Leave `V_0-1-0` and `V_0-1-1` byte-for-byte identical. |
| **Agent Skill Path** | `.agents/skills/FORMAT-skill/SKILL.md` | Follows standard Agent Teams Lite structure. | Create `.agents/skills/FORMAT-skill/SKILL.md`. |

## Data Flow

When parsing a document, the document store processes the YAML frontmatter. If the `specification_url` field is omitted, it falls back to the default canonical raw GitHub URL:

```
[Markdown File] ──(parseMarkdownModel)──> [Frontmatter Parsing]
                                                    │
                                        (Has specification_url?)
                                         ├── Yes ──> Use document value
                                         └── No  ──> Use canonical raw GitHub URL fallback
```

When creating a new model document, the UI templates populate the `specification_url` frontmatter field with the default canonical raw GitHub URL:

```
[Create File Action] ──> [Generate Markdown Template] ──> [Write File to Workspace]
                                     │
                    (Injects canonical raw GitHub URL)
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/stores/document.ts` | Modify | Update default and parser fallback `specificationUrl` references to point to raw GitHub URL. |
| `src/components/editor/ModelInfoPanel.vue` | Modify | Update default creation template frontmatter schema `specification_url` to raw GitHub URL. |
| `DOCS/V_0-1-2/format-spec.md` | Modify | Update the frontmatter example at line 123 to use raw GitHub URL. |
| `.agents/skills/FORMAT-skill/SKILL.md` | Create | Author skill file containing agent guidelines and immutable specifications index. |

## Interfaces / Contracts

### FORMAT Agent Skill (`.agents/skills/FORMAT-skill/SKILL.md`)

```yaml
---
name: FORMAT-skill
description: "Guides AI agents on FORMAT specifications, grammar rules, schema metadata, and constraint verification."
disable-model-invocation: true
user-invocable: false
license: MIT
metadata:
  author: gentleman-programming
  version: "1.0"
---

# FORMAT Agent Skill

## Purpose
This skill provides instructions, constraints, and specification links for AI agents handling FORMAT document files.

## Specification Index
| Version | Canonical Spec URL |
|---|---|
| V_0-1-0 | https://raw.githubusercontent.com/innV0/FORMAT/v0.1.0/DOCS/V_0-1-0/format-spec.md |
| V_0-1-1 | https://raw.githubusercontent.com/innV0/FORMAT/v0.1.1/DOCS/V_0-1-1/format-spec.md |
| V_0-1-2 | https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/DOCS/V_0-1-2/format-spec.md |

## Modeling Reference
All syntax, structure, and grammar rules for building/modifying FORMAT model documents are documented in `references/modeling-spec.md`. Agents MUST read and follow guidelines in that file when editing models.

## Core Rules for Agents
1. **English Default**: All generated technical outputs, frontmatter keys, and file contents MUST default to English.
2. **Immutability Guard**: Strictly respect specification immutability. DO NOT modify any files or directories in historical folders (e.g., `DOCS/V_0-1-0`, `DOCS/V_0-1-1`).
```

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | Store Initialization | Check that `documentStore` initializes `specificationUrl` to the canonical raw GitHub URL. |
| Unit | Parser Fallback | Parse markdown content missing `specification_url` frontmatter and assert fallback to canonical raw GitHub URL. |
| Integration | New File Template | Execute `handleCreateFile` and assert template content contains the canonical raw GitHub URL in YAML frontmatter. |

## Migration / Rollout

No database or runtime state migration is required. Older models containing `https://format.innv0.com/spec/v0-1-2/format-spec.md` continue to be supported transparently at runtime.

## Open Questions

None.
