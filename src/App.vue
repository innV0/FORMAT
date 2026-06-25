<template>
  <div class="h-full flex flex-col overflow-hidden bg-muted/40 pt-[52px]">
    <!-- Top Nav Header -->
    <Header />

    <!-- App Workspace -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Sidebar Navigation (Only visible when a file is open) -->
      <LeftSidebar v-if="workspaceStore.activeFileName" />

      <!-- Main Editor Workspace -->
      <main class="flex-1 flex overflow-hidden bg-background">
        <!-- Center/Left: Editor Workspace -->
        <div class="flex-1 flex flex-col overflow-y-auto border-r border-border p-8 scrollbar-discreet">
          
          <!-- Concept Title Header -->
          <div class="border-b border-border pb-4 mb-6 flex justify-between items-center shrink-0">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                Type: {{ workspaceStore.activeFileName ? conceptType : 'setup' }}
              </span>
              <h2 class="text-xl font-bold tracking-tight text-slate-900 mt-1.5">
                {{ headerTitle }}
              </h2>
            </div>
          </div>

          <!-- 1. MODEL INFO VIEW (Rendered if 'info' selected OR if no file is active) -->
          <ModelInfoPanel v-if="activeConcept === 'info' || !workspaceStore.activeFileName" />

          <!-- 2. DASHBOARD VIEW (default view when a model is loaded) -->
          <ModelDashboard v-else-if="workspaceStore.activeFileName && activeConcept === 'dashboard'" class="flex-1 min-h-0" />

          <!-- 3. TEXT CONCEPT EDITOR -->
          <TextEditor v-else-if="workspaceStore.activeFileName && isMarkdownEditor" />

          <!-- 4. UNIFIED TREE VIEW -->
          <TreeEditor v-else-if="workspaceStore.activeFileName && conceptType === 'instantiable'" />

          <!-- 5. METAMATRIX SETUP CONFIG -->
          <MetamatrixConfig v-else-if="workspaceStore.activeFileName && activeConcept === 'metamatrix'" />

          <!-- 6. RELATIONAL MATRICES DATA -->
          <MatricesGrid v-else-if="workspaceStore.activeFileName && activeConcept === 'matrices'" />

          <!-- FALLBACK/EMPTY STATE -->
          <div v-else class="text-slate-400 text-xs italic text-center my-auto">
            Please select a section from the sidebar or connect a directory to begin.
          </div>
        </div>

        <!-- Right Guidance Sidebar (Only when active concept is not 'info'/'dashboard' and a file is active) -->
        <RightGuidanceSidebar v-if="workspaceStore.activeFileName && activeConcept !== 'info' && activeConcept !== 'dashboard'" />
      </main>
    </div>
    <!-- Directory selection guidance modal -->
    <DirectoryPickerModal />
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import Header from './components/layout/Header.vue';
import LeftSidebar from './components/layout/LeftSidebar.vue';
import RightGuidanceSidebar from './components/layout/RightGuidanceSidebar.vue';
import DirectoryPickerModal from './components/layout/DirectoryPickerModal.vue';

import TextEditor from './components/editor/TextEditor.vue';
import TreeEditor from './components/editor/TreeEditor.vue';
import MetamatrixConfig from './components/editor/MetamatrixConfig.vue';
import MatricesGrid from './components/editor/MatricesGrid.vue';
import ModelInfoPanel from './components/editor/ModelInfoPanel.vue';
import ModelDashboard from './components/editor/ModelDashboard.vue';

import { useWorkspaceStore } from './stores/workspace';
import { useDocumentStore } from './stores/document';
import { findNodeByName } from './utils/tree';

const workspaceStore = useWorkspaceStore();
const documentStore = useDocumentStore();

const activeConcept = computed(() => documentStore.activeConceptName);
const conceptType = computed(() => documentStore.getConceptType());

const isMarkdownEditor = computed(() => {
  return ['text', 'weight', 'steps', 'sequence', 'category', 'list'].includes(conceptType.value);
});

const headerTitle = computed(() => {
  if (!workspaceStore.activeFileName || activeConcept.value === 'info') return 'Model Information & Workspace';
  if (activeConcept.value === 'dashboard') return 'Dashboard';
  if (activeConcept.value === 'metamatrix') return 'Metamatrix Configuration';
  if (activeConcept.value === 'matrices') return 'Relational Matrices Grid';
  return activeConcept.value;
});

// URL hash sync
// Note: node.id is generated on the fly at parse time (Math.random) and is NOT
// persisted in the markdown, so it cannot be used for a stable permalink.
// We key the hash by node.name instead, which is the only stable identifier
// that survives a reload. First match wins if names collide.
function buildHash(concept: string, nodeName?: string | null): string {
  const params = new URLSearchParams();
  params.set('concept', concept);
  if (nodeName) params.set('node', nodeName);
  return params.toString();
}

function restoreFromHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  const params = new URLSearchParams(hash);
  const concept = params.get('concept');
  const nodeName = params.get('node');
  if (concept) {
    documentStore.selectConcept(concept);
  }
  if (nodeName && documentStore.modelTree.length) {
    const node = findNodeByName(documentStore.modelTree, nodeName);
    if (node) documentStore.selectTreeNode(node, concept ?? '');
  }
}

let updatingHash = false;

watch(
  [() => documentStore.activeConceptName, () => documentStore.selectedNode],
  ([concept, node]) => {
    if (updatingHash) return;
    const newHash = buildHash(concept, node?.name);
    if (window.location.hash.slice(1) !== newHash) {
      history.replaceState(null, '', '#' + newHash);
    }
  }
);

// Restore node selection once the tree is populated
watch(
  () => documentStore.modelTree,
  (tree) => {
    if (!tree.length) return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const params = new URLSearchParams(hash);
    const nodeName = params.get('node');
    const concept = params.get('concept');
    if (nodeName) {
      const node = findNodeByName(tree, nodeName);
      if (node) documentStore.selectTreeNode(node, concept ?? '');
    }
  },
  { once: true }
);

// Setup keyboard shortcuts and auto-load last directory
onMounted(async () => {
  await workspaceStore.loadLastDirectory();
  restoreFromHash();

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      documentStore.saveActiveFile();
    }
  });
});
</script>


<style>
/* CSS styles if any */
</style>
