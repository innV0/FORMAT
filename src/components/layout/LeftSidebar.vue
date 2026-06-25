<template>
  <aside
    class="relative border-r border-border bg-muted/40 flex flex-col justify-between overflow-y-auto shrink-0 scrollbar-discreet"
    :style="{ width: width + 'px' }"
  >
    <!-- Resize handle (right edge) -->
    <div
      @pointerdown="startResize"
      class="absolute top-0 right-0 z-30 h-full w-1.5 cursor-col-resize hover:bg-primary/30 active:bg-primary/50 transition-colors"
      title="Drag to resize"
    ></div>
    <div class="px-4 py-4 space-y-4">
      <div class="space-y-3">
        <!-- Dashboard button (above concept tree) -->
        <button
          @click="documentStore.selectConcept('dashboard')"
          :class="documentStore.activeConceptName === 'dashboard' ? 'bg-primary/10 text-primary font-semibold border border-primary/30 shadow-xs' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground border border-transparent'"
          class="w-full flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-all text-left cursor-pointer"
        >
          <LayoutDashboard class="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <!-- Header with expand/collapse all -->
        <div class="flex items-center justify-between px-2">
          <h2 class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Model</h2>
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

        <!-- Concept taxonomy tree with inline elements -->
        <div class="space-y-1.5">
          <ConceptTreeNode
            v-for="node in conceptTree"
            :key="node.name"
            :node="node"
            :active-name="documentStore.activeConceptName"
            :elements-map="elementsMap"
            :selected-node-id="documentStore.selectedNode?.id"
            :expanded-generation="expandedGeneration"
            @select="selectConcept"
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

        </div>
      </div>
    </div>


  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronsDown, ChevronsUp, Settings, BarChart2, LayoutDashboard } from 'lucide-vue-next';
import { useMetamodelStore } from '../../stores/metamodel';
import { useDocumentStore } from '../../stores/document';
import ConceptTreeNode from './ConceptTreeNode.vue';
import { Concept, TreeNode } from '../../types';
import { useResizablePanel } from '../../composables/useResizablePanel';

const { width, startResize } = useResizablePanel({
  storageKey: 'format.leftSidebarWidth',
  defaultWidth: 384,
  minWidth: 240,
  maxWidth: 640,
  side: 'right',
});

const metamodelStore = useMetamodelStore();
const documentStore = useDocumentStore();

interface ConceptNode extends Concept {
  children: ConceptNode[];
}

const conceptTree = computed((): ConceptNode[] => {
  const edges = metamodelStore.taxonomyEdges;
  const allConcepts = metamodelStore.concepts;

  if (edges.length === 0) {
    return allConcepts.map(c => ({ ...c, children: [] }));
  }

  const nodeMap: Record<string, ConceptNode> = {};
  allConcepts.forEach(c => {
    nodeMap[c.name] = { ...c, children: [] };
  });

  const childNames = new Set<string>();
  edges.forEach(e => {
    if (nodeMap[e.parent] && nodeMap[e.child]) {
      nodeMap[e.parent].children.push(nodeMap[e.child]);
      childNames.add(e.child);
    }
  });

  return allConcepts
    .filter(c => !childNames.has(c.name))
    .map(c => nodeMap[c.name]);
});

const elementsMap = computed(() => {
  const map: Record<string, TreeNode[]> = {};
  const walk = (nodes: TreeNode[]) => {
    for (const n of nodes) {
      if (!map[n.type]) map[n.type] = [];
      map[n.type].push(n);
      if (n.children?.length) walk(n.children);
    }
  };
  walk(documentStore.modelTree);
  return map;
});

const expandedGeneration = ref(-1);

const expandAll = () => {
  expandedGeneration.value = Math.max(0, expandedGeneration.value) + 1;
};

const collapseAll = () => {
  expandedGeneration.value = Math.min(-1, expandedGeneration.value) - 1;
};



const selectConcept = (name: string) => {
  documentStore.selectConcept(name);
};
</script>
