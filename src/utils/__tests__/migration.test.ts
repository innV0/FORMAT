import { describe, it, expect } from 'vitest';
import { parseMarkdownModel, generateMarkdownFileContent } from '../markdownParser';
import fs from 'fs';
import path from 'path';

const filesToMigrate = [
  'docs/templates/business/V_1-0-0/business_V_1-0-0_FORMAT.md',
  'docs/templates/procedures/V_1-0-0/procedures_V_1-0-0_FORMAT.md',
];

describe('Migration runner', () => {
  it('migrates all templates to use the index block', () => {
    const baseDir = path.resolve(__dirname, '../../..');
    
    filesToMigrate.forEach(relPath => {
      const fullPath = path.join(baseDir, relPath);
      expect(fs.existsSync(fullPath)).toBe(true);
      
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Parse file
      const parsed = parseMarkdownModel(content, []);
      const concepts = parsed.metamodel?.concepts || [];
      const markers = parsed.metamodel?.markers || [];
      const metamatrix = parsed.metamatrix;

      // Extract hierarchy concepts list
      const hierarchyConcepts = parsed.hierarchyConcepts || ['Stakeholders', 'Segments', 'Profiles', 'Persona'];

      const getMatrixRowsList = (source: string, tree: any[] = parsed.modelTree): string[] => {
        if (hierarchyConcepts.includes(source)) {
          const clean = (s: string) => s.replace(/\*\*|\*|__/g, '').trim();
          const rows: string[] = [];
          const visit = (list: any[]) => {
            list.forEach(n => {
              if (n.type === source) {
                rows.push(clean(n.name));
              }
              if (n.children) visit(n.children);
            });
          };
          visit(tree);
          return rows;
        }
        
        const rawText = parsed.modelTextData[source] || '';
        if (rawText.includes('<!-- block:')) {
          const escapedSource = source.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(`<!--\\s*block:\\s*${escapedSource}\\s*-->\\s*(.*)`, 'gi');
          const matchAll = [...rawText.matchAll(regex)];
          if (matchAll.length > 0) {
            return matchAll.map(m => m[1].replace(/\*\*|\*|__|\[\[|\]\]/g, '').trim());
          }
        }
        const items: string[] = [];
        const lines = rawText.split('\n');
        lines.forEach(l => {
          const match = l.match(/^[-*]\s+\*\*?([^*:]+)\*\*?:?/);
          if (match) {
            items.push(match[1].replace(/\*\*|\*|__/g, '').trim());
          } else {
            const simpleMatch = l.match(/^[-*]\s+([^:]+):?/);
            if (simpleMatch) {
              items.push(simpleMatch[1].replace(/\*\*|\*|__/g, '').trim());
            }
          }
        });
        return items;
      };

      const getMatrixColsList = (target: string): string[] => {
        if (hierarchyConcepts.includes(target)) {
          return getMatrixRowsList(target, parsed.modelTree);
        }
        const rawText = parsed.modelTextData[target] || '';
        if (rawText.includes('<!-- block:')) {
          const escapedTarget = target.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(`<!--\\s*block:\\s*${escapedTarget}\\s*-->\\s*(.*)`, 'gi');
          const matchAll = [...rawText.matchAll(regex)];
          if (matchAll.length > 0) {
            return matchAll.map(m => m[1].replace(/\*\*|\*|__|\[\[|\]\]/g, '').trim());
          }
        }
        const items: string[] = [];
        const lines = rawText.split('\n');
        lines.forEach(l => {
          const match = l.match(/^[-*]\s+\*\*?([^*:]+)\*\*?:?/);
          if (match) {
            items.push(match[1].replace(/\*\*|\*|__/g, '').trim());
          } else {
            const simpleMatch = l.match(/^[-*]\s+([^:]+):?/);
            if (simpleMatch) {
              items.push(simpleMatch[1].replace(/\*\*|\*|__/g, '').trim());
            }
          }
        });
        return items;
      };

      // Serialize with new index block
      const serialized = generateMarkdownFileContent({
        activeFileName: path.basename(relPath),
        metamodelPath: parsed.metamodelPath || undefined,
        formatVersion: parsed.formatVersion || undefined,
        modelVersion: parsed.modelVersion || undefined,
        specificationUrl: parsed.specificationUrl || undefined,
        documentationLocation: parsed.documentationLocation || undefined,
        templateName: parsed.templateName || undefined,
        templateVersion: parsed.templateVersion || undefined,
        modelTextData: parsed.modelTextData,
        modelTree: parsed.modelTree,
        nodeMarkers: parsed.nodeMarkers,
        markers: markers,
        metamatrix: metamatrix,
        matrixValues: parsed.matrixValues,
        concepts: concepts,
        taxonomyEdges: parsed.taxonomyEdges || undefined,
        analysisScores: (parsed as any).analysisScores || undefined,
        getMatrixRowsList,
        getMatrixColsList
      });

      // Write back
      fs.writeFileSync(fullPath, serialized, 'utf8');
      console.log(`Successfully migrated ${relPath}`);
    });
  });
});
