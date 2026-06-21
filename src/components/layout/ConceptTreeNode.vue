<template>
  <div class="space-y-1">
    <div class="flex items-center gap-1.5 w-full">
      <!-- Collapse toggle button on the left (outside the pill) -->
      <button 
        v-if="node.children && node.children.length"
        @click.stop="isCollapsed = !isCollapsed"
        class="p-0.5 hover:bg-slate-100 rounded text-slate-500 transition-colors flex items-center justify-center cursor-pointer shrink-0"
        aria-label="Toggle node collapse"
      >
        <ChevronDown 
          class="transition-transform duration-200 w-3 h-3 inline-block"
          :class="{ '-rotate-90': isCollapsed }"
        />
      </button>
      <!-- Spacer for items without children to align icons -->
      <span v-else class="w-[18px] shrink-0"></span>

      <!-- Uniform BlockPill representing the Concept -->
      <BlockPill
        kind="concept"
        :concept-type="node.name"
        :type-name="node.type || undefined"
        :name="node.name"
        :emoji="node.emoji"
        :selected="activeName === node.name"
        :size="activeName === node.name ? 'md' : 'sm'"
        :interactive="true"
        @click="emitSelect(node.name)"
        class="flex-1"
      />
      <!-- Hierarchy badge -->
      <span
        v-if="isHierarchyConcept"
        class="shrink-0 flex items-center justify-center w-4 h-4 rounded text-indigo-400 opacity-60"
        title="Has hierarchy"
      >
        <GitBranch class="w-3 h-3" />
      </span>
    </div>

    <!-- Recursive children rendering -->
    <div 
      v-if="node.children && node.children.length" 
      v-show="!isCollapsed"
      class="pl-4 border-l border-border ml-3 space-y-1"
    >
      <ConceptTreeNode 
        v-for="child in node.children" 
        :key="child.name" 
        :node="child" 
        :active-name="activeName"
        :expanded-generation="expandedGeneration"
        @select="emitSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { ChevronDown, GitBranch } from 'lucide-vue-next';
import { Concept } from '../../types';
import { useMetamodelStore } from '../../stores/metamodel';
import BlockPill from '../editor/BlockPill.vue';

interface ConceptNode extends Concept {
  children?: ConceptNode[];
}

const props = defineProps<{
  node: ConceptNode;
  activeName: string;
  expandedGeneration?: number;
}>();

const emit = defineEmits<{
  (e: 'select', name: string): void;
}>();

const metamodelStore = useMetamodelStore();
const isCollapsed = ref(false);

const isHierarchyConcept = computed(() =>
  metamodelStore.hierarchyConcepts.includes(props.node.name)
);

// Watch the global generation counter to expand/collapse all
watch(() => props.expandedGeneration, (newVal) => {
  if (newVal !== undefined) {
    // Negative generation values represent "collapse all"
    isCollapsed.value = newVal < 0;
  }
}, { immediate: true });

const emitSelect = (name: string) => {
  emit('select', name);
};
</script>
