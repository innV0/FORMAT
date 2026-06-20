<template>
  <aside class="w-64 border-r border-border bg-muted/40 flex flex-col justify-between overflow-y-auto shrink-0">
    <div class="px-4 py-4 space-y-4">
      
      <!-- Metamodel Source Loader Status -->
      <div class="bg-card text-card-foreground p-3 rounded-md border border-border shadow-xs">
        <h2 class="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Metamodel Status</h2>
        <div class="text-[11px] text-muted-foreground space-y-1">
          <p class="flex justify-between"><span>Source:</span> <strong class="text-primary truncate">{{ metamodelStore.metamodelSource }}</strong></p>
          <p class="flex justify-between"><span>Concepts:</span> <span class="font-semibold">{{ metamodelStore.concepts.length }} loaded</span></p>
          <p class="flex justify-between"><span>Matrices:</span> <span class="font-semibold">{{ metamodelStore.metamodelMatrices.length }} loaded</span></p>
        </div>
      </div>

      <!-- Connected Directory File list -->
      <div v-if="workspaceStore.dirHandle" class="space-y-1.5">
        <h2 class="px-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Workspace Files</h2>
        <div class="bg-card text-card-foreground p-2.5 rounded-md border border-border space-y-1">
          <div v-for="file in workspaceStore.mdFiles" :key="file.name" class="flex items-center justify-between">
            <button 
              @click="openFile(file)" 
              :class="workspaceStore.activeFileName === file.name ? 'text-primary font-semibold bg-accent border border-border/50' : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground'"
              class="text-left text-xs truncate flex-1 p-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileText class="w-3.5 h-3.5 text-muted-foreground" />
              <span class="truncate">{{ file.name }}</span>
            </button>
          </div>
          <div v-if="!workspaceStore.mdFiles.length" class="text-muted-foreground text-[11px] italic p-1">No markdown files found.</div>
          <div class="pt-2 border-t border-border mt-2 flex gap-1">
            <input v-model="workspaceStore.newFileName" placeholder="new_model.md" class="border border-input bg-background text-foreground p-1 text-[11px] rounded flex-1 outline-none focus:ring-1 focus:ring-ring">
            <button @click="handleCreateFile" class="bg-primary hover:bg-primary/90 text-primary-foreground px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer transition-colors shadow-xs">New</button>
          </div>
        </div>
      </div>

      <!-- Dynamic Concept Categories (Hierarchical Tree) -->
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

    </div>

    <div class="p-4 border-t border-border bg-card text-card-foreground">
      <div class="text-[11px] text-muted-foreground space-y-1">
        <p class="flex justify-between"><span>Workspace Connected:</span> <strong :class="workspaceStore.dirHandle ? 'text-emerald-600' : 'text-amber-600'">{{ workspaceStore.dirHandle ? 'Yes' : 'No (Demo)' }}</strong></p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { FileText, ChevronsDown, ChevronsUp, Settings, BarChart2, TrendingUp } from 'lucide-vue-next';
import { useWorkspaceStore } from '../../stores/workspace';
import { useMetamodelStore } from '../../stores/metamodel';
import { useDocumentStore } from '../../stores/document';
import ConceptTreeNode from './ConceptTreeNode.vue';
import { FileItem } from '../../types';

const workspaceStore = useWorkspaceStore();
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

const openFile = async (file: FileItem) => {
  try {
    const content = await workspaceStore.fs.readFileContent(file.handle);
    workspaceStore.activeFileName = file.name;
    workspaceStore.activeFileHandle = file.handle;
    documentStore.loadDocument(content);
  } catch (err) {
    console.error('Error opening file:', err);
    alert('Failed to load file content.');
  }
};

const handleCreateFile = async () => {
  if (!workspaceStore.newFileName || !workspaceStore.dirHandle) return;
  let filename = workspaceStore.newFileName.trim();
  if (!filename.endsWith('.md')) filename += '.md';
  
  const defaultText = `---
metamodel: "./innV0_master_data.json"
title: "${filename.replace('.md', '')}"
specification_version: "1.0.0"
last_saved: "${new Date().toISOString()}"
---

# Business summary
Describe your business here.
`;
  
  try {
    const handle = await workspaceStore.fs.createNewFile(workspaceStore.dirHandle, filename, defaultText);
    if (handle) {
      workspaceStore.newFileName = '';
      await workspaceStore.refreshFiles();
      // Auto open it
      openFile({ name: filename, handle });
    }
  } catch (err) {
    console.error(err);
    alert('Failed to create file.');
  }
};
</script>
