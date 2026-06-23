<template>
  <div class="space-y-1">
    <div 
      class="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-50/50 transition-colors w-full"
    >
      <!-- Chevron for collapse/expand -->
      <button 
        v-if="node.children && node.children.length"
        @click.stop="isCollapsed = !isCollapsed"
        class="p-0.5 hover:bg-slate-200 rounded text-slate-500 transition-colors flex items-center justify-center cursor-pointer shrink-0"
        aria-label="Toggle node collapse"
      >
        <ChevronDown 
          class="transition-transform duration-200 w-3.5 h-3.5 inline-block"
          :class="{ '-rotate-90': isCollapsed }"
        />
      </button>
      <span v-else class="w-4.5 shrink-0"></span>

      <!-- Pill identity + Info popup on hover -->
      <BlockPill
        kind="instance"
        :block-id="node.id"
        :concept-type="currentConcept"
        :name="node.name || '(Empty)'"
        :description="node.description"
        :fields="node.fields"
        :instance-count="node.children?.length ?? 0"
        :selected="documentStore.selectedNode?.id === node.id"
        :show-markers="conceptType === 'weight'"
        :interactive="true"
        full-width
        class="flex-1 min-w-0"
        @click="documentStore.selectTreeNode(node, currentConcept)"
      />
    </div>

    <!-- Recursive children -->
    <div 
      v-if="node.children && node.children.length && nextConcept" 
      v-show="!isCollapsed"
      class="pl-3.5 border-l border-slate-200/60 ml-2 space-y-1"
    >
      <TreeNodeItem 
        v-for="child in node.children" 
        :key="child.id" 
        :node="child" 
        :level="level + 1"
        :hierarchy-concepts="hierarchyConcepts"
        :expanded-generation="expandedGeneration"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { TreeNode } from '../../types';
import { useDocumentStore } from '../../stores/document';
import { useMetamodelStore } from '../../stores/metamodel';
import TreeNodeItem from './TreeNodeItem.vue';
import BlockPill from './BlockPill.vue';
import { ChevronDown } from 'lucide-vue-next';

const props = defineProps<{
  node: TreeNode;
  level: number;
  hierarchyConcepts: string[];
  expandedGeneration?: number;
}>();

const documentStore = useDocumentStore();
const metamodelStore = useMetamodelStore();

const isCollapsed = ref(true);

watch(() => props.expandedGeneration, (newVal) => {
  if (newVal !== undefined) {
    isCollapsed.value = newVal < 0;
  }
}, { immediate: true });

const currentConcept = computed(() => props.hierarchyConcepts[props.level] || '');
const nextConcept = computed(() => props.hierarchyConcepts[props.level + 1] || null);

const conceptType = computed(() => {
  return metamodelStore.getConceptByName(currentConcept.value)?.type || null;
});
</script>
