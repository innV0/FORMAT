<template>
  <aside class="w-96 border-r border-border bg-muted/40 flex flex-col justify-between overflow-y-auto shrink-0">
    <div class="px-4 py-4 space-y-4">
      <div class="space-y-3">
        <div class="flex items-center justify-between px-2">
          <h2 class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Business Model</h2>
          <div class="flex items-center gap-2">
            <button
              @click="expandAll"
              class="p-1 hover:bg-accent rounded text-[11px] text-muted-foreground hover:text-primary cursor-pointer transition-colors flex items-center justify-center"
              title="Expand All"
            >
              <ChevronsDown class="w-3.5 h-3.5" />
            </button>
            <button
              @click="collapseAll"
              class="p-1 hover:bg-accent rounded text-[11px] text-muted-foreground hover:text-primary cursor-pointer transition-colors flex items-center justify-center"
              title="Collapse All"
            >
              <ChevronsUp class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div class="space-y-1.5">
          <ConceptTreeNode
            v-for="node in conceptTree"
            :key="node.name"
            :node="node"
            :active-name="documentStore.activeConceptName"
            :expanded-generation="expandedGeneration"
            :elements-map="conceptElementsMap"
            :selected-node-id="documentStore.selectedNode?.id"
            @select="documentStore.selectConcept"
          />
        </div>

        <!-- Relations & Setup -->
        <div class="space-y-1 mt-4">
          <div class="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/60 rounded-sm">
            Relations & Setup
          </div>
          <button
            @click="documentStore.selectConcept('metamatrix')"
            :class="documentStore.activeConceptName === 'metamatrix' ? 'bg-accent text-accent-foreground font-semibold border border-border shadow-xs' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'"
            class="w-full flex items-center gap-2 rounded px-2.5 py-1.5 text-xs transition-all text-left cursor-pointer"
          >
            <Settings class="w-3.5 h-3.5 text-muted-foreground" />
            <span class="truncate">Metamatrix Config</span>
          </button>
          <button
            @click="documentStore.selectConcept('matrices')"
            :class="documentStore.activeConceptName === 'matrices' ? 'bg-accent text-accent-foreground font-semibold border border-border shadow-xs' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'"
            class="w-full flex items-center gap-2 rounded px-2.5 py-1.5 text-xs transition-all text-left cursor-pointer"
          >
            <BarChart2 class="w-3.5 h-3.5 text-primary" />
            <span class="truncate font-semibold">Relational Matrices</span>
          </button>
          <button
            @click="documentStore.selectConcept('analysis')"
            :class="documentStore.activeConceptName === 'analysis' ? 'bg-accent text-accent-foreground font-semibold border border-border shadow-xs' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'"
            class="w-full flex items-center gap-2 rounded px-2.5 py-1.5 text-xs transition-all text-left cursor-pointer"
          >
            <TrendingUp class="w-3.5 h-3.5 text-primary" />
            <span class="truncate font-semibold">Business Analysis</span>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronsDown, ChevronsUp, Settings, BarChart2, TrendingUp } from 'lucide-vue-next';
import { useMetamodelStore } from '../../stores/metamodel';
import { useDocumentStore } from '../../stores/document';
import { TreeNode } from '../../types';
import ConceptTreeNode from './ConceptTreeNode.vue';

const metamodelStore = useMetamodelStore();
const documentStore = useDocumentStore();

const expandedGeneration = ref(0);

const expandAll = () => {
  expandedGeneration.value = Math.max(0, expandedGeneration.value) + 1;
};

const collapseAll = () => {
  expandedGeneration.value = Math.min(-1, expandedGeneration.value) - 1;
};

const conceptTree = computed(() => {
  const nodes: Record<string, any> = {};
  metamodelStore.concepts.forEach(c => {
    nodes[c.name] = { ...c, children: [] };
  });

  const roots: any[] = [];
  metamodelStore.concepts.forEach(c => {
    const node = nodes[c.name];
    if (c.category_id && nodes[c.category_id]) {
      nodes[c.category_id].children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
});

const conceptElementsMap = computed(() => {
  const map: Record<string, TreeNode[]> = {};
  const visit = (nodes: TreeNode[]) => {
    nodes.forEach(n => {
      if (n.type) {
        if (!map[n.type]) map[n.type] = [];
        map[n.type].push(n);
      }
      if (n.children) visit(n.children);
    });
  };
  visit(documentStore.modelTree);
  return map;
});
</script>
