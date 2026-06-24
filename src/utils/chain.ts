import type { Concept, PerspectiveEdge } from '../types';

/**
 * Derives the hierarchy Chain concept sequence from taxonomy edges and concept types.
 * The Chain is the sequence of non-category concepts linked parent→child through the taxonomy,
 * where the chain root's parent is a category concept.
 *
 * Shared by metamodel store, parser, and serializer.
 */
export function deriveChain(
  concepts: Concept[],
  taxonomyEdges: PerspectiveEdge[]
): string[] {
  const conceptNames = new Set(concepts.filter(c => c.type !== 'category').map(c => c.name));
  const categoryNames = new Set(concepts.filter(c => c.type === 'category').map(c => c.name));

  const parentMap = new Map<string, string>();
  taxonomyEdges.forEach(e => {
    if (conceptNames.has(e.child) && conceptNames.has(e.parent)) {
      parentMap.set(e.child, e.parent);
    }
  });

  const chains: string[][] = [];
  concepts.filter(c => c.type !== 'category' && c.type !== null).forEach(c => {
    const hasChildren = Array.from(parentMap.values()).includes(c.name);
    const taxonomyParents = taxonomyEdges.filter(e => e.child === c.name).map(e => e.parent);
    const parentIsCategory = taxonomyParents.length === 0 || taxonomyParents.some(p => categoryNames.has(p));
    if (hasChildren && parentIsCategory) {
      const chain = [c.name];
      let current = c.name;
      while (true) {
        const childName = Array.from(parentMap.keys()).find(k => parentMap.get(k) === current);
        if (childName) {
          chain.push(childName);
          current = childName;
        } else {
          break;
        }
      }
      chains.push(chain);
    }
  });

  let hierarchyConcepts: string[] = [];
  if (chains.length > 0) {
    const chainRoot = chains[0][0];
    const chainRootCategoryParents = taxonomyEdges
      .filter(e => e.child === chainRoot && categoryNames.has(e.parent))
      .map(e => e.parent);
    const siblings: string[] = [];
    if (chainRootCategoryParents.length > 0) {
      concepts
        .filter(c => c.type !== 'category' && c.type !== null && !chains[0].includes(c.name))
        .forEach(c => {
          const parentsOfC = taxonomyEdges.filter(e => e.child === c.name).map(e => e.parent);
          if (parentsOfC.some(p => chainRootCategoryParents.includes(p))) {
            siblings.push(c.name);
          }
        });
    }
    hierarchyConcepts = [...siblings, ...chains[0]];
  }

  hierarchyConcepts = hierarchyConcepts.map(hc => {
    const found = concepts.find(c => c.name.toLowerCase() === hc.toLowerCase());
    return found ? found.name : hc;
  });

  return hierarchyConcepts;
}
