<template>
  <div class="space-y-2">
    <!-- Node itself (Grouped as a single pill/badge) -->
    <div 
      @click="documentStore.selectTreeNode(node, currentConcept)" 
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      :class="[
        documentStore.selectedNode && documentStore.selectedNode.id === node.id 
          ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50/30' 
          : colorClasses.border,
        colorClasses.bg,
        colorClasses.text,
        'flex items-center justify-between border rounded-lg px-2.5 py-1 cursor-pointer shadow-xs transition-all duration-150 gap-2.5 text-xs font-semibold select-none'
      ]"
    >
      <div class="flex items-center gap-1.5 truncate flex-1">
        <!-- Icon representing the concept type -->
        <component :is="conceptIcon" class="w-3.5 h-3.5 shrink-0 opacity-80" />
        
        <!-- Emoji -->
        <span v-if="conceptEmoji" class="shrink-0">{{ conceptEmoji }}</span>
        
        <!-- Concept Name (Uppercase) -->
        <span class="text-[9px] font-bold uppercase tracking-wider opacity-75 shrink-0">
          {{ cleanConceptName }}
        </span>
        
        <!-- Fine divider -->
        <span class="w-px h-3 bg-current opacity-25 shrink-0"></span>
        
        <!-- Node Name -->
        <span class="font-bold truncate max-w-[200px]" :title="node.name || '(Empty)'">
          {{ node.name || '(Empty)' }}
        </span>

        <!-- Markers directly after the name (Smooth slide & fade transition) -->
        <div 
          v-if="conceptType === 'weight'" 
          class="flex items-center gap-1.5 shrink-0 transition-all duration-300 ease-in-out overflow-hidden"
          :class="[
            isHovered || nodeMarkersList.length > 0 
              ? 'border-l pl-2 border-current/20 opacity-100' 
              : 'border-transparent pl-0 opacity-0 w-0'
          ]"
        >
          <span 
            v-for="marker in metamodelStore.markers" 
            :key="marker.name"
            @click.stop="cycleMarkerScore(marker.name)"
            :class="getMarkerClasses(marker.name)"
            :title="`${marker.name}: ${marker.description} (Score: ${documentStore.getNodeMarkerValue(node.id, marker.name)})`"
          >
            {{ marker.emoji }}
          </span>
        </div>
      </div>

      <!-- Add Child Button (PlusCircle icon, smooth slide & scale transition) -->
      <button 
        v-if="nextConcept"
        @click.stop="documentStore.addChildTreeNode(node, nextConcept)" 
        class="flex items-center justify-center rounded hover:bg-current/10 text-current cursor-pointer transition-all duration-300 ease-in-out shrink-0"
        :class="[
          isHovered 
            ? 'w-5 h-5 opacity-100 scale-100 pointer-events-auto ml-1' 
            : 'w-0 h-5 opacity-0 scale-50 pointer-events-none ml-0'
        ]"
        :title="`Add ${nextConceptSingular}`"
      >
        <PlusCircle class="w-4 h-4" />
      </button>
    </div>

    <!-- Recursive children -->
    <div v-if="node.children && node.children.length && nextConcept" class="pl-5 space-y-2 border-l border-slate-300 ml-3">
      <TreeNodeItem 
        v-for="child in node.children" 
        :key="child.id" 
        :node="child"
        :level="level + 1"
        :hierarchy-concepts="hierarchyConcepts"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { TreeNode } from '../../types';
import { useDocumentStore } from '../../stores/document';
import { useMetamodelStore } from '../../stores/metamodel';
import { getColorClasses } from '../../utils/colors';
import TreeNodeItem from './TreeNodeItem.vue';
import { 
  FileText, 
  Folder, 
  Scale, 
  ListChecks, 
  GitCommit, 
  List, 
  HelpCircle,
  PlusCircle
} from 'lucide-vue-next';

const props = defineProps<{
  node: TreeNode;
  level: number;
  hierarchyConcepts: string[];
}>();

const documentStore = useDocumentStore();
const metamodelStore = useMetamodelStore();

const isHovered = ref(false);

const currentConcept = computed(() => props.hierarchyConcepts[props.level] || '');
const nextConcept = computed(() => props.hierarchyConcepts[props.level + 1] || null);

const cleanConceptName = computed(() => {
  const name = currentConcept.value;
  return name.endsWith('s') ? name.slice(0, -1) : name;
});

const nextConceptSingular = computed(() => {
  if (!nextConcept.value) return '';
  const name = nextConcept.value;
  return name.endsWith('s') ? name.slice(0, -1) : name;
});

const conceptEmoji = computed(() => {
  return metamodelStore.getConceptByName(currentConcept.value)?.emoji || '';
});

const conceptType = computed(() => {
  return metamodelStore.getConceptByName(currentConcept.value)?.type || null;
});

const conceptColor = computed(() => {
  return metamodelStore.getConceptByName(currentConcept.value)?.color || '';
});

const colorClasses = computed(() => getColorClasses(conceptColor.value));

const conceptIcon = computed(() => {
  switch (conceptType.value) {
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
  const currentVal = documentStore.getNodeMarkerValue(props.node.id, markerName);
  const nextVal = (currentVal + 1) % 4; // Cycles: 0 -> 1 -> 2 -> 3 -> 0
  documentStore.setNodeMarkerValue(props.node.id, markerName, nextVal);
};

const getMarkerClasses = (markerName: string) => {
  const score = documentStore.getNodeMarkerValue(props.node.id, markerName);
  const base = 'transition-all duration-300 ease-in-out inline-flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 shrink-0 overflow-hidden';
  
  if (score === 0) {
    return `${base} ${isHovered.value ? 'w-4 opacity-25 scale-90 grayscale' : 'w-0 opacity-0 pointer-events-none scale-50'}`;
  } else if (score === 1) {
    return `${base} w-4 opacity-60 scale-100`;
  } else if (score === 2) {
    return `${base} w-4 opacity-85 scale-110`;
  } else {
    return `${base} w-4 opacity-100 scale-125 drop-shadow-xs font-bold`;
  }
};

const nodeMarkersList = computed(() => {
  const list: { marker: any; score: number }[] = [];
  const scores = documentStore.nodeMarkers[props.node.id] || {};
  metamodelStore.markers.forEach(m => {
    const val = scores[m.name];
    if (val && val > 0) {
      list.push({ marker: m, score: val });
    }
  });
  return list;
});
</script>

