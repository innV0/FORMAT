<template>
  <div class="space-y-1">
    <div class="flex items-center gap-1.5 w-full">
      <!-- Collapse toggle button on the left (outside the pill) -->
      <button
        v-if="hasChildren"
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

      <BlockPill
        kind="concept"
        icon-mode="own"
        :block-id="conceptBlockId"
        :concept-type="node.name"
        :type-name="node.type || undefined"
        :name="node.name"
        :icon="node.icon"
        :selected="activeName === node.name"
        :interactive="true"
        :instance-count="elementCount"
        full-width
        class="flex-1"
        @click="emitSelect(node.name)"
      />
      <span
        v-if="elementCount > 0"
        class="text-2xs text-muted-foreground tabular-nums shrink-0 pr-1"
        :title="`${elementCount} instance${elementCount === 1 ? '' : 's'}`"
      >{{ elementCount }}</span>
    </div>

    <div
      v-if="hasChildren"
      v-show="!isCollapsed"
      class="pl-4 border-l border-border ml-3 space-y-1"
    >
      <!-- Recursive concept taxonomy children -->
      <ConceptTreeNode
        v-for="child in node.children"
        :key="child.name"
        :node="child"
        :active-name="activeName"
        :expanded-generation="expandedGeneration"
        :elements-map="elementsMap"
        :selected-node-id="selectedNodeId"
        @select="emitSelect"
      />

      <!-- Element instances of this concept -->
      <div
        v-for="el in elementNodes"
        :key="el.id"
        class="flex items-center gap-1.5 w-full"
      >
        <span class="w-[18px] shrink-0"></span>
        <BlockPill
          kind="instance"
          icon-mode="own"
          :block-id="el.id"
          :concept-type="node.name"
          :name="el.name || '(Empty)'"
          :description="el.description"
          :fields="el.fields"
          :selected="selectedNodeId === el.id"
          :interactive="true"
          full-width
          class="flex-1"
          @click="selectElement(el)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import { Concept, TreeNode } from '../../types';
import { useDocumentStore } from '../../stores/document';
import BlockPill from '../editor/BlockPill.vue';

interface ConceptNode extends Concept {
  children?: ConceptNode[];
}

const props = defineProps<{
  node: ConceptNode;
  activeName: string;
  expandedGeneration?: number;
  elementsMap?: Record<string, TreeNode[]>;
  selectedNodeId?: string;
}>();

const emit = defineEmits<{
  (e: 'select', name: string): void;
}>();

const documentStore = useDocumentStore();
const isCollapsed = ref(false);

const conceptBlockId = computed(() =>
  `concept:${props.node.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
);

const elementNodes = computed(() => props.elementsMap?.[props.node.name] ?? []);

const elementCount = computed(() => elementNodes.value.length);

const hasChildren = computed(() =>
  (props.node.children && props.node.children.length > 0) || elementNodes.value.length > 0
);

watch(() => props.expandedGeneration, (newVal) => {
  if (newVal !== undefined) {
    isCollapsed.value = newVal < 0;
  }
}, { immediate: true });

const emitSelect = (name: string) => {
  emit('select', name);
};

const selectElement = (el: TreeNode) => {
  documentStore.navigateToElement(el.name, props.node.name);
};
</script>
