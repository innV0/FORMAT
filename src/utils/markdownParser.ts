import { TreeNode, NodeMarkers, MetamatrixRow, MatrixValues, Concept, Marker, AnalysisScores, EvaluatorScore, LensEdge } from '../types';

/**
 * Parses a YAML-like indentation-based frontmatter block into a JS object.
 */
export function parseYaml(yamlStr: string): any {
  const lines = yamlStr.split(/\r?\n/);
  const root: any = {};
  
  const stack: Array<{ indent: number; key: string | null; data: any; type: 'object' | 'array' }> = [
    { indent: -1, key: null, data: root, type: 'object' }
  ];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    
    const indent = line.search(/\S/);
    
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    
    const parent = stack[stack.length - 1];
    
    if (trimmed.startsWith('-')) {
      // Element in an array
      if (parent.type !== 'array') {
        if (parent.key !== null) {
          const grandParent = stack[stack.length - 2];
          if (grandParent) {
            grandParent.data[parent.key] = [];
            parent.data = grandParent.data[parent.key];
            parent.type = 'array';
          }
        }
      }
      
      const rest = trimmed.substring(1).trim();
      if (rest === '') {
        const newObj = {};
        parent.data.push(newObj);
        stack.push({ indent: indent, key: null, data: newObj, type: 'object' });
      } else {
        const colonIdx = rest.indexOf(':');
        if (colonIdx !== -1) {
          const key = rest.substring(0, colonIdx).trim();
          const valStr = rest.substring(colonIdx + 1).trim();
          const val = parseYamlValue(valStr);
          
          const newObj = { [key]: val };
          parent.data.push(newObj);
          stack.push({ indent: indent, key: key, data: newObj, type: 'object' });
        } else {
          parent.data.push(parseYamlValue(rest));
        }
      }
    } else {
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx === -1) {
        continue;
      }
      
      const key = trimmed.substring(0, colonIdx).trim();
      const valStr = trimmed.substring(colonIdx + 1).trim();
      
      if (valStr === '') {
        parent.data[key] = {};
        stack.push({ indent: indent, key: key, data: parent.data[key], type: 'object' });
      } else {
        parent.data[key] = parseYamlValue(valStr);
      }
    }
  }
  
  return root;
}

function parseYamlValue(valStr: string): any {
  valStr = valStr.trim();
  if (valStr.includes('#') && !valStr.startsWith('"') && !valStr.startsWith("'")) {
    valStr = valStr.split('#')[0].trim();
  }
  if ((valStr.startsWith('"') && valStr.endsWith('"')) || (valStr.startsWith("'") && valStr.endsWith("'"))) {
    return valStr.substring(1, valStr.length - 1);
  }
  if (valStr.toLowerCase() === 'null') {
    return null;
  }
  if (valStr.toLowerCase() === 'true') {
    return true;
  }
  if (valStr.toLowerCase() === 'false') {
    return false;
  }
  if (valStr !== '' && !isNaN(Number(valStr))) {
    return Number(valStr);
  }
  return valStr;
}

/**
 * Stringifies a JS object into YAML format.
 */
export function stringifyYaml(obj: any, indent: number = 0): string {
  const spaces = ' '.repeat(indent);
  if (obj === null) return 'null';
  if (typeof obj === 'boolean' || typeof obj === 'number') return String(obj);
  if (typeof obj === 'string') {
    return `"${obj.replace(/"/g, '\\"')}"`;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return obj.map(item => {
      if (typeof item === 'object' && item !== null) {
        const keys = Object.keys(item);
        const firstKey = keys[0];
        const firstVal = stringifyYaml(item[firstKey], 0);
        let res = `${spaces}- ${firstKey}: ${firstVal}\n`;
        for (let i = 1; i < keys.length; i++) {
          const k = keys[i];
          const val = item[k];
          if (typeof val === 'object' && val !== null) {
            if (Array.isArray(val) && val.length === 0) {
              res += `${spaces}  ${k}: []\n`;
            } else if (!Array.isArray(val) && Object.keys(val).length === 0) {
              res += `${spaces}  ${k}: {}\n`;
            } else {
              res += `${spaces}  ${k}:\n${stringifyYaml(val, indent + 4)}\n`;
            }
          } else {
            const v = stringifyYaml(val, 0);
            res += `${spaces}  ${k}: ${v}\n`;
          }
        }
        return res.trimEnd();
      } else {
        return `${spaces}- ${stringifyYaml(item, 0)}`;
      }
    }).join('\n');
  }
  if (typeof obj === 'object') {
    return Object.entries(obj).map(([k, v]) => {
      if (typeof v === 'object' && v !== null) {
        if (Array.isArray(v) && v.length === 0) {
          return `${spaces}${k}: []`;
        }
        if (!Array.isArray(v) && Object.keys(v).length === 0) {
          return `${spaces}${k}: {}`;
        }
        return `${spaces}${k}:\n${stringifyYaml(v, indent + 2)}`;
      } else {
        return `${spaces}${k}: ${stringifyYaml(v, 0)}`;
      }
    }).join('\n');
  }
  return '';
}

/**
 * Parses node instances and their multi-line descriptions from markdown content.
 */
export interface ParsedInstance {
  type: string;
  name: string;
  description: string;
  fields?: Record<string, any>;
}

