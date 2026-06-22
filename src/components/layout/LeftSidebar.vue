<template>
  <aside class="w-96 border-r border-border bg-muted/40 flex flex-col justify-between overflow-y-auto shrink-0">
    <div class="px-4 py-4 space-y-4">
      <!-- Navigation & Hierarchy Tabs -->
      <div class="space-y-3">
        <!-- Segmented Tab Switcher -->
        <div class="flex border-b border-border mb-3 bg-muted/20 p-0.5 rounded-lg shrink-0">
          <button
            @click="switchTab('concepts')"
            :class="sidebarTab === 'concepts' ? 'bg-background text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'"
            class="flex-1 py-1.5 text-center text-xs rounded-md cursor-pointer transition-all border border-transparent"
          >
            Concepts
          </button>
          <button
            @click="switchTab('hierarchy')"
            :class="sidebarTab === 'hierarchy' ? 'bg-background text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'"
            class="flex-1 py-1.5 text-center text-xs rounded-md cursor-pointer transition-all border border-transparent"
          >
            Hierarchy
          </button>
        </div>

        <!-- Animated tab content -->
        <div class="relative overflow-hidden">
        <Transition :name="slideDirection">

        <!-- Tab 1: Concepts -->
        <div v-if="sidebarTab === 'concepts'" key="concepts" class="space-y-3">
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
              @select="documentStore.selectConcept"
            />
          </div>

          <!-- Metamatrix and Matrix views -->
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

        <!-- Tab 2: Hierarchy -->
        <div v-else key="hierarchy" class="space-y-3">
          <!-- Context anchor: rises from tree into position -->
          <div class="hierarchy-anchor flex items-center gap-2 px-2 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg">
            <button
              @click="goBack"
              class="shrink-0 p-1 rounded hover:bg-indigo-100 text-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer"
              title="Back to Concepts"
            >
              <ArrowLeft class="w-3.5 h-3.5" />
            </button>
            <span v-if="activeHierarchyConcept" class="flex items-center gap-1.5 min-w-0">
              <IconRenderer
                v-if="activeHierarchyConcept.icon"
                :icon="activeHierarchyConcept.icon"
                custom-class="w-3.5 h-3.5 text-indigo-600 shrink-0"
              />
              <span class="text-xs font-semibold text-indigo-700 truncate">{{ activeHierarchyConcept.name }}</span>
            </span>
          </div>

          <!-- Header and tree reveal after anchor settles -->
          <div class="hierarchy-body">
          <div class="flex items-center justify-between px-2">
            <h2 class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hierarchy</h2>
            <div class="flex items-center gap-2">
              <button
                @click="expandAllHierarchy"
                class="p-1 hover:bg-accent rounded text-[11px] text-muted-foreground hover:text-primary cursor-pointer transition-colors flex items-center justify-center"
                title="Expand All"
              >
                <ChevronsDown class="w-3.5 h-3.5" />
              </button>
              <button
                @click="collapseAllHierarchy"
                class="p-1 hover:bg-accent rounded text-[11px] text-muted-foreground hover:text-primary cursor-pointer transition-colors flex items-center justify-center"
                title="Collapse All"
              >
                <ChevronsUp class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div class="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            <TreeNodeItem
              v-for="node in documentStore.modelTree"
              :key="node.id"
              :node="node"
              :level="0"
              :hierarchy-concepts="metamodelStore.hierarchyConcepts"
              :expanded-generation="expandedGenerationHierarchy"
            />
            <div v-if="!documentStore.modelTree.length" class="text-muted-foreground text-xs italic text-center p-4">
              No tree elements found. Click below to add.
            </div>
          </div>

          <!-- Add root node button -->
          <div class="pt-2 border-t border-border flex justify-end">
            <button
              @click="documentStore.addTreeRoot"
              class="bg-primary hover:bg-primary/90 text-primary-foreground text-[10.5px] px-2.5 py-1 rounded font-bold cursor-pointer transition-colors shadow-xs"
            >
              + Add {{ rootConceptNameSingular }}
            </button>
          </div>
          </div><!-- end hierarchy-body -->
        </div>

        </Transition>
        </div><!-- end relative wrapper -->
      </div>

    </div>

  </aside>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ChevronsDown, ChevronsUp, Settings, BarChart2, TrendingUp, ArrowLeft } from 'lucide-vue-next';
