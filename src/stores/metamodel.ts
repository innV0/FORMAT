import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Concept, Marker, AnalysisKey, Perspective, PerspectiveEdge, PerspectiveNeighborhood } from '../types';
import { DocumentationEntry } from '../utils/documentationParser';
import { deriveChain } from '../utils/chain';

export const useMetamodelStore = defineStore('metamodel', () => {
  const metamodelSource = ref<string>('Built-in Default');
  const concepts = ref<Concept[]>([]);
  const markers = ref<Marker[]>([]);
  const metamodelMatrices = ref<any[]>([]);
  const documentation = ref<Record<string, DocumentationEntry>>({});
  const taxonomyEdges = ref<PerspectiveEdge[]>([]);
  const analysisKeys = ref<AnalysisKey[]>([]);

  const withIcon = <T extends { name?: string; icon?: string; emoji?: string }>(item: T): T => ({
    ...item,
    icon: item.icon || item.emoji || '',
  });

  const loadMetamodelFromObject = (metamodelObj: any, sourceName: string) => {
    try {
      metamodelSource.value = sourceName;
      const data = metamodelObj.sheets ? metamodelObj.sheets : metamodelObj;
      if (data.concepts) {
        concepts.value = (data.concepts as any[]).map(withIcon) as Concept[];
        taxonomyEdges.value = Array.isArray(data.taxonomy) ? (data.taxonomy as PerspectiveEdge[]) : [];
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

  // hierarchyConcepts: the instance Chain perspective concept sequence (Stakeholders→Segments→…).
  // Derived from instance hierarchy matrices parsed at model-load time (passed via
  // setHierarchyConcepts). Falls back to the taxonomy-edge chain when no instance
  // hierarchy data is present.
  const _hierarchyConceptsOverride = ref<string[] | null>(null);

  const hierarchyConcepts = computed(() => {
    if (_hierarchyConceptsOverride.value !== null) {
      return _hierarchyConceptsOverride.value;
    }
    return deriveChain(concepts.value, taxonomyEdges.value);
  });

  // Allow parser to push the instance-chain from parsed hierarchy matrices.
  const setHierarchyConcepts = (chain: string[]) => {
    _hierarchyConceptsOverride.value = chain.length > 0 ? chain : null;
  };

  // setTaxonomyEdges: called by the parser when it finds a concept-taxonomy matrix
  // section in a .md file. The taxonomy is a first-class edge list.
  const setTaxonomyEdges = (edges: PerspectiveEdge[]) => {
    taxonomyEdges.value = edges;
  };

  // Perspectives: named projections of the concepts, each backed by a hierarchy matrix.
  // - Taxonomy: loaded from sheets.taxonomy edges.
  // - Chain: the instance hierarchy sequence (Stakeholders→Segments→Profiles→Persona).
  const perspectives = computed<Perspective[]>(() => {
    const result: Perspective[] = [];

    if (taxonomyEdges.value.length > 0) {
      result.push({ id: 'taxonomy', name: 'Taxonomy', icon: 'layers', edges: taxonomyEdges.value });
    }

    const hc = hierarchyConcepts.value;
    if (hc.length > 1) {
      const chainEdges: PerspectiveEdge[] = [];
      for (let i = 0; i < hc.length - 1; i++) {
        chainEdges.push({ parent: hc[i], child: hc[i + 1] });
      }
      result.push({ id: 'hierarchy', name: 'Chain', icon: 'workflow', edges: chainEdges });
    }

    return result;
  });

  // For a concept, the local neighborhood (parents + children) in every perspective that contains it.
  const getConceptPerspectives = (name: string): PerspectiveNeighborhood[] => {
    return perspectives.value
      .map(perspective => ({
        perspective,
        parents: perspective.edges.filter(e => e.child === name).map(e => e.parent),
        children: perspective.edges.filter(e => e.parent === name).map(e => e.child),
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
    perspectives,
    getConceptPerspectives,
    setHierarchyConcepts,
    setTaxonomyEdges,
    loadCustomMetamodel,
    loadMetamodelFromObject,
    getConceptByName,
    getMatrixGuidance,
    setDocumentation,
    documentation,
    analysisKeys
  };
});