export function parseNodeInstances(text: string): ParsedInstance[] {
  const lines = text.split(/\r?\n/);
  const instances: ParsedInstance[] = [];
  
  let currentInstance: ParsedInstance | null = null;
  let descriptionLines: string[] = [];
  let parsingFields = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Match optional * or - followed by <!-- block: [type] --> then the name
    const markerMatch = line.match(/^[-*]?\s*<!--\s*block:\s*([a-zA-Z0-9_\s-]+)\s*-->\s*(.*)$/i);
    
    if (markerMatch) {
      if (currentInstance) {
        currentInstance.description = descriptionLines.join('\n').trim();
        instances.push(currentInstance);
        descriptionLines = [];
      }
      
      const type = markerMatch[1].trim();
      const rawName = markerMatch[2].trim();
      
      // Strip formatting: **, *, __, [[, ]]
      const name = rawName.replace(/\*\*|\*|__|\[\[|\]\]/g, '').trim();
      
      currentInstance = { type, name, description: '', fields: {} };
      parsingFields = true;
    } else {
      if (trimmed.startsWith('#') || trimmed.includes('<!-- block:')) {
        if (currentInstance) {
          currentInstance.description = descriptionLines.join('\n').trim();
          instances.push(currentInstance);
          currentInstance = null;
          descriptionLines = [];
        }
        parsingFields = false;
      } else {
        if (currentInstance) {
          if (parsingFields) {
            if (trimmed === '') {
              // skip blank lines during fields parsing
            } else {
              const fieldMatch = line.match(/^\s*[-*]\s*([a-zA-Z0-9_-]+)\s*:\s*(.*)$/);
              if (fieldMatch) {
                const key = fieldMatch[1].trim();
                const value = fieldMatch[2].trim();
                currentInstance.fields = currentInstance.fields || {};
                currentInstance.fields[key] = parseYamlValue(value);
              } else {
                parsingFields = false;
                descriptionLines.push(line);
              }
            }
          } else {
            descriptionLines.push(line);
          }
        }
      }
    }
  }
  
  if (currentInstance) {
    currentInstance.description = descriptionLines.join('\n').trim();
    instances.push(currentInstance);
  }
  
  return instances;
}

/**
 * Parses a Markdown table block into an array of objects.
 */
export function parseMarkdownTable(md: string): Array<Record<string, string>> {
  const lines = md.split('\n').map(l => l.trim()).filter(l => l.startsWith('|'));
  if (lines.length < 3) return [];
  
  const headers = lines[0].split('|').map(h => h.trim()).filter((h, idx, arr) => {
    if (idx === 0 || idx === arr.length - 1) return h !== '';
    return true;
  });
  const data: Array<Record<string, string>> = [];
  
  for (let i = 2; i < lines.length; i++) {
    const cells = lines[i].split('|').map(c => c.trim()).filter((c, idx, arr) => {
      if (idx === 0 || idx === arr.length - 1) return c !== '';
      return true;
    });
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = cells[idx] || '';
    });
    data.push(obj);
  }
  return data;
}

/**
 * Parses a full Markdown model content into application state values.
 */
