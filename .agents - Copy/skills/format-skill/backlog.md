# FORMAT Skill Backlog

This file registers ideas for future extensions to the `format-skill`.

## Deferred Features

### 1. Semantic Diff
- **Description**: A diffing tool that operates on parsed business model structures rather than plain text.
- **Benefits**: Focuses on actual content changes (e.g. "Added stakeholder B2B Commercial", "Updated Segment Distressed Homeowners weight marker from 3 to 4") while ignoring line formatting, spacing, and timestamps in YAML.

### 2. Pre-audit Coherence Check
- **Description**: Performs a quick local check for missing data or basic logic validation before sending models to advanced AI evaluators (such as the `business-analysis` skill).
- **Checks**:
  - Flag concepts that still contain default fallback/missing-info placeholders.
  - Warn if hierarchy matrices do not reference defined nodes.
  - Warn if a node has no description.
