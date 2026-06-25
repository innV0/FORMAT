import Mustache from 'mustache';
import { TreeNode, MetamatrixRow, MatrixValues, Concept, PerspectiveEdge } from '../types';
import { stripMarkdownFormatting } from './sanitize';

/**
 * Maximum allowed renderer file size (256 KB per skill §5.6).
 */
export const MAX_RENDERER_SIZE = 256 * 1024;

/**
 * Dashboard data shape exposed to Mustache renderers (skill §5.5).
 * `fields` is an array of {key, value} pairs so Mustache can iterate it.
 */
export interface DashboardData {
  model: {
    title: string;
    version: string;
    specificationVersion: string;
  };
  template: {
    name: string;
    version: string;
    title: string;
  };
  concepts: Array<{
    name: string;
    instances: Array<{
      label: string;
      fields: Array<{ key: string; value: string }>;
    }>;
  }>;
  hierarchyConcepts: Array<{ name: string; parent?: string }>;
  taxonomyEdges: Array<{ source: string; target: string; label?: string }>;
  matrices: Array<{
    name: string;
    headers: string[];
    rows: string[][];
  }>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates a dashboard renderer HTML fragment against the security and
 * structural constraints defined in skill §5.4.1 and §5.6.
 */
export function validateRenderer(html: string): ValidationResult {
  const errors: string[] = [];

  if (html.length > MAX_RENDERER_SIZE) {
    errors.push(`Renderer exceeds size limit (${html.length} > ${MAX_RENDERER_SIZE} bytes).`);
  }

  // §5.4.1 — Prohibited Mustache features
  if (/\{\{\{/.test(html)) {
    errors.push('Triple-mustache `{{{...}}}` is prohibited (XSS risk). Use double-mustache for HTML-escaped interpolation.');
  }
  if (/\{\{>/.test(html)) {
    errors.push('Mustache partials `{{>partial}}` are prohibited.');
  }
  if (/\{\{=/.test(html)) {
    errors.push('Mustache delimiter changes `{{=delim delim=}}` are prohibited.');
  }

  // §5.6 — Prohibited HTML tags
  const tagPatterns: Array<[RegExp, string]> = [
    [/<script\b/i, '<script>'],
    [/<iframe\b/i, '<iframe>'],
    [/<object\b/i, '<object>'],
    [/<embed\b/i, '<embed>'],
    [/<link\b/i, '<link>'],
    [/<meta\b/i, '<meta>'],
    [/<!DOCTYPE\b/i, '<!DOCTYPE>'],
    [/<html\b/i, '<html>'],
    [/<head\b[^er]/i, '<head>'],
    [/<body\b/i, '<body>'],
  ];
  for (const [re, label] of tagPatterns) {
    if (re.test(html)) {
      errors.push(`Prohibited tag ${label} is present in the renderer.`);
    }
  }

  // §5.6 — Prohibited attributes and URIs
  if (/\son\w+\s*=/i.test(html)) {
    errors.push('Event handler attributes (on*) are prohibited.');
  }
  if (/javascript:/i.test(html)) {
    errors.push('`javascript:` URIs are prohibited.');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Converts a fields record (key→value) into the array-of-pairs shape
 * that Mustache can iterate.
 */
function fieldsToArray(fields: Record<string, any> | undefined): Array<{ key: string; value: string }> {
  if (!fields) return [];
  return Object.entries(fields).map(([key, value]) => ({
    key,
    value: String(value ?? ''),
  }));
}

/**
 * Extracts instances for a concept from the model tree (hierarchy concepts)
 * or from the raw markdown text data (list/sequence concepts).
 */
function extractInstances(
  conceptName: string,
  isHierarchy: boolean,
  modelTree: TreeNode[],
  modelTextData: Record<string, string>,
): Array<{ label: string; fields: Array<{ key: string; value: string }> }> {
  if (isHierarchy) {
    const instances: Array<{ label: string; fields: Array<{ key: string; value: string }> }> = [];
    const visit = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        if (node.type === conceptName) {
          instances.push({
            label: stripMarkdownFormatting(node.name),
            fields: fieldsToArray(node.fields),
          });
        }
        if (node.children?.length) visit(node.children);
      }
    };
    visit(modelTree);
    return instances;
  }

  // Parse list items from modelTextData
  const rawText = modelTextData[conceptName] || '';
  if (!rawText) return [];

  const instances: Array<{ label: string; fields: Array<{ key: string; value: string }> }> = [];

  // Try block-comment pattern first: <!-- block: conceptName --> Label
  const blockRegex = new RegExp(
    `<!--\\s*block:\\s*${conceptName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*-->\\s*(.*)`,
    'gi',
  );
  const blockMatches = [...rawText.matchAll(blockRegex)];
  if (blockMatches.length > 0) {
    for (const m of blockMatches) {
      const label = stripMarkdownFormatting(m[1]);
      if (label) instances.push({ label, fields: [] });
    }
    return instances;
  }

  // Fallback: bullet list items
  const lines = rawText.split('\n');
  for (const line of lines) {
    const match = line.match(/^[-*]\s+\*\*?([^*:]+)\*\*?:?/);
    if (match) {
      const label = stripMarkdownFormatting(match[1]);
      if (label) instances.push({ label, fields: [] });
    } else {
      const simpleMatch = line.match(/^[-*]\s+([^:]+):?/);
      if (simpleMatch) {
        const label = stripMarkdownFormatting(simpleMatch[1]);
        if (label) instances.push({ label, fields: [] });
      }
    }
  }

  return instances;
}

/**
 * Builds the matrix data for the renderer from metamatrix definitions and
 * matrix cell values. Uses the provided row/col extractor functions (from
 * the document store) to determine matrix dimensions.
 */
function buildMatrices(
  metamatrix: MetamatrixRow[],
  matrixValues: MatrixValues,
  getRows: (source: string) => string[],
  getCols: (target: string) => string[],
): Array<{ name: string; headers: string[]; rows: string[][] }> {
  const result: Array<{ name: string; headers: string[]; rows: string[][] }> = [];

  for (const m of metamatrix) {
    const rowLabels = getRows(m.source);
    const colLabels = getCols(m.target);
    if (rowLabels.length === 0 && colLabels.length === 0) continue;

    const headers = [m.source, ...colLabels];
    const rows: string[][] = [];

    for (const rowLabel of rowLabels) {
      const row: string[] = [rowLabel];
      for (const colLabel of colLabels) {
        const key = `${m.name}||${rowLabel}||${colLabel}`;
        const val = matrixValues[key];
        row.push(val !== undefined && val !== '-' ? String(val) : '-');
      }
      rows.push(row);
    }

    result.push({ name: m.name, headers, rows });
  }

  return result;
}

export interface BuildDataParams {
  modelTitle: string;
  modelVersion: string;
  specificationVersion: string;
  templateName: string;
  templateVersion: string;
  templateTitle: string;
  concepts: Concept[];
  hierarchyConcepts: string[];
  taxonomyEdges: PerspectiveEdge[];
  modelTree: TreeNode[];
  modelTextData: Record<string, string>;
  metamatrix: MetamatrixRow[];
  matrixValues: MatrixValues;
  getMatrixRowsList: (source: string) => string[];
  getMatrixColsList: (target: string) => string[];
}

/**
 * Builds the normalized, template-agnostic data object that is passed to
 * the Mustache renderer. This is the single place where store data is
 * projected into the shape documented in skill §5.5.
 */
export function buildDashboardData(params: BuildDataParams): DashboardData {
  const concepts: DashboardData['concepts'] = params.concepts
    .filter(c => c.type !== 'category')
    .map(concept => {
      const isHierarchy = params.hierarchyConcepts.includes(concept.name);
      const instances = extractInstances(
        concept.name,
        isHierarchy,
        params.modelTree,
        params.modelTextData,
      );
      return { name: concept.name, instances };
    });

  const hierarchyConcepts: DashboardData['hierarchyConcepts'] = params.hierarchyConcepts.map(
    (name, i) => ({
      name,
      parent: i > 0 ? params.hierarchyConcepts[i - 1] : undefined,
    }),
  );

  const taxonomyEdges: DashboardData['taxonomyEdges'] = params.taxonomyEdges.map(e => ({
    source: e.parent,
    target: e.child,
  }));

  const matrices = buildMatrices(
    params.metamatrix,
    params.matrixValues,
    params.getMatrixRowsList,
    params.getMatrixColsList,
  );

  return {
    model: {
      title: params.modelTitle,
      version: params.modelVersion,
      specificationVersion: params.specificationVersion,
    },
    template: {
      name: params.templateName,
      version: params.templateVersion,
      title: params.templateTitle,
    },
    concepts,
    hierarchyConcepts,
    taxonomyEdges,
    matrices,
  };
}

/**
 * Renders a dashboard renderer HTML fragment with the provided data.
 * The renderer is first validated; if validation fails, an error is thrown.
 * Mustache's default escaping is used (double-mustache {{ }} escapes HTML).
 */
export function renderDashboard(rendererHtml: string, data: DashboardData): string {
  const validation = validateRenderer(rendererHtml);
  if (!validation.valid) {
    throw new Error(`Invalid dashboard renderer:\n  - ${validation.errors.join('\n  - ')}`);
  }

  Mustache.escape = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  return Mustache.render(rendererHtml, data);
}