import { useWorkspaceStore } from '../../stores/workspace';
import { useMetamodelStore } from '../../stores/metamodel';
import { useDocumentStore } from '../../stores/document';
import ConceptTreeNode from './ConceptTreeNode.vue';
import TreeNodeItem from '../editor/TreeNodeItem.vue';
import IconRenderer from '../editor/IconRenderer.vue';

const workspaceStore = useWorkspaceStore();
const metamodelStore = useMetamodelStore();
const documentStore = useDocumentStore();

const sidebarTab = ref<'concepts' | 'hierarchy'>('concepts');
const slideDirection = ref<'slide-right' | 'slide-left'>('slide-right');

const expandedGeneration = ref(0);
const expandedGenerationHierarchy = ref(0);

const expandAll = () => {
  expandedGeneration.value = Math.max(0, expandedGeneration.value) + 1;
};

const collapseAll = () => {
  expandedGeneration.value = Math.min(-1, expandedGeneration.value) - 1;
};

const expandAllHierarchy = () => {
  expandedGenerationHierarchy.value = Math.max(0, expandedGenerationHierarchy.value) + 1;
};

const collapseAllHierarchy = () => {
  expandedGenerationHierarchy.value = Math.min(-1, expandedGenerationHierarchy.value) - 1;
};

const rootConceptName = computed(() => metamodelStore.hierarchyConcepts[0] || 'Stakeholders');
const rootConceptNameSingular = computed(() => {
  const name = rootConceptName.value;
  return name.endsWith('s') ? name.slice(0, -1) : name;
});

const activeHierarchyConcept = computed(() =>
  metamodelStore.getConceptByName(documentStore.activeConceptName) ?? null
);

const goBack = () => {
  slideDirection.value = 'slide-left';
  sidebarTab.value = 'concepts';
};

const switchTab = (tab: 'concepts' | 'hierarchy') => {
  slideDirection.value = tab === 'hierarchy' ? 'slide-right' : 'slide-left';
  sidebarTab.value = tab;
};

// Watch active concept to auto-switch tabs
watch(() => documentStore.activeConceptName, (newConcept) => {
  if (metamodelStore.hierarchyConcepts.includes(newConcept)) {
    slideDirection.value = 'slide-right';
    sidebarTab.value = 'hierarchy';
  } else if (sidebarTab.value === 'hierarchy') {
    // don't force switch away when user is browsing hierarchy manually
  }
}, { immediate: true });

const conceptTree = computed(() => {
  const nodes: Record<string, any> = {};
  metamodelStore.concepts.forEach(c => {
    nodes[c.name] = {
      ...c,
      children: []
    };
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
</script>

<style scoped>
/* ── Tab container transition ─────────────────────────────────────────── */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.9s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.7s ease;
}

/* Leaving element floats out without taking layout space */
.slide-right-leave-active,
.slide-left-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}

.slide-right-enter-from { transform: translateX(48px); opacity: 0; }
.slide-right-leave-to  { transform: translateX(-32px); opacity: 0; }

.slide-left-enter-from  { transform: translateX(-48px); opacity: 0; }
.slide-left-leave-to   { transform: translateX(32px); opacity: 0; }

/* ── Context anchor: rises slowly from tree position ────────────────── */
.slide-right-enter-active .hierarchy-anchor {
  animation: anchorRise 0.85s cubic-bezier(0.34, 1.4, 0.64, 1) both;
  animation-delay: 0.15s;
}

@keyframes anchorRise {
  from {
    transform: translateY(80px) scale(0.94);
    opacity: 0;
    box-shadow: 0 0 0 0 transparent;
  }
  50% {
    opacity: 1;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
    box-shadow: 0 2px 10px 0 rgba(99, 102, 241, 0.15);
  }
}

/* ── Hierarchy body: reveals after anchor has risen ─────────────────── */
.slide-right-enter-active .hierarchy-body {
  animation: bodyReveal 0.7s cubic-bezier(0.4, 0, 0.2, 1) both;
  animation-delay: 0.55s;
}

@keyframes bodyReveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

