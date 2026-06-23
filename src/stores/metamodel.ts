import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Concept, Marker, AnalysisKey, Lens, LensEdge, LensNeighborhood } from '../types';
import defaultMasterData from '../../innV0_master_data.json';
import { DocumentationEntry } from '../utils/documentationParser';

export const useMetamodelStore = defineStore('metamodel', () => {
  const metamodelSource = ref<string>('Built-in Default');
  const concepts = ref<Concept[]>([]);
  const markers = ref<Marker[]>([]);
  const metamodelMatrices = ref<any[]>([]);
  const documentation = ref<Record<string, DocumentationEntry>>({});
  // Taxonomy edges: parent→child concept name pairs loaded from sheets.taxonomy.
  // These back the Taxonomy lens.
  const taxonomyEdges = ref<LensEdge[]>([]);

  const analysisKeys = ref<AnalysisKey[]>([]);

  // An element's icon is a property of the bm_format TEMPLATE (the built-in
  // metamodel), not of any individual model. Loaded models are instances and
  // must NOT carry their own concept icons — the template defines them by name.
  // Precedence: explicit frontmatter `icon` > canonical template icon (by name)
  // > legacy `emoji` field (still resolved by IconRenderer) > none.
  const canonicalIcon: Record<string, string> = {};
  [
    ...(defaultMasterData.sheets.concepts as any[]),
    ...(defaultMasterData.sheets.markers as any[]),
  ].forEach(item => {
    if (item?.name) canonicalIcon[item.name.toLowerCase()] = item.icon || item.emoji || '';
  });

  const withIcon = <T extends { name?: string; icon?: string; emoji?: string }>(item: T): T => ({
    ...item,
    icon:
      item.icon ||
      (item.name ? canonicalIcon[item.name.toLowerCase()] : '') ||
      item.emoji ||
      '',
  });

  // Default fallback loader
  const loadDefaultMetamodel = () => {
    metamodelSource.value = 'Built-in Default';
    concepts.value = (defaultMasterData.sheets.concepts as any[]).map(withIcon) as Concept[];
    markers.value = (defaultMasterData.sheets.markers as any[]).map(withIcon) as Marker[];
    metamodelMatrices.value = defaultMasterData.sheets.matrices || [];
    const sheetsAny = defaultMasterData.sheets as any;
    taxonomyEdges.value = Array.isArray(sheetsAny.taxonomy) ? (sheetsAny.taxonomy as LensEdge[]) : [];
    
    // Load keys if defined in sheets, otherwise provide default ones
    const sheetsData = defaultMasterData.sheets as any;
    if (sheetsData.keys) {
      analysisKeys.value = (sheetsData.keys as AnalysisKey[]).map(k => {
        // Enforce default relation fields if empty
        return {
          ...k,
          target_concepts: k.target_concepts || [k.domain],
          depends_on_keys: k.depends_on_keys || [],
          type: k.type || ((k.target_concepts && k.target_concepts.length > 1) ? 'relational' : 'pure')
        };
      });
    } else {
      analysisKeys.value = [];
    }
  };

  const loadMetamodelFromObject = (metamodelObj: any, sourceName: string) => {
    try {
      metamodelSource.value = sourceName;
      const data = metamodelObj.sheets ? metamodelObj.sheets : metamodelObj;
      if (data.concepts) {
        concepts.value = (data.concepts as any[]).map(withIcon) as Concept[];
        taxonomyEdges.value = Array.isArray(data.taxonomy) ? (data.taxonomy as LensEdge[]) : [];
      }
      if (data.markers) {
        markers.value = (data.markers as any[]).map(withIcon) as Marker[];
      }
      if (data.matrices) {
        metamodelMatrices.value = data.matrices;
      }
      if (data.keys) {
        analysisKeys.value = data.keys as any[];
      } else {
        analysisKeys.value = [];
      }
    } catch (err) {
      console.error('Error loading metamodel from object:', err);
    }
  };

  const loadCustomMetamodel = (jsonContent: any, sourceName: string) => {
    loadMetamodelFromObject(jsonContent, sourceName);
  };

  const setDocumentation = (docs: Record<string, DocumentationEntry>) => {
    documentation.value = docs;
  };

  // Initialize with defaults
  loadDefaultMetamodel();

  // hierarchyConcepts: the instance Chain lens concept sequence (Stakeholders→Segments→…).
  // Derived from instance hierarchy matrices parsed at model-load time (passed via
  // setHierarchyConcepts). Falls back to the taxonomy-edge chain when no instance
  // hierarchy data is present.
  const _hierarchyConceptsOverride = ref<string[] | null>(null);

  const hierarchyConcepts = computed(() => {
    if (_hierarchyConceptsOverride.value !== null) {
      return _hierarchyConceptsOverride.value;
    }
    // Derive Chain from taxonomy edges: find the sequence of non-category concepts
    // that are linked parent→child through category-type parents.
    const list = concepts.value;
    const edges = taxonomyEdges.value;
    const conceptNames = new Set(list.filter(c => c.type !== 'category').map(c => c.name));
    const categoryNames = new Set(list.filter(c => c.type === 'category').map(c => c.name));

    // Build a parentMap for concept→concept edges (parent is non-category)
    const parentMap = new Map<string, string>();
    edges.forEach(e => {
      if (conceptNames.has(e.child) && conceptNames.has(e.parent)) {
        parentMap.set(e.child, e.parent);
      }
    });

    // Find roots: non-category concepts whose parent in taxonomy is a category
    const chains: string[][] = [];
    list.filter(c => c.type !== 'category' && c.type !== null).forEach(c => {
      const hasChildren = Array.from(parentMap.values()).includes(c.name);
      const taxonomyParents = edges.filter(e => e.child === c.name).map(e => e.parent);
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

    if (chains.length > 0) {
      const chainRoot = chains[0][0];
      // Sibling-prepend: find non-category concepts that share a category parent
      // with the chain root but are not in the chain (e.g. Stakeholders shares
      // "Market" with Segments but has no concept-type children → excluded).
      const chainRootCategoryParents = edges
        .filter(e => e.child === chainRoot && categoryNames.has(e.parent))
        .map(e => e.parent);
      const siblings: string[] = [];
      if (chainRootCategoryParents.length > 0) {
        list
          .filter(c => c.type !== 'category' && c.type !== null && !chains[0].includes(c.name))
          .forEach(c => {
            const parentsOfC = edges.filter(e => e.child === c.name).map(e => e.parent);
            if (parentsOfC.some(p => chainRootCategoryParents.includes(p))) {
              siblings.push(c.name);
            }
          });
      }
      return [...siblings, ...chains[0]];
    }

    return ['Stakeholders', 'Segments', 'Profiles', 'Persona'];
  });

  // Allow parser to push the instance-chain from parsed hierarchy matrices.
  const setHierarchyConcepts = (chain: string[]) => {
    _hierarchyConceptsOverride.value = chain.length > 0 ? chain : null;
  };

  // setTaxonomyEdges: called by the parser when it finds a concept-taxonomy matrix
  // section in a .md file. The taxonomy is a first-class edge list.
  const setTaxonomyEdges = (edges: LensEdge[]) => {
    taxonomyEdges.value = edges;
  };

  // Lenses: named projections of the concepts, each backed by a hierarchy matrix.
  // - Taxonomy: loaded from sheets.taxonomy edges.
  // - Chain: the instance hierarchy sequence (Stakeholders→Segments→Profiles→Persona).
  const lenses = computed<Lens[]>(() => {
    const result: Lens[] = [];

    if (taxonomyEdges.value.length > 0) {
      result.push({ id: 'taxonomy', name: 'Taxonomy', icon: 'layers', edges: taxonomyEdges.value });
    }

    const hc = hierarchyConcepts.value;
    if (hc.length > 1) {
      const chainEdges: LensEdge[] = [];
      for (let i = 0; i < hc.length - 1; i++) {
        chainEdges.push({ parent: hc[i], child: hc[i + 1] });
      }
      result.push({ id: 'hierarchy', name: 'Chain', icon: 'workflow', edges: chainEdges });
    }

    return result;
  });

  // For a concept, the local neighborhood (parents + children) in every lens that contains it.
  const getConceptLenses = (name: string): LensNeighborhood[] => {
    return lenses.value
      .map(lens => ({
        lens,
        parents: lens.edges.filter(e => e.child === name).map(e => e.parent),
        children: lens.edges.filter(e => e.parent === name).map(e => e.child),
      }))
      .filter(n => n.parents.length > 0 || n.children.length > 0);
  };

  const getConceptByName = (name: string) => {
    const concept = concepts.value.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (!concept) return undefined;
    
    const key = name.toLowerCase();
    const doc = documentation.value[key];
    if (doc) {
      return {
        ...concept,
        summary: concept.summary || doc.summary || null,
        description: concept.description || doc.description || null,
        methodologies: concept.methodologies || doc.methodologies || null,
        prompts: concept.prompts || doc.prompts || null
      } as Concept;
    }
    return concept;
  };

  const getMatrixGuidance = (name: string, source: string, target: string) => {
    const key = `matrix: ${name}`.toLowerCase();
    const fallbackKey1 = `matrix: ${source}-${target} matrix`.toLowerCase();
    const fallbackKey2 = name.toLowerCase();
    
    const doc = documentation.value[key] || documentation.value[fallbackKey1] || documentation.value[fallbackKey2];
    if (doc) {
      return {
        name,
        icon: 'bar-chart-2',
        summary: doc.summary || `Relational matrix between ${source} and ${target}.`,
        description: doc.description || `Relational grid mapping ${source} to ${target}.`,
        methodologies: doc.methodologies,
        prompts: doc.prompts
      };
    }
    
    return {
      name,
      icon: 'bar-chart-2',
      summary: `Relational matrix between ${source} and ${target}.`,
      description: `Allows connecting and analyzing relationships between ${source} items (rows) and ${target} items (columns).`,
      prompts: [
        `Analyze the relationships between ${source} and ${target}.`,
        `Are there any gaps in the alignment between ${source} and ${target}?`
      ]
    };
  };

  return {
    metamodelSource,
    concepts,
    markers,
    metamodelMatrices,
    taxonomyEdges,
    hierarchyConcepts,
    lenses,
    getConceptLenses,
    setHierarchyConcepts,
    setTaxonomyEdges,
    loadDefaultMetamodel,
    loadCustomMetamodel,
    loadMetamodelFromObject,
    getConceptByName,
    getMatrixGuidance,
    setDocumentation,
    documentation,
    analysisKeys
  };
});
