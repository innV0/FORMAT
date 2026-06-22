import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Concept, Marker, AnalysisKey } from '../types';
import defaultMasterData from '../../innV0_master_data.json';
import { DocumentationEntry } from '../utils/documentationParser';

export const useMetamodelStore = defineStore('metamodel', () => {
  const metamodelSource = ref<string>('Built-in Default');
  const concepts = ref<Concept[]>([]);
  const markers = ref<Marker[]>([]);
  const metamodelMatrices = ref<any[]>([]);
  const documentation = ref<Record<string, DocumentationEntry>>({});

  const analysisKeys = ref<AnalysisKey[]>([]);

  // Default fallback loader
  const loadDefaultMetamodel = () => {
    metamodelSource.value = 'Built-in Default';
    concepts.value = defaultMasterData.sheets.concepts as Concept[];
    markers.value = defaultMasterData.sheets.markers as Marker[];
    metamodelMatrices.value = defaultMasterData.sheets.matrices || [];
    
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
        concepts.value = data.concepts as Concept[];
      }
      if (data.markers) {
        markers.value = data.markers as Marker[];
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

  const hierarchyConcepts = computed(() => {
    const list = concepts.value;
    const nonCategoryConcepts = list.filter(c => c.type !== 'category' && c.type !== null);
    
    const parentMap = new Map<string, string>();
    nonCategoryConcepts.forEach(c => {
      if (c.category_id) {
        const parentConcept = list.find(p => p.name === c.category_id);
        if (parentConcept && parentConcept.type !== 'category') {
          parentMap.set(c.name, parentConcept.name);
        }
      }
    });

    const chains: string[][] = [];
    nonCategoryConcepts.forEach(c => {
      const hasChildren = Array.from(parentMap.values()).includes(c.name);
      const parentIsCategory = !c.category_id || list.some(p => p.name === c.category_id && p.type === 'category');
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
      const primaryChain = chains[0];
      const rootConcept = list.find(p => p.name === primaryChain[0]);
      if (rootConcept && rootConcept.category_id) {
        const siblings = list.filter(c => c.category_id === rootConcept.category_id && c.type !== 'category' && c.name !== rootConcept.name);
        if (siblings.length > 0) {
          return [...siblings.map(s => s.name), ...primaryChain];
        }
      }
      return primaryChain;
    }

    return ['Stakeholders', 'Segments', 'Profiles', 'Persona'];
  });

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
    hierarchyConcepts,
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
