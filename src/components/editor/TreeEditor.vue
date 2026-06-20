<template>
  <div class="flex gap-6 flex-1 min-h-[400px] overflow-hidden w-full">
    <!-- Tree Diagram Column -->
    <div 
      :class="[
        isTreeCollapsed ? 'w-24 px-2' : 'w-[35%] px-4',
        'border border-slate-200 rounded-lg bg-slate-50 py-4 overflow-y-auto flex flex-col transition-all duration-300 ease-in-out shrink-0 relative'
      ]"
    >
      <!-- Collapsed Tree View Bar -->
      <div v-if="isTreeCollapsed" class="flex flex-col items-center gap-4 h-full">
        <!-- Expand Button -->
        <button 
          @click="isTreeCollapsed = false"
          class="p-2 hover:bg-slate-200/60 rounded-lg text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors shadow-2xs border border-slate-200 bg-white"
          title="Expand Hierarchy Tree"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
        
        <div class="w-full border-t border-slate-200 my-1"></div>
        
        <!-- Concept Level Badges -->
        <div class="flex flex-col items-center gap-4 w-full">
          <div 
            v-for="conceptName in metamodelStore.hierarchyConcepts" 
            :key="conceptName"
            class="flex items-center gap-2 group relative w-full px-1"
          >
            <!-- Square Icon Button -->
            <div 
              class="w-10 h-10 rounded-lg flex items-center justify-center border shadow-3xs font-semibold text-base transition-all duration-200"
              :class="[
                getConceptColorClasses(conceptName).bg,
                getConceptColorClasses(conceptName).text,
                getConceptColorClasses(conceptName).border,
                'hover:scale-105 hover:shadow-2xs'
              ]"
              :title="conceptName"
            >
              <span>{{ getConceptEmoji(conceptName) }}</span>
            </div>
            
            <!-- Count Pill next to it -->
            <span 
              class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 min-w-[20px] text-center border border-slate-300"
              title="Number of items"
            >
              {{ nodeCounts[conceptName] || 0 }}
            </span>
          </div>
        </div>
      </div>

      <!-- Expanded Tree View -->
      <div v-else class="flex flex-col h-full">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">Workspace Hierarchy</h3>
          <div class="flex items-center gap-1">
            <button 
              @click="documentStore.addTreeRoot" 
              class="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded font-bold cursor-pointer shrink-0"
            >
              + {{ rootConceptNameSingular }}
            </button>
            <button 
              @click="isTreeCollapsed = true"
              class="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 cursor-pointer transition-colors shrink-0"
              title="Collapse Tree"
            >
              <ChevronLeft class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div class="space-y-3 flex-1 overflow-y-auto pr-1">
          <TreeNodeItem 
            v-for="node in documentStore.modelTree" 
            :key="node.id" 
            :node="node" 
            :level="0"
            :hierarchy-concepts="metamodelStore.hierarchyConcepts"
          />
        </div>
      </div>
    </div>

    <!-- Detail Editor Column -->
    <div 
      :class="[
        isTreeCollapsed ? 'flex-1' : 'w-[65%]',
        'border border-slate-200 rounded-lg p-6 bg-white flex flex-col justify-between overflow-y-auto transition-all duration-300 ease-in-out'
      ]"
    >
      <BlockViewer
        v-if="documentStore.selectedNode"
        :block="documentStore.selectedNode"
        :concept-name="documentStore.selectedNodeType"
        :concept-type="selectedNodeConceptType || 'text'"
        :concept-emoji="conceptEmoji"
        :concept-color="conceptColor"
        :concept-fields="conceptFields"
        :has-markers="selectedNodeConceptType === 'weight'"
        :show-delete="true"
        @delete="documentStore.deleteTreeNode(documentStore.selectedNode.id)"
        @cycle-marker="cycleMarkerScore"
      />
      
      <!-- Fallback when no node is selected -->
      <div v-else class="text-slate-400 text-xs italic text-center my-auto">
        Select a node in the tree diagram to modify its properties and metadata scores.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  FileText, 
  Folder, 
  Scale, 
  ListChecks, 
  GitCommit, 
  HelpCircle 
} from 'lucide-vue-next';
import { useDocumentStore } from '../../stores/document';
import { useMetamodelStore } from '../../stores/metamodel';
import TreeNodeItem from './TreeNodeItem.vue';
import BlockViewer from './BlockViewer.vue';
import { getColorClasses } from '../../utils/colors';
import { TreeNode } from '../../types';

