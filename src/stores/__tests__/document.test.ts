import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useDocumentStore } from '../document';

describe('Document Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('getCycleBgColor', () => {
    it('should map semantic text values correctly', () => {
      const store = useDocumentStore();
      
      expect(store.getCycleBgColor('good')).toBe('bg-emerald-600 text-white border-emerald-600');
      expect(store.getCycleBgColor('ok')).toBe('bg-emerald-600 text-white border-emerald-600');
      expect(store.getCycleBgColor('yes')).toBe('bg-emerald-600 text-white border-emerald-600');
      expect(store.getCycleBgColor('completed')).toBe('bg-emerald-600 text-white border-emerald-600');
      
      expect(store.getCycleBgColor('bad')).toBe('bg-rose-600 text-white border-rose-600');
      expect(store.getCycleBgColor('fail')).toBe('bg-rose-600 text-white border-rose-600');
      
      expect(store.getCycleBgColor('high')).toBe('bg-slate-900 text-white border-slate-900');
      expect(store.getCycleBgColor('critical')).toBe('bg-slate-950 text-white border-slate-950');
      expect(store.getCycleBgColor('max')).toBe('bg-slate-950 text-white border-slate-950');
      expect(store.getCycleBgColor('very high')).toBe('bg-slate-950 text-white border-slate-950');
      expect(store.getCycleBgColor('slightly high')).toBe('bg-slate-600 text-white border-slate-600');
      
      expect(store.getCycleBgColor('medium')).toBe('bg-slate-400 text-white border-slate-400');
      expect(store.getCycleBgColor('slightly low')).toBe('bg-slate-200 text-slate-800 border-slate-300');
      expect(store.getCycleBgColor('low')).toBe('bg-white text-slate-900 border-slate-200');
      expect(store.getCycleBgColor('very low')).toBe('bg-white text-slate-900 border-slate-200');
      expect(store.getCycleBgColor('min')).toBe('bg-white text-slate-900 border-slate-200');
      
      expect(store.getCycleBgColor('neutral')).toBe('bg-white text-slate-400 border-slate-200');
      expect(store.getCycleBgColor('-')).toBe('bg-white text-slate-400 border-slate-200');
    });

    it('should map numeric values correctly to intensity scales', () => {
      const store = useDocumentStore();
      
      expect(store.getCycleBgColor('0')).toBe('bg-white text-slate-400 border-slate-200');
      expect(store.getCycleBgColor('1')).toBe('bg-white text-slate-900 border-slate-200');
      expect(store.getCycleBgColor('2')).toBe('bg-slate-200 text-slate-800 border-slate-300');
      expect(store.getCycleBgColor('3')).toBe('bg-slate-400 text-white border-slate-400');
      expect(store.getCycleBgColor('4')).toBe('bg-slate-600 text-white border-slate-600');
      expect(store.getCycleBgColor('5')).toBe('bg-slate-900 text-white border-slate-900');
      expect(store.getCycleBgColor('10')).toBe('bg-slate-900 text-white border-slate-900');
    });
  });

  describe('getMatrixRowsList & getMatrixColsList block parsing fallback', () => {
    it('should correctly fall back to bullet list items if no matching block tags are found', () => {
      const store = useDocumentStore();
      
      // Load a mock document with standard markdown bullet points and concepts header block
      const source = 'problems';
      store.modelTextData[source] = `# <!-- block: concepts --> problems\n- Item One\n- Item Two`;
      
      // Since 'problems' has no '<!-- block: problems -->' tags, it should fallback to parsing bullet points
      const rows = store.getMatrixRowsList(source);
      expect(rows).toEqual(['Item One', 'Item Two']);
    });

    it('should only return matching block items if specific block tags are found', () => {
      const store = useDocumentStore();
      
      const source = 'persona';
      store.modelTextData[source] = `# <!-- block: concepts --> persona\n* <!-- block: persona --> Alice\n* <!-- block: persona --> Ray\n* <!-- block: other --> Winston`;
      
      const rows = store.getMatrixRowsList(source);
      expect(rows).toEqual(['Alice', 'Ray']);
    });
  });

  describe('renameBlock', () => {
    it('should update matrixValues keys when renaming a tree-node', () => {
      const store = useDocumentStore();
      store.matrixValues = {
        'MyMatrix||OldName||ColA': 'High',
        'MyMatrix||OldName||ColB': 'Low',
        'MyMatrix||OtherRow||ColA': 'Medium',
      };

      store.renameBlock('OldName', 'NewName', 'tree-node');

      expect(store.matrixValues).toEqual({
        'MyMatrix||NewName||ColA': 'High',
        'MyMatrix||NewName||ColB': 'Low',
        'MyMatrix||OtherRow||ColA': 'Medium',
      });
    });

    it('should update matrixValues keys when renaming a list-item', () => {
      const store = useDocumentStore();
      store.matrixValues = {
        'Mat1||Alice||Bob': 'X',
        'Mat1||Charlie||Alice': '-',
      };

      store.renameBlock('Alice', 'Alicia', 'list-item');

      expect(store.matrixValues).toEqual({
        'Mat1||Alicia||Bob': 'X',
        'Mat1||Charlie||Alicia': '-',
      });
    });

    it('should update matrixValues keys in both row and col positions', () => {
      const store = useDocumentStore();
      store.matrixValues = {
        'Mat1||Rename||Rename': 'Critical',
      };

      store.renameBlock('Rename', 'Renamed', 'tree-node');

      expect(store.matrixValues).toEqual({
        'Mat1||Renamed||Renamed': 'Critical',
      });
    });

    it('should update modelTextData inline markers for list-item rename', () => {
      const store = useDocumentStore();
      store.modelTextData = {
        'Problems': '# <!-- block: concepts --> problems\n- <!-- block: problems --> OldName: Description\n- <!-- block: problems --> Other: Other desc',
      };

      store.renameBlock('OldName', 'NewName', 'list-item');

      expect(store.modelTextData['Problems']).toContain('<!-- block: problems --> NewName: Description');
      expect(store.modelTextData['Problems']).not.toContain('OldName');
    });

    it('should update modelTextData header for concept rename', () => {
      const store = useDocumentStore();
      store.modelTextData = {
        'OldConcept': '# <!-- block: concepts --> oldconcept\nSome content',
      };

      store.renameBlock('OldConcept', 'NewConcept', 'concept');

      expect(store.modelTextData['OldConcept']).toBe('# <!-- block: concepts --> NewConcept\nSome content');
    });

    it('should update metamatrix source and target on concept rename', () => {
      const store = useDocumentStore();
      store.metamatrix = [
        { name: 'Profiles-Channels Matrix', source: 'Profiles', target: 'Channels', widgetType: 'cycle', params: 'A;B;C' },
        { name: 'Profiles-Problems Matrix', source: 'Profiles', target: 'Problems', widgetType: 'boolean', params: '' },
      ];

      store.renameBlock('Profiles', 'User Profiles', 'concept');

      expect(store.metamatrix[0].source).toBe('User Profiles');
      expect(store.metamatrix[0].target).toBe('Channels');
      expect(store.metamatrix[1].source).toBe('User Profiles');
    });

    it('should migrate nodeMarkers concept:<slug> key on concept rename', () => {
      const store = useDocumentStore();
      store.nodeMarkers = {
        'concept:old-concept': { Impact: 3, Risk: 1 },
        'concept:other': { Impact: 2 },
      };

      store.renameBlock('Old Concept', 'New Concept', 'concept');

      expect(store.nodeMarkers['concept:new-concept']).toEqual({ Impact: 3, Risk: 1 });
      expect(store.nodeMarkers['concept:old-concept']).toBeUndefined();
      expect(store.nodeMarkers['concept:other']).toEqual({ Impact: 2 });
    });

    it('should not overwrite existing marker entry if target slug already exists', () => {
      const store = useDocumentStore();
      store.nodeMarkers = {
        'concept:new-concept': { Impact: 2, Risk: 2 },
        'concept:old-concept': { Impact: 3, Risk: 1 },
      };

      store.renameBlock('Old Concept', 'New Concept', 'concept');

      // Should keep the existing entry, not overwrite with the old one
      expect(store.nodeMarkers['concept:new-concept']).toEqual({ Impact: 2, Risk: 2 });
      // Old key should be deleted regardless
      expect(store.nodeMarkers['concept:old-concept']).toBeUndefined();
    });

    it('should do nothing when old and new names are equal', () => {
      const store = useDocumentStore();
      store.matrixValues = { 'Mat||A||B': 'X' };

      store.renameBlock('A', 'A', 'tree-node');

      expect(store.matrixValues).toEqual({ 'Mat||A||B': 'X' });
    });

    it('should do nothing when name is empty', () => {
      const store = useDocumentStore();
      store.matrixValues = { 'Mat||A||B': 'X' };

      store.renameBlock('', 'New', 'tree-node');

      expect(store.matrixValues).toEqual({ 'Mat||A||B': 'X' });
    });

    it('should mark unsaved changes after rename', () => {
      const store = useDocumentStore();
      store.unsavedChanges = false;

      store.renameBlock('Old', 'New', 'tree-node');

      expect(store.unsavedChanges).toBe(true);
    });

    it('should handle matrixValues keys with multiple || delimiters gracefully', () => {
      const store = useDocumentStore();
      store.matrixValues = {
        'Mat||Row||Col': 'X',
        'InvalidKey': 'Y',
      };

      store.renameBlock('Row', 'NewRow', 'tree-node');

      expect(store.matrixValues['Mat||NewRow||Col']).toBe('X');
      expect(store.matrixValues['InvalidKey']).toBe('Y');
    });
  });
});
