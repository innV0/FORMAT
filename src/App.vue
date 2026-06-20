<template>
  <div class="h-full flex flex-col overflow-hidden bg-muted/40">
    <!-- Top Nav Header -->
    <Header />

    <!-- App Workspace -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Sidebar Navigation -->
      <LeftSidebar />

      <!-- Main Editor Workspace -->
      <main v-if="workspaceStore.activeFileName" class="flex-1 flex overflow-hidden bg-background">
        <!-- Center/Left: Editor Workspace -->
        <div class="flex-1 flex flex-col overflow-y-auto border-r border-border p-8">
          
          <!-- Concept Title Header -->
          <div class="border-b border-border pb-4 mb-6 flex justify-between items-center shrink-0">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                Type: {{ conceptType }}
              </span>
              <h2 class="text-xl font-bold tracking-tight text-slate-900 mt-1.5">
                {{ headerTitle }}
              </h2>
            </div>
          </div>

          <!-- 1. TEXT CONCEPT EDITOR -->
          <TextEditor v-if="isMarkdownEditor && !isAnalysisMode" />

          <!-- 2. UNIFIED TREE VIEW -->
          <TreeEditor v-else-if="conceptType === 'instantiable' && !isAnalysisMode" />

          <!-- 3. METAMATRIX SETUP CONFIG -->
          <MetamatrixConfig v-else-if="activeConcept === 'metamatrix'" />

          <!-- 4. RELATIONAL MATRICES DATA -->
          <MatricesGrid v-else-if="activeConcept === 'matrices'" />

          <!-- 5. BUSINESS ANALYSIS VIEW -->
          <AnalysisPanel v-else-if="isAnalysisMode" />

          <!-- FALLBACK/EMPTY STATE -->
          <div v-else class="text-slate-400 text-xs italic text-center my-auto">
            Please select a section from the sidebar or connect a directory to begin.
          </div>
        </div>

        <!-- Right Guidance Sidebar -->
        <RightGuidanceSidebar />
      </main>

      <!-- Empty Startup Placeholder (when no file selected) -->
      <div v-else class="flex-1 flex flex-col items-center justify-center bg-slate-50/50 text-slate-400 text-sm p-8 border-l border-slate-100">
        <div class="max-w-md text-center space-y-3">
          <FileText class="w-12 h-12 text-slate-300 mx-auto" />
          <h3 class="font-bold text-slate-700">No Model Connected</h3>
          <p class="text-xs text-slate-500">
            Select a markdown file from the workspace list or create a new one to begin editing your business model.
          </p>
        </div>
      </div>
    </div>
    <!-- Directory selection guidance modal -->
    <DirectoryPickerModal />
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue';
import Header from './components/layout/Header.vue';
import LeftSidebar from './components/layout/LeftSidebar.vue';
import RightGuidanceSidebar from './components/layout/RightGuidanceSidebar.vue';
import DirectoryPickerModal from './components/layout/DirectoryPickerModal.vue';

import TextEditor from './components/editor/TextEditor.vue';
import TreeEditor from './components/editor/TreeEditor.vue';
import MetamatrixConfig from './components/editor/MetamatrixConfig.vue';
import MatricesGrid from './components/editor/MatricesGrid.vue';
import AnalysisPanel from './components/editor/AnalysisPanel.vue';

import { useWorkspaceStore } from './stores/workspace';
import { useDocumentStore } from './stores/document';
import { useMetamodelStore } from './stores/metamodel';
import { FileText } from 'lucide-vue-next';

const workspaceStore = useWorkspaceStore();
const documentStore = useDocumentStore();
const metamodelStore = useMetamodelStore();

const activeConcept = computed(() => documentStore.activeConceptName);
const conceptType = computed(() => documentStore.getConceptType());

const isAnalysisMode = computed(() => {
  return activeConcept.value === 'analysis';
});

const isMarkdownEditor = computed(() => {
  return ['text', 'weight', 'steps', 'sequence', 'category', 'list'].includes(conceptType.value);
});

const headerTitle = computed(() => {
  if (activeConcept.value === 'metamatrix') return 'Metamatrix Configuration';
  if (activeConcept.value === 'matrices') return 'Relational Matrices Grid';
  return activeConcept.value;
});

// Setup keyboard shortcuts and auto-load last directory
onMounted(async () => {
  await workspaceStore.loadLastDirectory();

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
