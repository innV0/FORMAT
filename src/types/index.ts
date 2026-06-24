export interface Concept {
  name: string;
  icon: string;
  type: 'text' | 'list' | 'category' | 'weight' | 'steps' | 'sequence' | null;
  description: string | null;
  summary?: string | null;
  color?: string | null;
  methodologies?: string | null;
  prompts?: string[] | string | null;
  fields?: any[];
  weight?: number;
}

export interface Marker {
  name: string;
  symbol: string;
  icon: string;
  description: string;
  color?: string;
  guidelines?: string;
  examples_high_score?: string;
  examples_low_score?: string;
}

export interface MetamatrixRow {
  name: string;
  source: string;
  target: string;
  widgetType: 'boolean' | 'cycle' | 'scale' | 'set' | 'text';
  params: string;
  min_color?: string;
  max_color?: string;
}

// A directed concept→concept edge within a perspective (parent contains/precedes child).
export interface PerspectiveEdge {
  parent: string; // concept name
  child: string;  // concept name
}

// A perspective is a named projection of the concepts, backed by a hierarchy matrix.
// Concepts have no intrinsic hierarchy; each perspective is one view over them.
export interface Perspective {
  id: string;
  name: string;
  icon: string;
  edges: PerspectiveEdge[];
}

// The local neighborhood of a concept within a single perspective.
export interface PerspectiveNeighborhood {
  perspective: Perspective;
  parents: string[];
  children: string[];
}

export type FieldType = 'string' | 'boolean' | 'number' | 'select' | 'reference';

export interface FieldDefinition {
  name: string;
  type: FieldType;
  default?: any;
  options?: string[];
  target_concepts?: string[];
}

export interface TreeNode {
  id: string;
  name: string;
  type: string;
  description: string;
  fields?: Record<string, any>;
  children: TreeNode[];
}

export interface NodeMarkers {
  [nodeId: string]: {
    [markerName: string]: number; // score 1-3
  };
}

export interface MatrixValues {
  [cellKey: string]: string | number | boolean; // key format: "MatrixName||Row||Col"
}

export interface FileItem {
  name: string;
  handle: FileSystemFileHandle;
}

export interface AnalysisKey {
  name: string;
  domain: string;
  weight: number;
  description: string;
  validation_questions?: string;
  action_items?: string;
  risk?: string;
  risk_description?: string;
  mitigation_strategy?: string;
  contingency_strategy?: string;
  target_concepts?: string[];
  depends_on_keys?: string[];
  type?: 'pure' | 'relational';
}

export interface EvaluatorScore {
  timestamp: string;
  evaluator_id: string;
  evaluator_type: 'human' | 'ai';
  score: number;
  comment?: string;
}

export interface AnalysisScores {
  [keyName: string]: EvaluatorScore[];
}

/**
 * Flexible block type that matches what BlockSheet.vue provides.
 */
export interface BlockData {
  id?: string;
  name: string;
  description: string;
  type?: string;
  fields?: Record<string, any>;
}

/**
 * Parsed item from markdown text (used in BlockFeed and TextEditor).
 */
export interface ParsedItem {
  id: string;
  name: string;
  description: string;
  fields?: Record<string, any>;
  blockType?: string;
}

