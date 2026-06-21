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
});