export function parseMarkdownModel(content: string, conceptsList: Concept[], metamatrixList?: MetamatrixRow[]) {
  const parsed = {
    metamodelPath: null as string | null,
    title: '',
    formatVersion: '',
    specificationUrl: '',
    documentationLocation: '',
    templateName: '',
    templateVersion: '',
    lastSaved: '',
    matrixValues: {} as MatrixValues,
    modelTextData: {} as Record<string, string>,
    metamatrix: [] as MetamatrixRow[],
    nodeMarkers: {} as NodeMarkers,
    modelTree: [] as TreeNode[],
    analysisScores: {} as AnalysisScores,
    taxonomyEdges: null as LensEdge[] | null,
    hierarchyConcepts: null as string[] | null,
    metamodel: null as {
      title?: string;
      last_updated?: string;
      concepts?: Concept[];
      markers?: Marker[];
      matrices?: any[];
    } | null
  };

  if (metamatrixList) {
    parsed.metamatrix.push(...metamatrixList);
  }

  const fmMatch = content.match(/^---\r?\n([\s\S]+?)\r?\n---/);
  if (fmMatch) {
    let frontmatter: any;
    try {
      frontmatter = parseYaml(fmMatch[1]);
    } catch (e) {
      console.error("YAML PARSE FAILURE CONTENT:\n", fmMatch[1]);
      throw e;
    }
    let templateFm = frontmatter.template;
    if (templateFm) {
      if (typeof templateFm === 'string') {
        parsed.metamodelPath = templateFm;
      } else {
        parsed.metamodelPath = templateFm.path || null;
        if (templateFm.name) {
          parsed.templateName = String(templateFm.name);
        }
        if (templateFm.version) {
          parsed.templateVersion = String(templateFm.version);
        }
        if (Array.isArray(templateFm.concepts)) {
          conceptsList = templateFm.concepts as Concept[];
        }
        parsed.metamodel = templateFm;
        if (Array.isArray(templateFm.matrices)) {
          templateFm.matrices.forEach((m: any) => {
            parsed.metamatrix.push({
              name: m.name,
              source: m.source,
              target: m.target,
              widgetType: m.widgetType || 'cycle',
              params: m.params || m.values || ''
            });
          });
        }
      }
    }
    if (frontmatter.title) {
      parsed.title = frontmatter.title;
    }
    if (frontmatter.format_version) {
      parsed.formatVersion = String(frontmatter.format_version);
    } else if (frontmatter.specification_version) {
      parsed.formatVersion = String(frontmatter.specification_version);
    }
    if (frontmatter.specification_url) {
      parsed.specificationUrl = String(frontmatter.specification_url);
    }
    if (frontmatter.documentation_location) {
      parsed.documentationLocation = String(frontmatter.documentation_location);
    }
    if (frontmatter.last_saved) {
      parsed.lastSaved = frontmatter.last_saved;
    }
  }

  const sections = content.split(/^#\s+/gm);

  const matrixValues: MatrixValues = parsed.matrixValues;
  const modelTextData: Record<string, string> = parsed.modelTextData;
  const metamatrix: MetamatrixRow[] = parsed.metamatrix;
  const nodeMarkers: NodeMarkers = parsed.nodeMarkers;
  const parsedTree: TreeNode[] = parsed.modelTree;

  // Pre-pass: scan sections for the concept-taxonomy hierarchy matrix so we can
  // use its edges when deriving the instance Chain (hierarchyConcepts).
  const cleanSectionTitle = (t: string): string => {
    const conceptMatch = t.match(/<!--\s*block:\s*concepts\s*-->\s*(.*)/i);
    if (conceptMatch) return conceptMatch[1].trim();
    const matrixMatch = t.match(/<!--\s*block:\s*matrices\s*-->\s*(.*)/i);
    if (matrixMatch) return matrixMatch[1].trim();
    return t;
  };

  // Normalize a raw name from a taxonomy matrix to the canonical concept name
  // (case-insensitive match against the concept list). Falls back to the raw name
  // as-is when no concept matches — preserves edges for category nodes too.
  const normalizeTaxonomyName = (rawName: string): string => {
    const lower = rawName.toLowerCase();
    const match = conceptsList.find(c => c.name.toLowerCase() === lower);
    return match ? match.name : rawName;
  };

  for (const sec of sections) {
    const lines = sec.split(/\r?\n/);
    const titleText = lines[0].trim();
    if (!titleText) continue;
    const secName = cleanSectionTitle(titleText).toLowerCase();
    if (secName === 'concept-taxonomy hierarchy matrix') {
      const body = lines.slice(1).join('\n').trim();
      const table = parseMarkdownTable(body);
      const edges: LensEdge[] = [];
      table.forEach(row => {
        const firstKey = Object.keys(row)[0] || '';
        const rawParent = (row[firstKey] || '').replace(/\*\*|\*|__/g, '').trim();
        const parentName = normalizeTaxonomyName(rawParent);
        if (!parentName) return;
        Object.entries(row).forEach(([colKey, val]) => {
          const rawCol = colKey.replace(/\*\*|\*|__/g, '').trim();
          if (rawCol.toLowerCase() !== firstKey.toLowerCase() && val === 'X') {
            edges.push({ parent: parentName, child: normalizeTaxonomyName(rawCol) });
          }
        });
      });
      if (edges.length > 0) {
        parsed.taxonomyEdges = edges;
      }
      break;
    }
  }

  // Derive hierarchyConcepts (Chain) from taxonomy edges and concept types.
  // The Chain is the sequence of non-category concepts linked parent→child
  // through the taxonomy, where the chain root's parent is a category concept.
  const preTaxEdges: LensEdge[] = parsed.taxonomyEdges || [];
  const conceptNameSet = new Set(conceptsList.filter(c => c.type !== 'category').map(c => c.name));
  const categoryNameSet = new Set(conceptsList.filter(c => c.type === 'category').map(c => c.name));

  const parentMap = new Map<string, string>();
  preTaxEdges.forEach(e => {
    if (conceptNameSet.has(e.child) && conceptNameSet.has(e.parent)) {
      parentMap.set(e.child, e.parent);
    }
  });

  const chains: string[][] = [];
  conceptsList.filter(c => c.type !== 'category' && c.type !== null).forEach(c => {
    const hasChildren = Array.from(parentMap.values()).includes(c.name);
    const taxonomyParents = preTaxEdges.filter(e => e.child === c.name).map(e => e.parent);
    const parentIsCategory = taxonomyParents.length === 0 || taxonomyParents.some(p => categoryNameSet.has(p));
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

  let hierarchyConcepts: string[] = ['Stakeholders', 'Segments', 'Profiles', 'Persona'];
  if (chains.length > 0) {
    const chainRoot = chains[0][0];
    // Sibling-prepend: find non-category concepts that share a category parent with
    // the chain root but are NOT themselves in the chain (e.g. Stakeholders shares
    // "Market" with Segments but has no concept-type children → excluded from chain).
    const chainRootCategoryParents = preTaxEdges
      .filter(e => e.child === chainRoot && categoryNameSet.has(e.parent))
      .map(e => e.parent);
    const siblings: string[] = [];
    if (chainRootCategoryParents.length > 0) {
      conceptsList
        .filter(c => c.type !== 'category' && c.type !== null && !chains[0].includes(c.name))
        .forEach(c => {
          const parentsOfC = preTaxEdges.filter(e => e.child === c.name).map(e => e.parent);
          const sharesCategoryParent = parentsOfC.some(p => chainRootCategoryParents.includes(p));
          if (sharesCategoryParent) {
            siblings.push(c.name);
          }
        });
    }
    hierarchyConcepts = [...siblings, ...chains[0]];
  }

  hierarchyConcepts = hierarchyConcepts.map(hc => {
    const found = conceptsList.find(c => c.name.toLowerCase() === hc.toLowerCase());
    return found ? found.name : hc;
  });

  // Pre-generate expected hierarchy matrices name list
  const hierarchyMatrixPairs: { name: string, source: string, target: string }[] = [];
  for (let i = 0; i < hierarchyConcepts.length - 1; i++) {
    const src = hierarchyConcepts[i];
    const tgt = hierarchyConcepts[i+1];
    hierarchyMatrixPairs.push({
      name: `${src}-${tgt} Hierarchy Matrix`,
      source: src,
      target: tgt
    });
  }

  // Helper to find node by name in the tree
  const findNodeByName = (nodes: TreeNode[], name: string): TreeNode | null => {
    const clean = (s: string) => s.replace(/\*\*|\*|__|\[\[|\]\]/g, '').trim().toLowerCase();
    for (const n of nodes) {
      if (clean(n.name) === clean(name)) return n;
      if (n.children && n.children.length) {
        const found = findNodeByName(n.children, name);
        if (found) return found;
      }
    }
    return null;
  };

  const cleanTitle = (title: string): { name: string; type: 'concept' | 'matrix' | 'unknown' } => {
    const conceptMatch = title.match(/<!--\s*block:\s*concepts\s*-->\s*(.*)/i);
    if (conceptMatch) {
      return { name: conceptMatch[1].trim(), type: 'concept' };
    }
    const matrixMatch = title.match(/<!--\s*block:\s*matrices\s*-->\s*(.*)/i);
    if (matrixMatch) {
      return { name: matrixMatch[1].trim(), type: 'matrix' };
    }
    return { name: title, type: 'unknown' };
  };

  sections.forEach(sec => {
    const lines = sec.split(/\r?\n/);
    const titleText = lines[0].trim();
    const body = lines.slice(1).join('\n').trim();
    
    if (!titleText) return;
    
    const cleaned = cleanTitle(titleText);
    const name = cleaned.name;
    const nameLower = name.toLowerCase();
    
    if (nameLower === 'concept-taxonomy hierarchy matrix') {
      // Parse taxonomy edges from sparse X-table (parent→children).
      // Re-use the pre-pass result if already populated to avoid double-parsing.
      if (!parsed.taxonomyEdges) {
        const table = parseMarkdownTable(body);
        const edges: LensEdge[] = [];
        table.forEach(row => {
          const firstKey = Object.keys(row)[0] || '';
          const rawParent = (row[firstKey] || '').replace(/\*\*|\*|__/g, '').trim();
          const parentName = normalizeTaxonomyName(rawParent);
          if (!parentName) return;
          Object.entries(row).forEach(([colKey, val]) => {
            const rawCol = colKey.replace(/\*\*|\*|__/g, '').trim();
            if (rawCol.toLowerCase() !== firstKey.toLowerCase() && val === 'X') {
              edges.push({ parent: parentName, child: normalizeTaxonomyName(rawCol) });
            }
          });
        });
        if (edges.length > 0) {
          parsed.taxonomyEdges = edges;
        }
      }
    }
    else if (nameLower === 'metamatrix') {
      parseMarkdownTable(body).forEach(row => {
        const matrixName = row['Matrix Name'] || row['Nombre de la matriz'] || '';
        if (matrixName && !metamatrix.some(m => m.name.toLowerCase() === matrixName.toLowerCase())) {
          let p = row['Widget Parameters'] || row['Parámetros del widget'] || '';
          if (p === '-') p = '';
          let w = (row['Widget Type'] || row['Tipo de widget']) as any || 'cycle';
          if (w === '-') w = 'cycle';
          metamatrix.push({
            name: matrixName,
            source: row['Source'] || row['Origen'] || '',
            target: row['Target'] || row['Destino'] || '',
            widgetType: w,
            params: p
          });
        }
      });
    }
    else {
      const matchedPair = hierarchyMatrixPairs.find(p => p.name.toLowerCase() === nameLower);
      if (matchedPair) {
        const source = matchedPair.source;
        const target = matchedPair.target;
        const table = parseMarkdownTable(body);
        table.forEach(row => {
          const colHeader = `${source} \\ ${target}`;
          const rowKey = Object.keys(row).find(k => k.toLowerCase() === colHeader.toLowerCase() || k.toLowerCase() === `${source.toLowerCase()} \\ ${target.toLowerCase()}`) || Object.keys(row)[0] || '';
          const rawSourceName = row[rowKey] || '';
          const sourceName = rawSourceName.replace(/\*\*|\*|__/g, '').trim();
          
          if (source === hierarchyConcepts[0]) {
            let parentNode = parsedTree.find(item => item.name.replace(/\*\*|\*|__/g, '').trim().toLowerCase() === sourceName.toLowerCase());
            if (!parentNode) {
              parentNode = { id: 'sh-' + Math.random().toString(36).substr(2, 9), name: sourceName, type: source, description: '', children: [] };
              parsedTree.push(parentNode);
            }
            
            Object.entries(row).forEach(([colKey, val]) => {
              const cleanColKey = colKey.replace(/\*\*|\*|__/g, '').trim();
              if (cleanColKey.toLowerCase() !== rowKey.toLowerCase() && val === 'X') {
                if (!parentNode!.children.some(c => c.name.replace(/\*\*|\*|__/g, '').trim().toLowerCase() === cleanColKey.toLowerCase())) {
                  parentNode!.children.push({
                    id: 'seg-' + Math.random().toString(36).substr(2, 9),
                    name: cleanColKey,
                    type: target,
                    description: '',
                    children: []
                  });
                }
              }
            });
          } else {
            let foundParent = findNodeByName(parsedTree, sourceName);
            if (foundParent) {
              const prefix = target.substring(0, 3).toLowerCase() + '-';
              Object.entries(row).forEach(([colKey, val]) => {
                const cleanColKey = colKey.replace(/\*\*|\*|__/g, '').trim();
                if (cleanColKey.toLowerCase() !== rowKey.toLowerCase() && val === 'X') {
                  if (!foundParent!.children.some(c => c.name.replace(/\*\*|\*|__/g, '').trim().toLowerCase() === cleanColKey.toLowerCase())) {
                    foundParent!.children.push({
                      id: prefix + Math.random().toString(36).substr(2, 9),
                      name: cleanColKey,
                      type: target,
                      description: '',
                      children: []
                    });
                  }
                }
              });
            }
          }
        });
      }
      else if (nameLower === 'item-markers matrix') {
        const table = parseMarkdownTable(body);
        table.forEach(row => {
          const itemKey = Object.keys(row).find(k => k.toLowerCase() === 'item \\ marker') || Object.keys(row)[0] || '';
          const nodeName = (row[itemKey] || '').replace(/\*\*|\*|__/g, '').trim();
          if (!nodeName) return;
          
          // Concept-block rows carry their raw `concept:<slug>` id as the label;
          // use it directly instead of resolving against the hierarchy tree.
          const isConceptRow = nodeName.toLowerCase().startsWith('concept:');
          const node = isConceptRow ? null : findNodeByName(parsedTree, nodeName);
          const nodeId = node ? node.id : nodeName;
          
          if (!nodeMarkers[nodeId]) {
            nodeMarkers[nodeId] = {};
          }
          Object.entries(row).forEach(([marker, val]) => {
            if (marker.toLowerCase() !== itemKey.toLowerCase()) {
              nodeMarkers[nodeId][marker] = parseInt(val) || 0;
            }
          });
        });
      }
      else if (metamatrix.some(m => m.name.toLowerCase() === nameLower)) {
        const foundMat = metamatrix.find(m => m.name.toLowerCase() === nameLower)!;
        const table = parseMarkdownTable(body);
        table.forEach(row => {
          const rawRowName = row[Object.keys(row)[0]] || '';
          const rowName = rawRowName.replace(/\*\*|\*|__/g, '').trim();
          Object.entries(row).forEach(([colName, cellVal]) => {
            const cleanColName = colName.replace(/\*\*|\*|__/g, '').trim();
            if (cleanColName !== Object.keys(row)[0] && cellVal !== '-') {
              let typedVal: string | number | boolean = cellVal;
              if (cellVal === 'true') typedVal = true;
              else if (cellVal === 'false') typedVal = false;
              else if (!isNaN(Number(cellVal)) && cellVal.trim() !== '') typedVal = Number(cellVal);
              
              matrixValues[`${foundMat.name}||${rowName}||${cleanColName}`] = typedVal;
            }
          });
        });
      }
      else if (nameLower === 'analysis evaluations') {
        const table = parseMarkdownTable(body);
        table.forEach(row => {
          const keyName = row['Target'] || row['Objetivo'] || '';
          if (!keyName) return;
          const scoreRecord = {
            timestamp: row['Timestamp'] || new Date().toISOString(),
            evaluator_id: row['Evaluator'] || row['Evaluador'] || 'unknown',
            evaluator_type: ((row['Evaluator'] || row['Evaluador'] || '').toLowerCase().startsWith('ai')) ? 'ai' as const : 'human' as const,
            score: Number(row['Score'] || row['Puntuación']) || 1,
            comment: row['Comments'] || row['Comentarios'] || ''
          };
          if (!(parsed as any).analysisScores) {
            (parsed as any).analysisScores = {};
          }
          if (!(parsed as any).analysisScores[keyName]) {
            (parsed as any).analysisScores[keyName] = [];
          }
          (parsed as any).analysisScores[keyName].push(scoreRecord);
        });
      }
      else {
        const matchingConcept = conceptsList.find(c => c.name.toLowerCase() === nameLower);
        const storedKey = matchingConcept ? matchingConcept.name : name;
        modelTextData[storedKey] = '# ' + sec;
      }
    }
  });

  const parseDescriptionsFromText = (conceptName: string, nodes: TreeNode[]) => {
    const actualKey = Object.keys(modelTextData).find(k => k.toLowerCase() === conceptName.toLowerCase());
    if (!actualKey) return;
    let textSec = modelTextData[actualKey];
    
    if (textSec.includes('<!-- block:')) {
      const instances = parseNodeInstances(textSec);
      instances.forEach(inst => {
        let node = findNodeByName(nodes, inst.name);
        
        if (!node) {
          const actualType = hierarchyConcepts.find(hc => hc.toLowerCase() === inst.type.toLowerCase()) || conceptName;
          if (actualType === hierarchyConcepts[0]) {
            node = {
              id: 'sh-' + Math.random().toString(36).substr(2, 9),
              name: inst.name,
              type: actualType,
              description: inst.description,
              fields: inst.fields || {},
              children: []
            };
            parsedTree.push(node);
          } else {
            const childIdx = hierarchyConcepts.indexOf(actualType);
            if (childIdx > 0) {
              const parentType = hierarchyConcepts[childIdx - 1];
              const findParentNodeOfType = (nodesList: TreeNode[], typeName: string): TreeNode | null => {
                for (const n of nodesList) {
                  if (n.type === typeName) return n;
                  if (n.children && n.children.length) {
                    const found = findParentNodeOfType(n.children, typeName);
                    if (found) return found;
                  }
                }
                return null;
              };
              const parentNode = findParentNodeOfType(parsedTree, parentType);
              if (parentNode) {
                const prefix = actualType.substring(0, 3).toLowerCase() + '-';
                node = {
                  id: prefix + Math.random().toString(36).substr(2, 9),
                  name: inst.name,
                  type: actualType,
                  description: inst.description,
                  fields: inst.fields || {},
                  children: []
                };
                parentNode.children.push(node);
              }
            }
          }
        }
        
        if (node) {
          node.description = inst.description;
          node.fields = inst.fields || {};
        }
      });
    } else {
      const headerPrefix = `# ${conceptName}`;
      if (textSec.startsWith(headerPrefix)) {
        textSec = textSec.substring(headerPrefix.length).trim();
      }
      
      const addMissingNode = (name: string, desc: string) => {
        const actualType = hierarchyConcepts.find(hc => hc.toLowerCase() === conceptName.toLowerCase()) || conceptName;
        if (actualType === hierarchyConcepts[0]) {
          const node = {
            id: 'sh-' + Math.random().toString(36).substr(2, 9),
            name: name,
            type: actualType,
            description: desc,
            children: []
          };
          parsedTree.push(node);
        } else {
          const childIdx = hierarchyConcepts.indexOf(actualType);
          if (childIdx > 0) {
            const parentType = hierarchyConcepts[childIdx - 1];
            const findParentNodeOfType = (nodesList: TreeNode[], typeName: string): TreeNode | null => {
              for (const n of nodesList) {
                if (n.type === typeName) return n;
                if (n.children && n.children.length) {
                  const found = findParentNodeOfType(n.children, typeName);
                  if (found) return found;
                }
              }
              return null;
            };
            const parentNode = findParentNodeOfType(parsedTree, parentType);
            if (parentNode) {
              const prefix = actualType.substring(0, 3).toLowerCase() + '-';
              const node = {
                id: prefix + Math.random().toString(36).substr(2, 9),
                name: name,
                type: actualType,
                description: desc,
                children: []
              };
              parentNode.children.push(node);
            }
          }
        }
      };
      
      const lines = textSec.split('\n');
      lines.forEach(line => {
        const bulletMatch = line.match(/^[-*]\s+\*\*?([^*:]+)\*\*?:?\s*(.*)$/);
        if (bulletMatch) {
          const name = bulletMatch[1].trim();
          const desc = bulletMatch[2].trim();
          const node = findNodeByName(nodes, name);
          if (node) {
            node.description = desc;
          } else {
            addMissingNode(name, desc);
          }
        } else {
          const simpleBulletMatch = line.match(/^[-*]\s+([^:]+?)\s*:\s*(.*)$/);
          if (simpleBulletMatch) {
            const name = simpleBulletMatch[1].trim();
            const desc = simpleBulletMatch[2].trim();
            const node = findNodeByName(nodes, name);
            if (node) {
              node.description = desc;
            } else {
              addMissingNode(name, desc);
            }
          }
        }
      });
    }
  };

  hierarchyConcepts.forEach(concept => {
    parseDescriptionsFromText(concept, parsedTree);
  });

  parsed.hierarchyConcepts = hierarchyConcepts;
  return parsed;
}

/**
 * Serializes state values back into Markdown format.
 */
export function generateMarkdownFileContent(params: {
  activeFileName: string;
  metamodelPath?: string;
  formatVersion?: string;
  specificationUrl?: string;
  documentationLocation?: string;
  templateName?: string;
  templateVersion?: string;
  modelTextData: Record<string, string>;
  modelTree: TreeNode[];
  nodeMarkers: NodeMarkers;
  markers: Marker[];
  metamatrix: MetamatrixRow[];
  matrixValues: MatrixValues;
  concepts: Concept[];
  taxonomyEdges?: LensEdge[];
  analysisScores?: AnalysisScores;
  getMatrixRowsList: (source: string, tree: TreeNode[]) => string[];
  getMatrixColsList: (target: string) => string[];
}): string {
  const isFlatFormat = !params.metamodelPath;
  const title = params.activeFileName.replace('.md', '');
  const lastSaved = new Date().toISOString();
  
  let md = '';
  if (!isFlatFormat) {
    md = `---
template:
  name: "${params.templateName || "business"}"
  version: "${params.templateVersion || "V_1-0-0"}"
  path: "${params.metamodelPath}"
title: "${title}"
${params.formatVersion ? `format_version: "${params.formatVersion}"\n` : ''}${params.specificationUrl ? `specification_url: "${params.specificationUrl}"\n` : ''}${params.documentationLocation ? `documentation_location: "${params.documentationLocation}"\n` : ''}last_saved: "${lastSaved}"
---

`;
  } else {
    const inlineTemplate = {
      name: params.templateName || "business",
      version: params.templateVersion || "V_1-0-0",
      title: "FORMAT Template",
      last_updated: lastSaved,
      concepts: params.concepts.map(c => {
        const copy = { ...c } as any;
        delete copy.description;
        delete copy.methodologies;
        delete copy.prompts;
        delete copy.summary;
        delete copy.emoji; // legacy field; icon is the canonical visual
        return copy;
      }),
      markers: params.markers.map(m => {
        const copy = { ...m } as any;
        delete copy.description;
        delete copy.guidelines;
        delete copy.examples_high_score;
        delete copy.examples_low_score;
        delete copy.emoji; // legacy field; icon is the canonical visual
        return copy;
      }),
      matrices: params.metamatrix.map(m => {
        const row: any = {
          name: m.name,
          source: m.source,
          target: m.target
        };
        if (m.widgetType && m.widgetType !== 'cycle') {
          row.widgetType = m.widgetType;
        }
        if (m.params) {
          row.params = m.params;
        }
        return row;
      })
    };
    md = `---
${params.formatVersion ? `format_version: "${params.formatVersion}"\n` : ''}${params.specificationUrl ? `specification_url: "${params.specificationUrl}"\n` : ''}${params.documentationLocation ? `documentation_location: "${params.documentationLocation}"\n` : ''}template:
${stringifyYaml(inlineTemplate, 2)}
title: "${title}"
last_saved: "${lastSaved}"
---

`;
  }
  const updatedModelTextData = { ...params.modelTextData };
  const cleanName = (n: string) => n.replace(/\*\*|\*|__/g, '').trim();

  // Derive hierarchyConcepts (Chain) from taxonomy edges and concept types.
  // The Chain is the sequence of non-category concepts linked parent→child
  // through the taxonomy, where the chain root's parent is a category concept.
  const list = params.concepts;
  const taxEdges = params.taxonomyEdges || [];
  const conceptNames = new Set(list.filter(c => c.type !== 'category').map(c => c.name));
  const categoryNames = new Set(list.filter(c => c.type === 'category').map(c => c.name));

  // Build parentMap for concept→concept edges (both non-category)
  const parentMap = new Map<string, string>();
  taxEdges.forEach(e => {
    if (conceptNames.has(e.child) && conceptNames.has(e.parent)) {
      parentMap.set(e.child, e.parent);
    }
  });

  const genChains: string[][] = [];
  list.filter(c => c.type !== 'category' && c.type !== null).forEach(c => {
    const hasChildren = Array.from(parentMap.values()).includes(c.name);
    const taxonomyParents = taxEdges.filter(e => e.child === c.name).map(e => e.parent);
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
      genChains.push(chain);
    }
  });

  let hierarchyConcepts: string[] = ['Stakeholders', 'Segments', 'Profiles', 'Persona'];
  if (genChains.length > 0) {
    const genChainRoot = genChains[0][0];
    // Sibling-prepend: same logic as parseMarkdownModel.
    const genChainRootCategoryParents = taxEdges
      .filter(e => e.child === genChainRoot && categoryNames.has(e.parent))
      .map(e => e.parent);
    const genSiblings: string[] = [];
    if (genChainRootCategoryParents.length > 0) {
      list
        .filter(c => c.type !== 'category' && c.type !== null && !genChains[0].includes(c.name))
        .forEach(c => {
          const parentsOfC = taxEdges.filter(e => e.child === c.name).map(e => e.parent);
          const sharesCategoryParent = parentsOfC.some(p => genChainRootCategoryParents.includes(p));
          if (sharesCategoryParent) {
            genSiblings.push(c.name);
          }
        });
    }
    hierarchyConcepts = [...genSiblings, ...genChains[0]];
  }

  hierarchyConcepts = hierarchyConcepts.map(hc => {
    const found = list.find(c => c.name.toLowerCase() === hc.toLowerCase());
    return found ? found.name : hc;
  });

  const hierarchyMatrixPairs: { name: string, source: string, target: string }[] = [];
  for (let i = 0; i < hierarchyConcepts.length - 1; i++) {
    const src = hierarchyConcepts[i];
    const tgt = hierarchyConcepts[i+1];
    hierarchyMatrixPairs.push({
      name: `${src}-${tgt} Hierarchy Matrix`,
      source: src,
      target: tgt
    });
  }

  const getNodesAtLevel = (conceptName: string): TreeNode[] => {
    const result: TreeNode[] = [];
    const visit = (nodes: TreeNode[]) => {
      nodes.forEach(n => {
        if (n.type === conceptName) {
          result.push(n);
        }
        if (n.children) visit(n.children);
      });
    };
    visit(params.modelTree);
    return result;
  };

  hierarchyConcepts.forEach(concept => {
    let text = '';
    if (isFlatFormat) {
      const conceptLower = concept.toLowerCase();
      text = `# <!-- block: concepts --> ${conceptLower}\n\n`;
      getNodesAtLevel(concept).forEach(node => {
        text += `* <!-- block: ${conceptLower} --> ${node.name}\n`;
        let hasFields = false;
        if (node.fields && Object.keys(node.fields).length > 0) {
          Object.entries(node.fields).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') {
              text += `  - ${k}: ${stringifyYaml(v, 0)}\n`;
              hasFields = true;
            }
          });
        }
        if (node.description) {
          if (hasFields) {
            text += '\n';
          }
          text += node.description + '\n';
        }
        text += '\n';
      });
    } else {
      text = `# ${concept}\n`;
      getNodesAtLevel(concept).forEach(node => {
        text += `- ${node.name}${node.description ? ': ' + node.description : ''}\n`;
      });
    }
    updatedModelTextData[concept] = text.trim();
  });

  params.concepts.forEach(c => {
    if (c.type !== 'category') {
      if (hierarchyConcepts.includes(c.name)) {
        const content = updatedModelTextData[c.name]?.trim();
        if (content) {
          md += content + '\n\n';
        }
      } else if (updatedModelTextData[c.name] !== undefined) {
        let content = updatedModelTextData[c.name].trim();
        if (content) {
          if (isFlatFormat) {
            const cleanHeader = c.name.toLowerCase();
            const lowerContent = content.toLowerCase();
            if (lowerContent.startsWith(`# ${cleanHeader}`)) {
              content = `# <!-- block: concepts --> ${cleanHeader}\n` + content.substring(cleanHeader.length + 2).trim();
            } else if (!content.startsWith('# <!-- block:')) {
              content = `# <!-- block: concepts --> ${cleanHeader}\n` + content;
            }
          }
          md += content + '\n\n';
        }
      }
    }
  });

  // Emit concept-taxonomy hierarchy matrix (first-class taxonomy storage)
  const taxEdgesToSerialize = params.taxonomyEdges || [];
  if (taxEdgesToSerialize.length > 0) {
    // Collect unique parents (rows) and children (columns)
    const taxParents = Array.from(new Set(taxEdgesToSerialize.map(e => e.parent)));
    const taxChildren = Array.from(new Set(taxEdgesToSerialize.map(e => e.child)));
    if (isFlatFormat) {
      md += `# <!-- block: matrices --> concept-taxonomy hierarchy matrix\n\n`;
    } else {
      md += `# concept-taxonomy hierarchy matrix\n\n`;
    }
    md += `| concept \\ taxonomy | ${taxChildren.join(' | ')} |\n`;
    md += `| :--- | ${taxChildren.map(() => ':---:').join(' | ')} |\n`;
    taxParents.forEach(parent => {
      const row = taxChildren.map(child =>
        taxEdgesToSerialize.some(e => e.parent === parent && e.child === child) ? 'X' : '-'
      );
      md += `| **${parent}** | ${row.join(' | ')} |\n`;
    });
    md += '\n';
  }

  for (let i = 0; i < hierarchyConcepts.length - 1; i++) {
    const source = hierarchyConcepts[i];
    const target = hierarchyConcepts[i+1];
    
    const sourceNodes = getNodesAtLevel(source);
    const targetNodes = getNodesAtLevel(target);
    const cleanTargets = Array.from(new Set(targetNodes.map(t => cleanName(t.name))));
    
    if (cleanTargets.length > 0) {
      if (isFlatFormat) {
        md += `# <!-- block: matrices --> ${source.toLowerCase()}-${target.toLowerCase()} hierarchy matrix\n\n`;
      } else {
        md += `# ${source}-${target} Hierarchy Matrix\n\n`;
      }
      md += `| ${source} \\ ${target} | ` + cleanTargets.join(' | ') + ' |\n';
      md += `| :--- | ` + cleanTargets.map(() => ':---:').join(' | ') + ' |\n';
      sourceNodes.forEach(s => {
        const sourceCleanName = cleanName(s.name);
        const childNames = s.children.map(c => cleanName(c.name));
        const rowVals = cleanTargets.map(t => childNames.some(c => c.toLowerCase() === t.toLowerCase()) ? 'X' : '-');
        md += `| **${sourceCleanName}** | ` + rowVals.join(' | ') + ' |\n';
      });
      md += '\n';
    }
  }

  if (isFlatFormat) {
    md += `# <!-- block: matrices --> item-markers matrix\n\n`;
  } else {
    md += `# Item-Markers Matrix\n\n`;
  }
  
  const allNodeIds: string[] = [];
  const allNodeNames: string[] = [];
  const traverseByLevel = (nodes: TreeNode[]) => {
    const levelNodesMap: Record<string, TreeNode[]> = {};
    hierarchyConcepts.forEach(c => {
      levelNodesMap[c] = [];
    });
    
    const visit = (list: TreeNode[]) => {
      list.forEach(n => {
        if (levelNodesMap[n.type]) {
          levelNodesMap[n.type].push(n);
        }
        if (n.children) visit(n.children);
      });
    };
    visit(nodes);
    
    hierarchyConcepts.forEach(c => {
      levelNodesMap[c].forEach(n => {
        allNodeIds.push(n.id);
        allNodeNames.push(n.name);
      });
    });
  };
  traverseByLevel(params.modelTree);
  
  const markerNames = params.markers.map(m => m.name);
  md += `| Item \\ Marker | ` + markerNames.join(' | ') + ' |\n';
  md += `| :--- | ` + markerNames.map(() => ':---:').join(' | ') + ' |\n';
  
  const rowValsFor = (markerVals: Record<string, any>) =>
    markerNames.map(m => {
      const markerKey = Object.keys(markerVals).find(k => k.toLowerCase() === m.toLowerCase()) || m;
      const v = markerVals[markerKey];
      return (v !== undefined && v !== 0) ? v : '-';
    });

  // Track which nodeMarkers keys we've already emitted so concept-block rows
  // (added below) never duplicate a tree-node row.
  const emittedKeys = new Set<string>();
  allNodeIds.forEach((id, idx) => {
    const nodeName = allNodeNames[idx];
    const nodeCleanName = cleanName(nodeName);
    const markerKey = Object.keys(params.nodeMarkers).find(k => k.toLowerCase() === id.toLowerCase() || k.toLowerCase() === nodeCleanName.toLowerCase()) || nodeCleanName;
    emittedKeys.add(markerKey.toLowerCase());
    const nodeMarkerVals = params.nodeMarkers[markerKey] || {};
    md += `| **${nodeCleanName}** | ` + rowValsFor(nodeMarkerVals).join(' | ') + ' |\n';
  });

  // Concept-kind blocks live in modelTextData, not modelTree, so they are not
  // visited above. Emit their assignments using the raw `concept:<slug>` id as
  // the row label so the parser can route them back to the same key on load.
  Object.keys(params.nodeMarkers).forEach(key => {
    if (!key.toLowerCase().startsWith('concept:')) return;
    if (emittedKeys.has(key.toLowerCase())) return;
    emittedKeys.add(key.toLowerCase());
    md += `| **${key}** | ` + rowValsFor(params.nodeMarkers[key]).join(' | ') + ' |\n';
  });
  md += '\n';

  if (isFlatFormat) {
    md += `# <!-- block: matrices --> metamatrix\n\n`;
  } else {
    md += `# Metamatrix\n\n`;
  }
  md += `| Matrix Name | Source | Target | Widget Type | Widget Parameters |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- |\n`;
  params.metamatrix.forEach(mat => {
    md += `| ${mat.name} | ${mat.source} | ${mat.target} | ${mat.widgetType} | ${mat.params || '-'} |\n`;
  });
  md += '\n';

  params.metamatrix.forEach(mat => {
    if (hierarchyMatrixPairs.some(p => p.name.toLowerCase() === mat.name.toLowerCase())) {
      return;
    }
    const rows = params.getMatrixRowsList(mat.source, params.modelTree);
    const cols = params.getMatrixColsList(mat.target);
    
    if (isFlatFormat) {
      md += `# <!-- block: matrices --> ${mat.name.toLowerCase()}\n\n`;
    } else {
      md += `# ${mat.name}\n\n`;
    }
    md += `| ${mat.source} \\ ${mat.target} | ` + cols.join(' | ') + ' |\n';
    md += `| :--- | ` + cols.map(() => ':---:').join(' | ') + ' |\n';
    
    rows.forEach(row => {
      const cleanRow = cleanName(row);
      const colsVal = cols.map(col => {
        const expectedKey = `${mat.name}||${cleanRow}||${col}`.toLowerCase();
        const actualKey = Object.keys(params.matrixValues).find(k => k.toLowerCase() === expectedKey);
        const val = actualKey ? params.matrixValues[actualKey] : undefined;
        return val !== undefined ? val : '-';
      });
      md += `| **${cleanRow}** | ` + colsVal.join(' | ') + ' |\n';
    });
    md += '\n';
  });

  if (params.analysisScores && Object.keys(params.analysisScores).length > 0) {
    if (isFlatFormat) {
      md += `# <!-- block: matrices --> analysis evaluations\n\n`;
    } else {
      md += `# Analysis Evaluations\n\n`;
    }
    md += `| Timestamp | Evaluator | Target | Score | Comments |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;
    Object.entries(params.analysisScores).forEach(([keyName, scores]) => {
      (scores as EvaluatorScore[]).forEach((s: EvaluatorScore) => {
        md += `| ${s.timestamp} | ${s.evaluator_id} | ${keyName} | ${s.score} | ${s.comment || '-'} |\n`;
      });
    });
    md += '\n';
  }

  return md.trim();
}
