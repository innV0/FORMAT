<template>
  <div v-if="hasAnyRelationships" class="mt-4 border-t border-slate-200/60 pt-4 space-y-3">
    <!-- Incoming Relationships: "Referenced by" -->
    <div v-if="incomingRelationships.length > 0">
      <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
        <ArrowDownToLine class="w-3.5 h-3.5 text-slate-400" />
        Referenced by
      </h4>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="ref in incomingRelationships"
          :key="ref.block.id || ref.block.name"
          @click="navigateToBlock(ref.block)"
          class="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-lg border transition-all duration-150 cursor-pointer hover:scale-[1.02]"
          :class="chipClasses"
          :title="ref.fieldName ? `Via field: ${ref.fieldName}` : 'Via wikilink in description'"
        >
          <GitBranch class="w-3 h-3 opacity-60" />
          <span class="truncate max-w-[120px]">{{ ref.block.name }}</span>
        </button>
      </div>
    </div>

    <!-- Outgoing Relationships: "References" -->
    <div v-if="outgoingLinks.length > 0">
      <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
        <ArrowUpFromLine class="w-3.5 h-3.5 text-slate-400" />
        References
      </h4>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="link in outgoingLinks"
          :key="link"
          @click="navigateByName(link)"
          class="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-lg border transition-all duration-150 cursor-pointer hover:scale-[1.02]"
          :class="chipClasses"
        >
          <GitBranch class="w-3 h-3 opacity-60" />
          <span class="truncate max-w-[120px]">{{ link }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ArrowDownToLine, ArrowUpFromLine, GitBranch } from 'lucide-vue-next';
import { useBlockRelationships } from '../../composables/useBlockRelationships';
import { useDocumentStore } from '../../stores/document';
import type { TreeNode } from '../../types';

interface BlockData {
  id?: string;
  name: string;
  description: string;
  type?: string;
  fields?: Record<string, any>;
}

const props = defineProps<{
  block: BlockData;
  conceptName: string;
  conceptColor?: string;
}>();

const { getOutgoingRelationships, getIncomingRelationships } = useBlockRelationships();
const documentStore = useDocumentStore();

// Outgoing: links from this block's description + reference fields
const outgoing = getOutgoingRelationships(props.block);
const outgoingLinks = computed(() => outgoing.value);

// Incoming: other blocks that reference this block
const incoming = getIncomingRelationships(props.block.name);
const incomingRelationships = computed(() => incoming.value);

// Hide section if no relationships at all
const hasAnyRelationships = computed(() => {
  return outgoingLinks.value.length > 0 || incomingRelationships.value.length > 0;
});

// Dynamic chip styling based on concept color (fallback to indigo)
const chipClasses = computed(() => {
  const color = (props.conceptColor || 'indigo').toLowerCase();
  const base = 'border-slate-200 bg-white text-slate-700';
  const hover = 'hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/10';
  return `${base} ${hover}`;
});

// Navigate to a block by clicking its chip
const navigateToBlock = (block: TreeNode) => {
  const concept = documentStore.modelTree.find(n => n.name === block.name);
  if (concept) {
    documentStore.selectTreeNode(block, block.type);
  }
};

// Navigate to a block by name (for outgoing links that may be in different concepts)
const navigateByName = (name: string) => {
  // Find the block in modelTree
  const findNode = (nodes: TreeNode[]): TreeNode | null => {
    for (const node of nodes) {
      if (node.name === name) return node;
      if (node.children) {
        const found = findNode(node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const node = findNode(documentStore.modelTree);
  if (node) {
    documentStore.selectTreeNode(node, node.type);
  }
};
</script>
