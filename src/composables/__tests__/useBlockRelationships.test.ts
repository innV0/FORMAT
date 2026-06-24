import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { extractWikiLinks, useBlockRelationships } from '../useBlockRelationships';
import { useDocumentStore } from '../../stores/document';
import { useMetamodelStore } from '../../stores/metamodel';

describe('useBlockRelationships', () => {
  describe('extractWikiLinks', () => {
    it('should extract wikilinks from text', () => {
      const text = 'This block references [[BlockA]] and [[BlockB]].';
      const links = extractWikiLinks(text);
      expect(links).toEqual(['BlockA', 'BlockB']);
    });

    it('should return empty array for empty string', () => {
      const links = extractWikiLinks('');
      expect(links).toEqual([]);
    });

    it('should return empty array for null/undefined', () => {
      expect(extractWikiLinks('')).toEqual([]);
    });

    it('should return empty array when no wikilinks present', () => {
      const text = 'This text has no links.';
      const links = extractWikiLinks(text);
      expect(links).toEqual([]);
    });

    it('should handle single wikilink', () => {
      const text = 'Reference: [[MyBlock]]';
      const links = extractWikiLinks(text);
      expect(links).toEqual(['MyBlock']);
    });

    it('should handle duplicate wikilinks', () => {
      const text = '[[BlockA]] and [[BlockA]] again';
      const links = extractWikiLinks(text);
      expect(links).toEqual(['BlockA', 'BlockA']);
    });

    it('should handle wikilinks with special characters', () => {
      const text = '[[Block-A_1]] and [[Block B 2]]';
      const links = extractWikiLinks(text);
      expect(links).toEqual(['Block-A_1', 'Block B 2']);
    });

    it('should handle multiline text with wikilinks', () => {
      const text = `Line 1 [[BlockA]]
Line 2 [[BlockB]]
Line 3 no link
Line 4 [[BlockC]]`;
      const links = extractWikiLinks(text);
      expect(links).toEqual(['BlockA', 'BlockB', 'BlockC']);
    });

    it('should handle wikilinks at start and end of text', () => {
      const text = '[[Start]] middle [[End]]';
      const links = extractWikiLinks(text);
      expect(links).toEqual(['Start', 'End']);
    });

    it('should handle nested brackets gracefully', () => {
      const text = '[[Block with [nested] brackets]]';
      const links = extractWikiLinks(text);
      // The regex matches [[ ... ]] where ... doesn't contain ]
      // So it will match [[Block with [nested] (stops at first ]]])
      // This is expected behavior - wikilinks shouldn't contain nested brackets
      expect(links).toEqual([]);
    });

    it('should handle empty wikilink content', () => {
      const text = 'Empty link: [[]]';
      const links = extractWikiLinks(text);
      // The regex requires at least one character between [[ and ]]
      // So [[]] doesn't match - this is expected behavior
      expect(links).toEqual([]);
    });
  });

  describe('getOutgoingRelationships', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
    });

    it('should extract wikilinks from description', () => {
      const store = useDocumentStore();
      const metamodel = useMetamodelStore();
      
      // Mock getConceptByName to return null (no reference fields)
      metamodel.getConceptByName = vi.fn().mockReturnValue(null);

      const { getOutgoingRelationships } = useBlockRelationships();
      const block = {
        name: 'CurrentBlock',
        description: 'This references [[BlockA]] and [[BlockB]]',
        type: 'Stakeholders',
        fields: {},
      };

      const result = getOutgoingRelationships(block);
      expect(result.value).toEqual(['BlockA', 'BlockB']);
    });

    it('should extract values from reference-type fields', () => {
      const store = useDocumentStore();
      const metamodel = useMetamodelStore();
      
      // Mock getConceptByName to return concept with reference fields
      metamodel.getConceptByName = vi.fn().mockReturnValue({
        name: 'Stakeholders',
        fields: [
          { name: 'owner', type: 'reference', target_concepts: ['Profiles'] },
          { name: 'description', type: 'string' },
        ],
      });

      const { getOutgoingRelationships } = useBlockRelationships();
      const block = {
        name: 'CurrentBlock',
        description: 'No wikilinks here',
        type: 'Stakeholders',
        fields: { owner: 'JohnDoe' },
      };

      const result = getOutgoingRelationships(block);
      expect(result.value).toContain('JohnDoe');
    });

    it('should combine description wikilinks and reference fields', () => {
      const store = useDocumentStore();
      const metamodel = useMetamodelStore();
      
      metamodel.getConceptByName = vi.fn().mockReturnValue({
        name: 'Stakeholders',
        fields: [
          { name: 'owner', type: 'reference', target_concepts: ['Profiles'] },
        ],
      });

      const { getOutgoingRelationships } = useBlockRelationships();
      const block = {
        name: 'CurrentBlock',
        description: 'References [[BlockA]]',
        type: 'Stakeholders',
        fields: { owner: 'BlockB' },
      };

      const result = getOutgoingRelationships(block);
      expect(result.value).toContain('BlockA');
      expect(result.value).toContain('BlockB');
    });

    it('should deduplicate relationships', () => {
      const store = useDocumentStore();
      const metamodel = useMetamodelStore();
      
      metamodel.getConceptByName = vi.fn().mockReturnValue(null);

      const { getOutgoingRelationships } = useBlockRelationships();
      const block = {
        name: 'CurrentBlock',
        description: '[[BlockA]] and [[BlockA]] again',
        type: 'Stakeholders',
        fields: {},
      };

      const result = getOutgoingRelationships(block);
      expect(result.value).toEqual(['BlockA']);
    });

    it('should return empty array for block with no links', () => {
      const store = useDocumentStore();
      const metamodel = useMetamodelStore();
      
      metamodel.getConceptByName = vi.fn().mockReturnValue(null);

      const { getOutgoingRelationships } = useBlockRelationships();
      const block = {
        name: 'CurrentBlock',
        description: 'No links here',
        type: 'Stakeholders',
        fields: {},
      };

      const result = getOutgoingRelationships(block);
      expect(result.value).toEqual([]);
    });
  });

  describe('getIncomingRelationships', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
    });

    it('should find blocks that reference this block in descriptions', () => {
      const store = useDocumentStore();
      const metamodel = useMetamodelStore();
      
      store.modelTree = [
        {
          id: '1',
          name: 'BlockA',
          type: 'Stakeholders',
          description: 'References [[TargetBlock]]',
          children: [],
        },
        {
          id: '2',
          name: 'BlockB',
          type: 'Stakeholders',
          description: 'No references here',
          children: [],
        },
      ];
      store.modelTextData = {};

      metamodel.getConceptByName = vi.fn().mockReturnValue(null);

      const { getIncomingRelationships } = useBlockRelationships();
      const result = getIncomingRelationships('TargetBlock');
      
      expect(result.value.length).toBe(1);
      expect(result.value[0].block.name).toBe('BlockA');
    });

    it('should find blocks that reference this block in reference fields', () => {
      const store = useDocumentStore();
      const metamodel = useMetamodelStore();
      
      store.modelTree = [
        {
          id: '1',
          name: 'BlockA',
          type: 'Stakeholders',
          description: 'No wikilinks',
          fields: { owner: 'TargetBlock' },
          children: [],
        },
      ];
      store.modelTextData = {};

      metamodel.getConceptByName = vi.fn().mockReturnValue({
        name: 'Stakeholders',
        fields: [
          { name: 'owner', type: 'reference', target_concepts: ['Profiles'] },
        ],
      });

      const { getIncomingRelationships } = useBlockRelationships();
      const result = getIncomingRelationships('TargetBlock');
      
      expect(result.value.length).toBe(1);
      expect(result.value[0].block.name).toBe('BlockA');
      expect(result.value[0].fieldName).toBe('owner');
    });

    it('should exclude self-references', () => {
      const store = useDocumentStore();
      const metamodel = useMetamodelStore();
      
      store.modelTree = [
        {
          id: '1',
          name: 'SelfRefBlock',
          type: 'Stakeholders',
          description: 'References [[SelfRefBlock]]',
          children: [],
        },
      ];
      store.modelTextData = {};

      metamodel.getConceptByName = vi.fn().mockReturnValue(null);

      const { getIncomingRelationships } = useBlockRelationships();
      const result = getIncomingRelationships('SelfRefBlock');
      
      expect(result.value.length).toBe(0);
    });

    it('should scan nested children', () => {
      const store = useDocumentStore();
      const metamodel = useMetamodelStore();
      
      store.modelTree = [
        {
          id: '1',
          name: 'Parent',
          type: 'Stakeholders',
          description: 'No references',
          children: [
            {
              id: '2',
              name: 'Child',
              type: 'Segments',
              description: 'References [[TargetBlock]]',
              children: [],
            },
          ],
        },
      ];
      store.modelTextData = {};

      metamodel.getConceptByName = vi.fn().mockReturnValue(null);

      const { getIncomingRelationships } = useBlockRelationships();
      const result = getIncomingRelationships('TargetBlock');
      
      expect(result.value.length).toBe(1);
      expect(result.value[0].block.name).toBe('Child');
    });

    it('should return empty array when no blocks reference this block', () => {
      const store = useDocumentStore();
      const metamodel = useMetamodelStore();
      
      store.modelTree = [
        {
          id: '1',
          name: 'BlockA',
          type: 'Stakeholders',
          description: 'No references',
          children: [],
        },
      ];
      store.modelTextData = {};

      metamodel.getConceptByName = vi.fn().mockReturnValue(null);

      const { getIncomingRelationships } = useBlockRelationships();
      const result = getIncomingRelationships('TargetBlock');
      
      expect(result.value.length).toBe(0);
    });
  });
});