const documentStore = useDocumentStore();
const metamodelStore = useMetamodelStore();

const isTreeCollapsed = ref(false);

const rootConceptName = computed(() => metamodelStore.hierarchyConcepts[0] || 'Stakeholders');
const rootConceptNameSingular = computed(() => {
  const name = rootConceptName.value;
  return name.endsWith('s') ? name.slice(0, -1) : name;
});

const selectedNodeConceptType = computed(() => {
  if (!documentStore.selectedNodeType) return null;
  return metamodelStore.getConceptByName(documentStore.selectedNodeType)?.type || null;
});

const cleanConceptName = computed(() => {
  const name = documentStore.selectedNodeType;
  return name.endsWith('s') ? name.slice(0, -1) : name;
});

const conceptEmoji = computed(() => {
  return metamodelStore.getConceptByName(documentStore.selectedNodeType)?.emoji || '';
});

const conceptColor = computed(() => {
  return metamodelStore.getConceptByName(documentStore.selectedNodeType)?.color || '';
});

const colorClasses = computed(() => getColorClasses(conceptColor.value));

const conceptIcon = computed(() => {
  switch (selectedNodeConceptType.value) {
    case 'text':
      return FileText;
    case 'category':
      return Folder;
    case 'weight':
      return Scale;
    case 'steps':
      return ListChecks;
    case 'sequence':
      return GitCommit;
    default:
      return HelpCircle;
  }
});

const cycleMarkerScore = (markerName: string) => {
  if (!documentStore.selectedNode) return;
  const currentVal = documentStore.getNodeMarkerValue(documentStore.selectedNode.id, markerName);
  const nextVal = (currentVal + 1) % 4; // Cycles: 0 -> 1 -> 2 -> 3 -> 0
  documentStore.setNodeMarkerValue(documentStore.selectedNode.id, markerName, nextVal);
};

const getMarkerClasses = (markerName: string) => {
  if (!documentStore.selectedNode) return '';
  const score = documentStore.getNodeMarkerValue(documentStore.selectedNode.id, markerName);
  if (score === 0) {
    return 'grayscale opacity-25 scale-90 hover:opacity-60';
  } else if (score === 1) {
    return 'opacity-60 scale-100';
  } else if (score === 2) {
    return 'opacity-85 scale-110';
  } else {
    return 'opacity-100 scale-125 drop-shadow-xs font-bold';
  }
};

const nodeCounts = computed(() => {
  const counts: Record<string, number> = {};
  const visit = (nodes: TreeNode[]) => {
    nodes.forEach(node => {
      counts[node.type] = (counts[node.type] || 0) + 1;
      if (node.children && node.children.length) {
        visit(node.children);
      }
    });
  };
  visit(documentStore.modelTree);
  return counts;
});

const getConceptEmoji = (conceptName: string) => {
  return metamodelStore.getConceptByName(conceptName)?.emoji || '📄';
};

const getConceptColorClasses = (conceptName: string) => {
  const color = metamodelStore.getConceptByName(conceptName)?.color || '';
  return getColorClasses(color);
};

interface MetamodelField {
  name: string;
  type?: 'string' | 'boolean' | 'number' | 'select' | string;
  options?: string[];
  choices?: string[];
  default?: any;
}

const conceptFields = computed<MetamodelField[]>(() => {
  if (!documentStore.selectedNodeType) return [];
  const concept = metamodelStore.getConceptByName(documentStore.selectedNodeType);
  if (!concept) return [];
  const fields = (concept as any).fields;
  if (Array.isArray(fields)) {
    return fields.map((f: any): MetamodelField | null => {
      if (typeof f === 'string') {
        return { name: f, type: 'string' };
      }
      if (f && typeof f === 'object' && typeof f.name === 'string') {
        return {
          name: f.name,
          type: f.type || 'string',
          options: f.options || f.choices || undefined,
          default: f.default
        };
      }
      return null;
    }).filter((f): f is MetamodelField => f !== null);
  }
  return [];
});
</script>
