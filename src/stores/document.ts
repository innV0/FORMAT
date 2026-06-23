import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { TreeNode, NodeMarkers, MetamatrixRow, MatrixValues, Concept, Marker, AnalysisScores, EvaluatorScore } from '../types';
import { parseMarkdownModel, generateMarkdownFileContent } from '../utils/markdownParser';
import { useWorkspaceStore } from './workspace';
import { useMetamodelStore } from './metamodel';
import { parseMetamodelDocumentation } from '../utils/documentationParser';

export const useDocumentStore = defineStore('document', () => {
  const workspaceStore = useWorkspaceStore();
  const metamodelStore = useMetamodelStore();
  const activeConceptName = ref<string>('Business summary');
  const unsavedChanges = ref<boolean>(false);
  const selectedNode = ref<TreeNode | null>(null);
  const selectedNodeType = ref<string>('');
  
  // Model state variables derived from document parser
  const modelTextData = ref<Record<string, string>>({});
  const modelTree = ref<TreeNode[]>([]);
  const nodeMarkers = ref<NodeMarkers>({});
  const metamatrix = ref<MetamatrixRow[]>([]);
  const matrixValues = ref<MatrixValues>({});
  const activeGeneratedMatrixIndex = ref<number>(0);
  const metamodelPath = ref<string | null>(null);
  const formatVersion = ref<string>('V_0-1-2');
  const templateName = ref<string>('business');
  const templateVersion = ref<string>('V_1-0-0');
  const specificationUrl = ref<string>('https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/DOCS/spec/V_0-1-2/spec.md');
  const documentationLocation = ref<string>('docs/spec/V_0-1-2/');
  const analysisScores = ref<AnalysisScores>({});

  const loadDocument = (markdownContent: string) => {
    const parsed = parseMarkdownModel(markdownContent, metamodelStore.concepts);
    
    if (parsed.metamodel) {
      metamodelStore.loadMetamodelFromObject(parsed.metamodel, 'Inline YAML Frontmatter');
    } else {
      metamodelStore.loadDefaultMetamodel();
    }

    // C1 fix: wire taxonomy edges parsed from the document body (concept-taxonomy
    // hierarchy matrix section) into the metamodel store. The frontmatter template
    // object has no taxonomy key for flat .md files, so loadMetamodelFromObject
    // would leave taxonomyEdges empty. We override here when the parser found edges.
    if (parsed.taxonomyEdges && parsed.taxonomyEdges.length > 0) {
      metamodelStore.setTaxonomyEdges(parsed.taxonomyEdges);
    }
    
    metamodelPath.value = parsed.metamodelPath;
    templateName.value = parsed.templateName || 'business';
    templateVersion.value = parsed.templateVersion || 'V_1-0-0';
    formatVersion.value = parsed.formatVersion || 'V_0-1-2';
    specificationUrl.value = parsed.specificationUrl || 'https://raw.githubusercontent.com/innV0/FORMAT/v0.1.2/DOCS/spec/V_0-1-2/spec.md';
    documentationLocation.value = parsed.documentationLocation || 'docs/spec/V_0-1-2/';
    modelTextData.value = parsed.modelTextData;
    modelTree.value = parsed.modelTree;
    nodeMarkers.value = parsed.nodeMarkers;
    metamatrix.value = parsed.metamatrix;
    matrixValues.value = parsed.matrixValues;
    analysisScores.value = (parsed as any).analysisScores || {};
    unsavedChanges.value = false;
    
    // Select first concept
    activeConceptName.value = 'Business summary';
    selectedNode.value = null;
    selectedNodeType.value = '';

    // Load documentation asynchronously
    loadDocumentation();
  };
  const getConceptType = () => {
    if (activeConceptName.value === 'metamatrix' || activeConceptName.value === 'matrices') {
      return 'setup';
    }
    const c = metamodelStore.getConceptByName(activeConceptName.value);
    if (!c) return 'text';
    if (metamodelStore.hierarchyConcepts.includes(c.name)) {
      return 'instantiable';
    }
    return c.type || 'text';
  };

  const selectConcept = (name: string) => {
    activeConceptName.value = name;
  };

  const triggerUnsavedChanges = () => {
    unsavedChanges.value = true;
  };

  // Node hierarchy operations
  const selectTreeNode = (node: TreeNode, type: string) => {
    selectedNode.value = node;
    selectedNodeType.value = type;
  };

  const addTreeRoot = () => {
    const rootConcept = metamodelStore.hierarchyConcepts[0] || 'Stakeholders';
    const cleanName = rootConcept.endsWith('s') ? rootConcept.slice(0, -1) : rootConcept;
    const id = 'sh-' + Math.random().toString(36).substr(2, 9);
    const newSH: TreeNode = {
      id,
      name: 'New ' + cleanName,
      type: rootConcept,
      description: '',
      fields: {},
      children: []
    };
    modelTree.value.push(newSH);
    selectTreeNode(newSH, rootConcept);
    triggerUnsavedChanges();
  };

  const addChildTreeNode = (parent: TreeNode, childType: string) => {
    const cleanName = childType.endsWith('s') ? childType.slice(0, -1) : childType;
    const prefix = childType.substring(0, 3).toLowerCase() + '-';
    const id = prefix + Math.random().toString(36).substr(2, 9);
    const newChild: TreeNode = {
      id,
      name: 'New ' + cleanName,
      type: childType,
      description: '',
      fields: {},
      children: []
    };
    if (!parent.children) parent.children = [];
    parent.children.push(newChild);
    selectTreeNode(newChild, childType);
    triggerUnsavedChanges();
  };

  const deleteTreeNode = (nodeId: string) => {
    const remove = (list: TreeNode[]): boolean => {
      const idx = list.findIndex(n => n.id === nodeId);
      if (idx !== -1) {
        list.splice(idx, 1);
        return true;
      }
      for (const n of list) {
        if (n.children && remove(n.children)) return true;
      }
      return false;
    };
    remove(modelTree.value);
    selectedNode.value = null;
    selectedNodeType.value = '';
    triggerUnsavedChanges();
  };

  // Markers
  const setNodeMarkerValue = (nodeId: string, markerName: string, value: number) => {
    if (!nodeMarkers.value[nodeId]) {
      nodeMarkers.value[nodeId] = {};
    }
    nodeMarkers.value[nodeId][markerName] = value;
    triggerUnsavedChanges();
  };

  const getNodeMarkerValue = (nodeId: string, markerName: string): number => {
    const nodeVal = nodeMarkers.value[nodeId];
    return nodeVal ? (nodeVal[markerName] || 0) : 0;
  };

  const getNodeMarkersSummary = (node: TreeNode): string => {
    const markersList = metamodelStore.markers;
    const scores = nodeMarkers.value[node.id] || {};
    let summary = '';
    markersList.forEach(m => {
      const val = scores[m.name];
      if (val && val > 0) {
        summary += m.symbol.repeat(val) + ' ';
      }
    });
    return summary.trim();
  };

  // Metamatrix setup table
  const addMetamatrixRow = () => {
    const newRow: MetamatrixRow = {
      name: 'New-Matrix',
      source: 'Profiles',
      target: 'Channels',
      widgetType: 'cycle',
      params: 'Neutral;High;Critical'
    };
    metamatrix.value.push(newRow);
    triggerUnsavedChanges();
  };

  const deleteMetamatrixRow = (index: number) => {
    metamatrix.value.splice(index, 1);
    triggerUnsavedChanges();
  };

  // Matrix generation lists
  const getMatrixRowsList = (source: string, tree: TreeNode[] = modelTree.value): string[] => {
    if (metamodelStore.hierarchyConcepts.includes(source)) {
      const clean = (s: string) => s.replace(/\*\*|\*|__/g, '').trim();
      const rows: string[] = [];
      const visit = (list: TreeNode[]) => {
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
    
    // Extract list items from modelTextData for that concept name
    const rawText = modelTextData.value[source] || '';
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
    // If target maps to segments/profiles/personas, extract from tree.
    // Otherwise, try to check if it represents concepts list (e.g. Problems, Channels, Value propositions)
    if (metamodelStore.hierarchyConcepts.includes(target)) {
      return getMatrixRowsList(target);
    }
    // Extract list items from modelTextData for that concept name
    const rawText = modelTextData.value[target] || '';
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

  const rotateMatrixCellCycle = (matrixName: string, rowName: string, colName: string, optionsStr: string) => {
    const options = optionsStr.split(';').map(o => o.trim());
    const key = `${matrixName}||${rowName}||${colName}`;
    const currentVal = String(matrixValues.value[key] || 'Neutral');
    const currentIdx = options.indexOf(currentVal);
    const nextIdx = (currentIdx + 1) % options.length;
    matrixValues.value[key] = options[nextIdx];
    triggerUnsavedChanges();
  };

  const getCycleBgColor = (val: any): string => {
    const cleanVal = String(val).toLowerCase().trim();

    // Check if it's a number
    if (cleanVal !== '' && !isNaN(Number(cleanVal))) {
      const num = Number(cleanVal);
      if (num <= 0) return 'bg-white text-slate-400 border-slate-200';
      if (num <= 1) return 'bg-white text-slate-900 border-slate-200';
      if (num <= 2) return 'bg-slate-200 text-slate-800 border-slate-300';
      if (num <= 3) return 'bg-slate-400 text-white border-slate-400';
      if (num <= 4) return 'bg-slate-600 text-white border-slate-600';
      return 'bg-slate-900 text-white border-slate-900';
    }

    // Semantic text matches for good/bad
    if (cleanVal === 'good' || cleanVal === 'ok' || cleanVal === 'yes' || cleanVal === 'success' || cleanVal === 'completed' || cleanVal === 'done' || cleanVal === 'passed') {
      return 'bg-emerald-600 text-white border-emerald-600';
    }
    if (cleanVal === 'bad' || cleanVal === 'fail' || cleanVal === 'failed' || cleanVal === 'no' || cleanVal === 'error') {
      return 'bg-rose-600 text-white border-rose-600';
    }

    // Grayscale semantic intensity scale
    if (cleanVal === 'max' || cleanVal === 'very high' || cleanVal === 'extreme' || cleanVal === 'critical') {
      return 'bg-slate-950 text-white border-slate-950';
    }
    if (cleanVal === 'high' || cleanVal === 'alto') {
      return 'bg-slate-900 text-white border-slate-900';
    }
    if (cleanVal === 'slightly high' || cleanVal === 'medium-high') {
      return 'bg-slate-600 text-white border-slate-600';
    }
    if (cleanVal === 'medium' || cleanVal === 'moderate' || cleanVal === 'average' || cleanVal === 'medio') {
      return 'bg-slate-400 text-white border-slate-400';
    }
    if (cleanVal === 'slightly low' || cleanVal === 'medium-low') {
      return 'bg-slate-200 text-slate-800 border-slate-300';
    }
    if (cleanVal === 'low' || cleanVal === 'bajo' || cleanVal === 'very low' || cleanVal === 'min') {
      return 'bg-white text-slate-900 border-slate-200';
    }
    if (cleanVal === 'neutral' || cleanVal === '-' || cleanVal === '' || cleanVal === 'none' || cleanVal === 'pending') {
      return 'bg-white text-slate-400 border-slate-200';
    }

    // Fallback/default minimal styling
    return 'bg-white text-slate-800 border-slate-200';
  };

  const getSetOptionsList = (paramsStr: string): string[] => {
    return paramsStr.split(';').map(o => o.trim());
  };

  const getCleanPrompts = (conceptName: string): string[] => {
    const guidance = getActiveConceptGuidance(conceptName);
    if (!guidance) return [];
    if (guidance.prompts) {
      if (Array.isArray(guidance.prompts)) {
        return guidance.prompts;
      }
      if (typeof guidance.prompts === 'string') {
        const lines = guidance.prompts.split('\n');
        const prompts: string[] = [];
        lines.forEach((l: string) => {
          const match = l.match(/`([^`]+)`/);
          if (match) {
            prompts.push(match[1]);
          } else {
            const cleanL = l.replace(/^[-*]\s+/, '').trim();
            if (cleanL) prompts.push(cleanL);
          }
        });
        return prompts;
      }
    }
    // Fallback from description
    const desc = (guidance as any).description || '';
    const lines = desc.split('\n');
    const prompts: string[] = [];
    lines.forEach((l: string) => {
      const match = l.match(/`([^`]+)`/);
      if (match) {
        prompts.push(match[1]);
      }
    });
    return prompts;
  };

  const getActiveConceptGuidance = (conceptName: string) => {
    if (conceptName === 'matrices' || conceptName === 'metamatrix') {
      const activeMatrix = metamatrix.value[activeGeneratedMatrixIndex.value];
      if (activeMatrix) {
        return metamodelStore.getMatrixGuidance(activeMatrix.name, activeMatrix.source, activeMatrix.target);
      }
    }
    return metamodelStore.getConceptByName(conceptName);
  };

  const serializeActiveFile = (): string => {
    return generateMarkdownFileContent({
      activeFileName: workspaceStore.activeFileName || 'model.md',
      metamodelPath: metamodelPath.value || undefined,
      formatVersion: formatVersion.value,
      templateName: templateName.value,
      templateVersion: templateVersion.value,
      specificationUrl: specificationUrl.value,
      documentationLocation: documentationLocation.value,
      modelTextData: modelTextData.value,
      modelTree: modelTree.value,
      nodeMarkers: nodeMarkers.value,
      markers: metamodelStore.markers,
      metamatrix: metamatrix.value,
      matrixValues: matrixValues.value,
      concepts: metamodelStore.concepts,
      analysisScores: analysisScores.value,
      getMatrixRowsList,
      getMatrixColsList
    });
  };

  // Evaluation & Consensous Helpers
  const addEvaluatorScore = (keyName: string, evaluatorId: string, evaluatorType: 'human' | 'ai', score: number, comment?: string) => {
    if (!analysisScores.value[keyName]) {
      analysisScores.value[keyName] = [];
    }
    // Remove previous score from the same evaluator to keep log updated with latest per evaluator
    analysisScores.value[keyName] = analysisScores.value[keyName].filter(
      s => s.evaluator_id !== evaluatorId
    );
    analysisScores.value[keyName].push({
      timestamp: new Date().toISOString(),
      evaluator_id: evaluatorId,
      evaluator_type: evaluatorType,
      score: Number(score),
      comment
    });
    triggerUnsavedChanges();
  };

  const getKeyLatestScores = (keyName: string): Record<string, EvaluatorScore> => {
    const scores = analysisScores.value[keyName] || [];
    const latest: Record<string, EvaluatorScore> = {};
    // Since we append, the last one is the latest
    scores.forEach(s => {
      latest[s.evaluator_id] = s;
    });
    return latest;
  };

  const getKeyConsensus = (keyName: string): { level: 'High' | 'Medium' | 'Low' | 'None', deviation: number } => {
    const latestScores = Object.values(getKeyLatestScores(keyName));
    if (latestScores.length < 2) {
      return { level: 'None', deviation: 0 };
    }
    const values = latestScores.map(s => s.score);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    let level: 'High' | 'Medium' | 'Low' = 'High';
    if (stdDev > 2.0) {
      level = 'Low';
    } else if (stdDev > 0.8) {
      level = 'Medium';
    }
    return { level, deviation: Number(stdDev.toFixed(2)) };
  };

  const saveActiveFile = async () => {
    if (!workspaceStore.activeFileName || !workspaceStore.dirHandle) return;
    const content = serializeActiveFile();
    const success = await workspaceStore.fs.saveFileContent(
      workspaceStore.dirHandle,
      workspaceStore.activeFileName,
      content
    );
    if (success) {
      unsavedChanges.value = false;
    }
  };

  const loadDocumentation = async () => {
    try {
      let content = '';
      const docPath = `${documentationLocation.value}metamodel_documentation.md`;
      
      // 1. Try reading from workspace if directory handle is present
      if (workspaceStore.dirHandle) {
        try {
          content = await workspaceStore.readWorkspaceFile(docPath);
        } catch (err) {
          console.warn(`Could not read documentation from workspace at ${docPath}, falling back to fetch`, err);
        }
      }
      
      // 2. If content is still empty, try fetching from server
      if (!content) {
        const fetchUrls = [
          `/${docPath}`,
          `/docs/V_0-1-2/metamodel_documentation.md`,
          `/Samples/metamodel_documentation.md`
        ];
        for (const url of fetchUrls) {
          try {
            const resp = await fetch(url);
            if (resp.ok) {
              content = await resp.text();
              break;
            }
          } catch (e) {
            // Ignore and try next URL
          }
        }
      }
      
      if (content) {
        const docs = parseMetamodelDocumentation(content);
        metamodelStore.setDocumentation(docs);
      }
    } catch (err) {
      console.error('Failed to load metamodel documentation:', err);
    }
  };

  // Initialize documentation on store load
  loadDocumentation();

  return {
    activeConceptName,
    unsavedChanges,
    selectedNode,
    selectedNodeType,
    modelTextData,
    modelTree,
    nodeMarkers,
    metamatrix,
    matrixValues,
    activeGeneratedMatrixIndex,
    metamodelPath,
    formatVersion,
    templateName,
    templateVersion,
    specificationUrl,
    documentationLocation,
    loadDocument,
    getConceptType,
    selectConcept,
    triggerUnsavedChanges,
    selectTreeNode,
    addTreeRoot,
    addChildTreeNode,
    deleteTreeNode,
    setNodeMarkerValue,
    getNodeMarkerValue,
    getNodeMarkersSummary,
    addMetamatrixRow,
    deleteMetamatrixRow,
    getMatrixRowsList,
    getMatrixColsList,
    rotateMatrixCellCycle,
    getCycleBgColor,
    getSetOptionsList,
    getCleanPrompts,
    getActiveConceptGuidance,
    serializeActiveFile,
    saveActiveFile,
    analysisScores,
    addEvaluatorScore,
    getKeyLatestScores,
    getKeyConsensus,
    loadDocumentation
  };
});
