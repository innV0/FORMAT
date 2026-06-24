# Spec: Block Relationships

## Purpose

Define the system for extracting, indexing, and displaying wikilink relationships between blocks. Users see which blocks reference the current block (incoming) and which blocks the current block references (outgoing) in the BlockSheet expanded view.

## Requirements

### REQ-01 — Wikilink Extraction from Descriptions

The system MUST extract all `[[BlockName]]` references from a block's `description` text. Each unique target name constitutes an outgoing relationship.

#### Scenario: Extract single wikilink

- GIVEN a block has description `"See [[Design Spec]] for details"`
- WHEN the extraction runs
- THEN the outgoing set includes `"Design Spec"`

#### Scenario: Extract multiple wikilinks

- GIVEN a block has description `"Depends on [[Auth]] and [[Storage]]"`
- WHEN the extraction runs
- THEN the outgoing set includes `"Auth"` and `"Storage"`

#### Scenario: No wikilinks in description

- GIVEN a block has description `"No links here"`
- WHEN the extraction runs
- THEN the outgoing set from this source is empty

#### Scenario: Self-reference in description

- GIVEN a block named `"Feature A"` has description `"Feature A is primary"`
- WHEN the extraction runs
- THEN the outgoing set includes `"Feature A"` (self-reference is allowed)

---

### REQ-02 — Wikilink Extraction from Reference Fields

The system MUST extract the value of every `reference`-type field from a block's `fields` record. Each non-empty reference value constitutes an outgoing relationship.

#### Scenario: Reference field with value

- GIVEN a block has `fields: { input: "Artifact X" }` and the `input` field is type `reference`
- WHEN the extraction runs
- THEN the outgoing set includes `"Artifact X"`

#### Scenario: Reference field empty

- GIVEN a block has `fields: { input: "" }` for a reference field
- WHEN the extraction runs
- THEN the empty value is excluded from the outgoing set

#### Scenario: Mixed field types

- GIVEN a block has `fields: { title: "Hello", target: "Block Y" }` where only `target` is type `reference`
- WHEN the extraction runs
- THEN only `"Block Y"` is extracted, not `"Hello"`

---

### REQ-03 — Relationship Index

The system MUST maintain a pre-computed index mapping each block name to its incoming and outgoing relationship sets. The index MUST be built on document load and incrementally updated on mutations.

#### Scenario: Build index on load

- GIVEN a document with 3 blocks where A links to B and C links to A
- WHEN the document loads
- THEN the index shows: A has incoming={C}, outgoing={B}; B has incoming={A}; C has outgoing={A}

#### Scenario: Update on description edit

- GIVEN block A currently has description `"See [[B]]"`
- WHEN the user edits A's description to `"See [[C]]"`
- THEN the index updates: A's outgoing changes from {B} to {C}; B's incoming loses A; C's incoming gains A

#### Scenario: Update on block rename

- GIVEN block B is renamed to `New B` and block A references `[[B]]`
- WHEN the rename completes
- THEN the index reflects A referencing `New B`, not `B`

#### Scenario: Update on block deletion

- GIVEN block A references `[[B]]` and B is deleted
- WHEN B is deleted
- THEN the index removes B entirely; A's outgoing no longer includes B

---

### REQ-04 — BlockRelationships Component

The system MUST render a `BlockRelationships` component in the BlockSheet expanded view. It displays two sections: "Referenced by" (incoming) and "References" (outgoing). Each listed block MUST be rendered as a clickable `BlockPill` that selects the target block.

#### Scenario: Both sections populated

- GIVEN a block has incoming={C, D} and outgoing={E}
- WHEN the component renders
- THEN "Referenced by" shows C and D as clickable pills; "References" shows E as a clickable pill

#### Scenario: Click navigates to target

- GIVEN the component displays block C in the "Referenced by" section
- WHEN the user clicks C
- THEN the application selects C in the feed

#### Scenario: Empty state renders nothing

- GIVEN a block has no incoming or outgoing relationships
- WHEN the component renders
- THEN no relationship section is rendered (not empty placeholders)

---

### REQ-05 — Relationship Sources

The system MUST consider only two sources for outgoing relationships: wikilinks in `description` text and values in `reference`-type fields. No other field types or sources contribute to the relationship index.

#### Scenario: String field does not contribute

- GIVEN a block has `fields: { name: "Some text" }` where `name` is type `string`
- WHEN the extraction runs
- THEN the string value is not treated as a relationship

#### Scenario: Boolean field does not contribute

- GIVEN a block has `fields: { active: true }` where `active` is type `boolean`
- WHEN the extraction runs
- THEN the boolean value is not treated as a relationship
