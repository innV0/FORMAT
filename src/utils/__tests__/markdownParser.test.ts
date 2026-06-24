import { describe, it, expect } from 'vitest';
import { parseMarkdownModel, generateMarkdownFileContent } from '../markdownParser';
import { Concept, Marker, TreeNode } from '../../types';

describe('concept-block marker persistence', () => {
  it('round-trips marker assignments anchored to a concept-block id (concept:<slug>)', () => {
    const markers: Marker[] = [
      { name: 'weight', symbol: '!', icon: '', description: 'Weight marker' }
    ];

    // Concept-kind blocks live in modelTextData, not modelTree. Their marker
    // assignments are keyed by the stable concept id `concept:<slug>`.
    const nodeMarkers = { 'concept:single-text-block': { weight: 2 } };

    const serialized = generateMarkdownFileContent({
      activeFileName: 'Concept Marker Test.md',
      modelTextData: { 'single text block': '# <!-- block: concepts --> single text block\n\nSome body.' },
      modelTree: [], // no tree nodes — the only marker lives on a concept block
      nodeMarkers,
      markers,
      metamatrix: [],
      matrixValues: {},
      concepts: [],
      getMatrixRowsList: () => [],
      getMatrixColsList: () => []
    });

    // The concept row must be emitted in the item-markers matrix.
    expect(serialized).toMatch(/concept:single-text-block/);

    // And it must survive a parse round-trip back into nodeMarkers.
    const parsed = parseMarkdownModel(serialized, []);
    expect(parsed.nodeMarkers['concept:single-text-block']).toBeDefined();
    expect(parsed.nodeMarkers['concept:single-text-block'].weight).toBe(2);
  });
});

describe('Index block taxonomy parsing and serialization', () => {
  const taxonomyConcepts: Concept[] = [
    { name: 'Market', icon: 'target', type: 'category', description: '' },
    { name: 'Stakeholders', icon: 'users', type: 'weight', description: '' },
    { name: 'Segments', icon: 'users', type: 'weight', description: '' },
    { name: 'Value propositions', icon: 'lightbulb', type: 'weight', description: '' },
    { name: 'Offerings', icon: 'package', type: 'weight', description: '' },
  ];

  const taxonomyMarkers: Marker[] = [
    { name: 'weight', symbol: '*', icon: 'plus', description: 'Relevance score' },
  ];

  it('correctly parses the index block list into taxonomyEdges', () => {
    const markdown = `---
template:
  name: "business"
  version: "V_1-0-0"
title: "Taxonomy Test"
---

# <!-- block: concepts --> index

* [[Market]]
  * [[Stakeholders]]
    * [[Segments]]
  * [[Value Propositions]]
    * [[Offerings]]
`;
    const parsed = parseMarkdownModel(markdown, taxonomyConcepts);
    expect(parsed.taxonomyEdges).toBeDefined();
    expect(parsed.taxonomyEdges).toEqual([
      { parent: 'Market', child: 'Stakeholders' },
      { parent: 'Stakeholders', child: 'Segments' },
      { parent: 'Market', child: 'Value propositions' },
      { parent: 'Value propositions', child: 'Offerings' }
    ]);
  });

  it('correctly serializes taxonomyEdges to an index block at the start of the body', () => {
    const serialized = generateMarkdownFileContent({
      activeFileName: 'Taxonomy Test.md',
      modelTextData: {},
      modelTree: [],
      nodeMarkers: {},
      markers: taxonomyMarkers,
      metamatrix: [],
      matrixValues: {},
      concepts: taxonomyConcepts,
      taxonomyEdges: [
        { parent: 'Market', child: 'Stakeholders' },
        { parent: 'Stakeholders', child: 'Segments' },
        { parent: 'Market', child: 'Value propositions' },
        { parent: 'Value propositions', child: 'Offerings' }
      ],
      getMatrixRowsList: () => [],
      getMatrixColsList: () => []
    });

    expect(serialized).toContain(`# <!-- block: concepts --> index\n\n* [[Market]]\n  * [[Stakeholders]]\n    * [[Segments]]\n  * [[Value propositions]]\n    * [[Offerings]]`);
  });
});
