import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { TreeNode, NodeMarkers, MetamatrixRow, MatrixValues, Concept, Marker, AnalysisScores, EvaluatorScore } from '../types';
import { parseMarkdownModel, generateMarkdownFileContent } from '../utils/markdownParser';
import { parseFormatFilename, buildFormatFilename, bumpVersion, formatVersionString, BumpLevel } from '../utils/version';
import { useWorkspaceStore } from './workspace';
import { useMetamodelStore } from './metamodel';
import { parseMetamodelDocumentation } from '../utils/documentationParser';
import { generateId } from '../utils/id';
import { slugify } from '../utils/sanitize';
import { DEFAULT_FORMAT_VERSION, DEFAULT_TEMPLATE_NAME, DEFAULT_TEMPLATE_VERSION } from '../utils/constants';

export const useDocumentStore = defineStore('document', () => {
  const workspaceStore = useWorkspaceStore();
  const metamodelStore = useMetamodelStore();
  const activeConceptName = ref<string>('');
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
  const formatVersion = ref<string>(DEFAULT_FORMAT_VERSION);
  const modelVersion = ref<string>('V_0-1-0');
  const templateName = ref<string>(DEFAULT_TEMPLATE_NAME);
  const templateVersion = ref<string>(DEFAULT_TEMPLATE_VERSION);
  const specificationUrl = ref<string>(`https://raw.githubusercontent.com/innV0/FORMAT/main/docs/${DEFAULT_FORMAT_VERSION}/format-spec.md`);
  const documentationLocation = ref<string>('');
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
    templateName.value = parsed.templateName || DEFAULT_TEMPLATE_NAME;
    templateVersion.value = parsed.templateVersion || DEFAULT_TEMPLATE_VERSION;
    formatVersion.value = parsed.formatVersion || DEFAULT_FORMAT_VERSION;
    // Model version: prefer frontmatter, then the version segment of a
    // compliant file name (§8.1), then a sensible default.
    const parsedName = parseFormatFilename(workspaceStore.activeFileName || '');
    modelVersion.value =
      parsed.modelVersion ||
      (parsedName ? formatVersionString(parsedName.version) : 'V_0-1-0');
    specificationUrl.value = parsed.specificationUrl || `https://raw.githubusercontent.com/innV0/FORMAT/main/docs/${DEFAULT_FORMAT_VERSION}/format-spec.md`;
    documentationLocation.value = parsed.documentationLocation || '';
    modelTextData.value = parsed.modelTextData;
    modelTree.value = parsed.modelTree;
    nodeMarkers.value = parsed.nodeMarkers;
    metamatrix.value = parsed.metamatrix;
    matrixValues.value = parsed.matrixValues;
    analysisScores.value = (parsed as any).analysisScores || {};
    unsavedChanges.value = false;
    
    // Select first concept from metamodel
    const firstConcept = metamodelStore.concepts[0];
    activeConceptName.value = firstConcept ? firstConcept.name : '';
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

  /**
   * Centralized rename propagation. Call this whenever a block name changes
   * to keep all dependent data structures in sync.
   *
   * @param oldName  Previous name (before the edit)
   * @param newName  New name (after the edit)
   * @param context  'tree-node'  — a TreeNode in modelTree (instance rename)
   *                 'list-item' — a bullet item inside modelTextData (instance rename)
   *                 'concept'   — a concept-level block in TextEditor (concept rename)
   */
  const renameBlock = (
    oldName: string,
    newName: string,
    context: 'tree-node' | 'list-item' | 'concept'
  ) => {
    if (oldName === newName || !oldName || !newName) return;

    // ── 1. matrixValues keys ───────────────────────────────────────────
    // Keys are "MatrixName||Row||Col". Row/Col are instance names.
    const newMatrixValues: MatrixValues = {};
    for (const [key, val] of Object.entries(matrixValues.value)) {
      const parts = key.split('||');
      if (parts.length === 3) {
        const [matrixName, row, col] = parts;
        const newRow = row === oldName ? newName : row;
        const newCol = col === oldName ? newName : col;
        newMatrixValues[`${matrixName}||${newRow}||${newCol}`] = val;
      } else {
        newMatrixValues[key] = val;
      }
    }
    matrixValues.value = newMatrixValues;

    // ── 2. modelTextData inline markers ────────────────────────────────
    // Update <!-- block: X --> Y patterns where Y is the instance name
    if (context === 'list-item' || context === 'concept') {
      const escaped = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const blockRegex = new RegExp(
        `(<!--\\s*block:\\s*[^-]+\\s*-->)\\s*${escaped}`,
        'gi'
      );
      for (const [textKey, textVal] of Object.entries(modelTextData.value)) {
        if (blockRegex.test(textVal)) {
          blockRegex.lastIndex = 0;
          modelTextData.value[textKey] = textVal.replace(blockRegex, `$1 ${newName}`);
        }
      }
    }

    // ── 3. modelTextData header for concept blocks ─────────────────────
    if (context === 'concept') {
      const escaped = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const headerRegex = new RegExp(
        `^(#\\s*<!--\\s*block:\\s*concepts\\s*-->)\\s*${escaped}\\s*$`,
        'gim'
      );
      for (const [textKey, textVal] of Object.entries(modelTextData.value)) {
        if (headerRegex.test(textVal)) {
          headerRegex.lastIndex = 0;
          modelTextData.value[textKey] = textVal.replace(headerRegex, `$1 ${newName}`);
        }
      }
    }

    // ── 4. metamatrix source / target / name ───────────────────────────
    if (context === 'concept') {
      const slugOld = oldName.toLowerCase();
      const escapedOld = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      metamatrix.value.forEach(row => {
        if (row.source === oldName) row.source = newName;
        if (row.target === oldName) row.target = newName;
        // Hierarchy matrix names follow "${src}-${tgt} Hierarchy Matrix"
        if (row.name.toLowerCase().includes(slugOld)) {
          row.name = row.name.replace(new RegExp(escapedOld, 'gi'), newName);
        }
      });
    }

    // ── 5. nodeMarkers keys ────────────────────────────────────────────
    if (context === 'concept') {
      const oldKey = `concept:${slugify(oldName)}`;
      const newKey = `concept:${slugify(newName)}`;
      if (nodeMarkers.value[oldKey]) {
        if (!nodeMarkers.value[newKey]) {
          nodeMarkers.value[newKey] = nodeMarkers.value[oldKey];
        }
        delete nodeMarkers.value[oldKey];
      }
    }

    // ── 6. Wiki-links replacement in all descriptions and text data ────
    const escapedOldName = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wikiLinkRegex = new RegExp(`\\[\\[${escapedOldName}\\]\\]`, 'g');

    // Update in modelTextData
    for (const [textKey, textVal] of Object.entries(modelTextData.value)) {
      if (wikiLinkRegex.test(textVal)) {
        wikiLinkRegex.lastIndex = 0;
        modelTextData.value[textKey] = textVal.replace(wikiLinkRegex, `[[${newName}]]`);
      }
    }

    // Update in modelTree node descriptions recursively
    const updateTreeNodesWikiLinks = (nodes: TreeNode[]) => {
      nodes.forEach(n => {
        if (n.description && wikiLinkRegex.test(n.description)) {
          wikiLinkRegex.lastIndex = 0;
          n.description = n.description.replace(wikiLinkRegex, `[[${newName}]]`);
        }
        if (n.children && n.children.length > 0) {
          updateTreeNodesWikiLinks(n.children);
        }
      });
    };
    updateTreeNodesWikiLinks(modelTree.value);

    // ── 7. Reference field values in modelTree nodes ──────────────────
    const updateTreeNodesReferences = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        if (node.fields && Object.keys(node.fields).length > 0) {
          const concept = metamodelStore.getConceptByName(node.type);
          if (concept?.fields && Array.isArray(concept.fields)) {
            for (const fieldDef of concept.fields) {
              if (fieldDef.type === 'reference' && node.fields[fieldDef.name] === oldName) {
                node.fields[fieldDef.name] = newName;
              }
            }
          }
        }
        if (node.children?.length) {
          updateTreeNodesReferences(node.children);
        }
      }
    };
    updateTreeNodesReferences(modelTree.value);

    triggerUnsavedChanges();
  };

  // Node hierarchy operations
  const selectTreeNode = (node: TreeNode, type: string) => {
    selectedNode.value = node;
    selectedNodeType.value = type;
  };

  const addTreeRoot = () => {
    const rootConcept = metamodelStore.hierarchyConcepts[0];
    if (!rootConcept) return;
    const cleanName = rootConcept.endsWith('s') ? rootConcept.slice(0, -1) : rootConcept;
    const id = 'sh-' + generateId();
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
    const id = prefix + generateId();
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
    const concepts = metamodelStore.concepts.filter(c => c.type !== 'category');
    const firstConcept = concepts[0]?.name || '';
    const secondConcept = concepts[1]?.name || '';
    const newRow: MetamatrixRow = {
      name: 'New-Matrix',
      source: firstConcept,
      target: secondConcept,
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
    let options = optionsStr.split(';').map(o => o.trim());
    if (!options.includes('-')) {
      options = ['-', ...options];
    }
    const key = `${matrixName}||${rowName}||${colName}`;
    const currentVal = String(matrixValues.value[key] || '-');
    const currentIdx = options.indexOf(currentVal);
    const nextIdx = (currentIdx + 1) % options.length;
    matrixValues.value[key] = options[nextIdx];
    triggerUnsavedChanges();
  };

  const getColorClassesForShade = (colorName: string, intensity: 'strong' | 'medium-strong' | 'medium' | 'soft'): string => {
    const normColor = colorName.toLowerCase().trim();
    const shades: Record<string, Record<string, string>> = {
      red: {
        strong: 'bg-rose-600 text-white border-rose-600',
        'medium-strong': 'bg-rose-500 text-white border-rose-500',
        medium: 'bg-rose-400 text-white border-rose-400',
        soft: 'bg-rose-50 text-rose-700 border-rose-200'
      },
      green: {
        strong: 'bg-emerald-600 text-white border-emerald-600',
        'medium-strong': 'bg-emerald-500 text-white border-emerald-500',
        medium: 'bg-emerald-400 text-white border-emerald-400',
        soft: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      },
      blue: {
        strong: 'bg-blue-600 text-white border-blue-600',
        'medium-strong': 'bg-blue-500 text-white border-blue-500',
        medium: 'bg-blue-400 text-white border-blue-400',
        soft: 'bg-blue-50 text-blue-700 border-blue-200'
      },
      indigo: {
        strong: 'bg-indigo-600 text-white border-indigo-600',
        'medium-strong': 'bg-indigo-500 text-white border-indigo-500',
        medium: 'bg-indigo-400 text-white border-indigo-400',
        soft: 'bg-indigo-50 text-indigo-700 border-indigo-200'
      },
      orange: {
        strong: 'bg-orange-600 text-white border-orange-600',
        'medium-strong': 'bg-orange-500 text-white border-orange-500',
        medium: 'bg-orange-400 text-white border-orange-400',
        soft: 'bg-orange-50 text-orange-700 border-orange-200'
      },
      violet: {
        strong: 'bg-violet-600 text-white border-violet-600',
        'medium-strong': 'bg-violet-500 text-white border-violet-500',
        medium: 'bg-violet-400 text-white border-violet-400',
        soft: 'bg-violet-50 text-violet-700 border-violet-200'
      },
      amber: {
        strong: 'bg-amber-600 text-white border-amber-600',
        'medium-strong': 'bg-amber-500 text-white border-amber-500',
        medium: 'bg-amber-400 text-white border-amber-400',
        soft: 'bg-amber-50 text-amber-700 border-amber-200'
      },
      yellow: {
        strong: 'bg-yellow-600 text-white border-yellow-600',
        'medium-strong': 'bg-yellow-500 text-white border-yellow-500',
        medium: 'bg-yellow-400 text-white border-yellow-400',
        soft: 'bg-yellow-50 text-yellow-700 border-yellow-200'
      }
    };
    const colorShades = shades[normColor] || shades['blue'];
    return colorShades[intensity];
  };

  const getCycleBgColor = (val: any, minColor?: string, maxColor?: string, optionsStr?: string): string => {
    const cleanVal = String(val).trim();
    if (cleanVal === '-' || cleanVal === '' || cleanVal === 'none') {
      return 'bg-white text-slate-400 border-slate-200';
    }

    if (minColor && maxColor && optionsStr) {
      let options = optionsStr.split(';').map(o => o.trim());
      if (!options.includes('-')) {
        options = ['-', ...options];
      }
      const activeOptions = options.filter(o => o !== '-');
      const idx = activeOptions.findIndex(o => o.toLowerCase() === cleanVal.toLowerCase());
      if (idx !== -1) {
        const middle = Math.floor(activeOptions.length / 2);
        if (idx < middle) {
          const intensity = idx === 0 ? 'strong' : idx === 1 ? 'medium-strong' : idx === 2 ? 'medium' : 'soft';
          return getColorClassesForShade(maxColor, intensity);
        } else if (idx > middle) {
          const dist = activeOptions.length - 1 - idx;
          const intensity = dist === 0 ? 'strong' : dist === 1 ? 'medium-strong' : dist === 2 ? 'medium' : 'soft';
          return getColorClassesForShade(minColor, intensity);
        } else {
          return 'bg-slate-100 text-slate-700 border-slate-200';
        }
      }
    }

    const cleanValLower = cleanVal.toLowerCase();

    // Check if it's a number
    if (cleanValLower !== '' && !isNaN(Number(cleanValLower))) {
      const num = Number(cleanValLower);
      if (num <= 0) return 'bg-white text-slate-400 border-slate-200';
      if (num <= 1) return 'bg-white text-slate-900 border-slate-200';
      if (num <= 2) return 'bg-slate-200 text-slate-800 border-slate-300';
      if (num <= 3) return 'bg-slate-400 text-white border-slate-400';
      if (num <= 4) return 'bg-slate-600 text-white border-slate-600';
      return 'bg-slate-900 text-white border-slate-900';
    }

    // Semantic text matches for good/bad
    if (cleanValLower === 'good' || cleanValLower === 'ok' || cleanValLower === 'yes' || cleanValLower === 'success' || cleanValLower === 'completed' || cleanValLower === 'done' || cleanValLower === 'passed') {
      return 'bg-emerald-600 text-white border-emerald-600';
    }
    if (cleanValLower === 'bad' || cleanValLower === 'fail' || cleanValLower === 'failed' || cleanValLower === 'no' || cleanValLower === 'error') {
      return 'bg-rose-600 text-white border-rose-600';
    }

    // Grayscale semantic intensity scale
    if (cleanValLower === 'max' || cleanValLower === 'very high' || cleanValLower === 'extreme' || cleanValLower === 'critical') {
      return 'bg-slate-950 text-white border-slate-950';
    }
    if (cleanValLower === 'high' || cleanValLower === 'alto') {
      return 'bg-slate-900 text-white border-slate-900';
    }
    if (cleanValLower === 'slightly high' || cleanValLower === 'medium-high') {
      return 'bg-slate-600 text-white border-slate-600';
    }
    if (cleanValLower === 'medium' || cleanValLower === 'moderate' || cleanValLower === 'average' || cleanValLower === 'medio') {
      return 'bg-slate-400 text-white border-slate-400';
    }
    if (cleanValLower === 'slightly low' || cleanValLower === 'medium-low') {
      return 'bg-slate-200 text-slate-800 border-slate-300';
    }
    if (cleanValLower === 'low' || cleanValLower === 'bajo' || cleanValLower === 'very low' || cleanValLower === 'min') {
      return 'bg-white text-slate-900 border-slate-200';
    }
    if (cleanValLower === 'neutral' || cleanValLower === 'none' || cleanValLower === 'pending') {
      return 'bg-white text-slate-400 border-slate-200';
    }

    // Fallback/default minimal styling
    return 'bg-white text-slate-800 border-slate-200';
  };

  const getSetOptionsList = (paramsStr: string): string[] => {
    return paramsStr.split(';').map(o => o.trim());
  };

  const getBlockMatrixSummary = (blockName: string, conceptName: string) => {
    const results: { matrixName: string; matrixIndex: number; role: 'source' | 'target'; cells: { counterpart: string; value: string | number | boolean }[] }[] = [];

    for (let i = 0; i < metamatrix.value.length; i++) {
      const m = metamatrix.value[i];
      let role: 'source' | 'target' | null = null;
      let counterpartList: string[] = [];

      if (m.source === conceptName) {
        role = 'source';
        counterpartList = getMatrixColsList(m.target);
      } else if (m.target === conceptName) {
        role = 'target';
        counterpartList = getMatrixRowsList(m.source);
      }

      if (!role) continue;

      const cells: { counterpart: string; value: string | number | boolean }[] = [];
      for (const counterpart of counterpartList) {
        const row = role === 'source' ? blockName : counterpart;
        const col = role === 'source' ? counterpart : blockName;
        const key = `${m.name}||${row}||${col}`;
        const val = matrixValues.value[key];
        if (val !== undefined && val !== '-') {
          cells.push({ counterpart, value: val });
        }
      }

      if (cells.length > 0) {
        results.push({ matrixName: m.name, matrixIndex: i, role, cells });
      }
    }

    return results;
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
      modelVersion: modelVersion.value,
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
      content,
      workspaceStore.autoBackup
    );
    if (success) {
      unsavedChanges.value = false;
    }
  };

  /**
   * Increments the model's semantic version (§8.2) and saves it as a NEW
   * FORMAT-compliant file (§8.1), leaving the previous version untouched on
   * disk as real version history. The active file then points at the new one.
   */
  const saveActiveFileWithVersionBump = async (
    level: BumpLevel
  ): Promise<{ ok: boolean; error?: string; fileName?: string }> => {
    if (!workspaceStore.activeFileName || !workspaceStore.dirHandle) {
      return { ok: false, error: 'No active file or workspace connected.' };
    }
    const parsedName = parseFormatFilename(workspaceStore.activeFileName);
    if (!parsedName) {
      // Spec over tolerant code: do not invent a version for a non-compliant
      // name — surface the problem instead (§8.1).
      return {
        ok: false,
        error: `"${workspaceStore.activeFileName}" is not a FORMAT-compliant name (§8.1). Expected <Name>[_BM]_V_x-y-z_FORMAT.md.`
      };
    }

    const nextVersion = bumpVersion(parsedName.version, level);
    const nextFileName = buildFormatFilename(
      parsedName.baseName,
      parsedName.isBusinessModel,
      nextVersion
    );

    // Bump the in-memory version BEFORE serializing so frontmatter matches the
    // file name (§8.3 keeps both in sync).
    modelVersion.value = formatVersionString(nextVersion);
    const content = serializeActiveFile();

    const success = await workspaceStore.fs.saveFileContent(
      workspaceStore.dirHandle,
      nextFileName,
      content,
      workspaceStore.autoBackup
    );
    if (!success) {
      return { ok: false, error: 'Failed to write the new version file.' };
    }

    await workspaceStore.switchActiveFile(nextFileName);
    unsavedChanges.value = false;
    return { ok: true, fileName: nextFileName };
  };

  const loadDocumentation = async () => {
    try {
      let content = '';
      const name = templateName.value || 'business';
      const version = templateVersion.value || 'V_1-0-0';
      const docPath = `docs/templates/${name}/${version}/documentation.md`;

      // 1. Try reading from workspace if directory handle is present
      if (workspaceStore.dirHandle) {
        try {
          content = await workspaceStore.readWorkspaceFile(docPath);
        } catch (err) {
          console.warn(`Could not read documentation from workspace at ${docPath}`, err);
        }
      }

      // 2. Try fetching from dev server (Vite serves project root files in dev)
      if (!content) {
        try {
          const resp = await fetch(`/${docPath}`);
          if (resp.ok) content = await resp.text();
        } catch (e) {
          // not available via fetch
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
    renameBlock,
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
    getBlockMatrixSummary,
    getCleanPrompts,
    getActiveConceptGuidance,
    serializeActiveFile,
    saveActiveFile,
    saveActiveFileWithVersionBump,
    modelVersion,
    analysisScores,
    addEvaluatorScore,
    getKeyLatestScores,
    getKeyConsensus,
    loadDocumentation
  };
});
