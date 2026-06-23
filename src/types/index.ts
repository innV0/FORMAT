export interface Concept {
  name: string;
  category_id: string | null;
  icon: string;
  type: 'text' | 'category' | 'weight' | 'steps' | 'sequence' | null;
  description: string | null;
  summary?: string | null;
  color?: string | null;
  methodologies?: string | null;
  prompts?: string[] | string | null;
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
  widgetType: 'boolean' | 'cycle' | 'scale' | 'set';
  params: string;
  min_color?: string;
  max_color?: string;
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

export interface LensEdge {
  parent: string;
  child: string;
}

export interface Lens {
  id: string;
  name: string;
  icon: string;
  edges: LensEdge[];
}

export interface LensNeighborhood {
  lens: Lens;
  parents: string[];
  children: string[];
}


