<template>
  <div class="space-y-6 max-w-4xl mx-auto p-1">
    <!-- Header Section -->
    <div class="flex items-center gap-3 pb-4 border-b border-border">
      <div class="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs">
        <Info class="w-5 h-5" />
      </div>
      <div>
        <h2 class="text-lg font-bold text-foreground">Model Information & Workspace</h2>
        <p class="text-xs text-muted-foreground">Manage your workspace files, inspect metamodel configurations, and view raw model data.</p>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- Left Column: Workspace & Files -->
      <div class="bg-card text-card-foreground p-5 rounded-lg border border-border shadow-xs space-y-4">
        <div class="flex items-center justify-between border-b border-border pb-3">
          <h3 class="text-sm font-semibold text-foreground flex items-center gap-2">
            <FolderOpen class="w-4 h-4 text-primary" />
            Workspace Directory
          </h3>
          <span 
            :class="workspaceStore.dirHandle ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10' : 'bg-amber-50 text-amber-700 ring-amber-600/10'" 
            class="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset"
          >
            {{ workspaceStore.dirHandle ? 'Connected' : 'Demo Mode' }}
          </span>
        </div>

        <!-- Connected State -->
        <div v-if="workspaceStore.dirHandle" class="space-y-3">
          <div class="text-xs text-muted-foreground flex items-center justify-between bg-muted/30 p-2 rounded-md border border-border/50">
            <span class="truncate font-mono font-semibold text-foreground">{{ workspaceStore.dirHandle.name }}</span>
            <button 
              @click="workspaceStore.openConnectDialog" 
              class="text-[10px] text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer underline transition-all shrink-0 ml-2"
            >
              Change
            </button>
          </div>

          <div class="space-y-1.5">
            <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block px-1">Markdown Files</label>
            <div class="max-h-60 overflow-y-auto border border-border rounded-md bg-background/50 divide-y divide-border">
              <div 
                v-for="file in workspaceStore.mdFiles" 
                :key="file.name" 
                class="flex items-center justify-between p-1.5 hover:bg-accent/30 transition-all"
              >
                <button 
                  @click="openFile(file)" 
                  :class="workspaceStore.activeFileName === file.name ? 'text-primary font-semibold bg-accent border border-border/50 shadow-3xs' : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground'"
                  class="text-left text-xs truncate flex-1 py-1.5 px-2 rounded-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <FileText class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span class="truncate">{{ file.name }}</span>
                </button>
              </div>
              <div v-if="!workspaceStore.mdFiles.length" class="text-muted-foreground text-xs italic p-4 text-center">
                No markdown files found.
              </div>
            </div>
          </div>

          <!-- Create New File Form -->
          <div class="pt-2 border-t border-border mt-3 flex gap-2">
            <input 
              v-model="workspaceStore.newFileName" 
              placeholder="new_model.md" 
              class="border border-input bg-background text-foreground px-3 py-1.5 text-xs rounded-md flex-1 outline-none focus:ring-1 focus:ring-ring"
              @keyup.enter="handleCreateFile"
            >
            <button 
              @click="handleCreateFile" 
              class="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            >
              Create File
            </button>
          </div>
        </div>

        <!-- Disconnected State -->
        <div v-else class="py-8 text-center space-y-4">
          <FolderOpen class="w-12 h-12 text-muted-foreground/45 mx-auto" />
          <div class="space-y-1">
            <p class="text-xs text-muted-foreground">Select a local directory to read and write your model files directly on your computer.</p>
          </div>
          <button 
            @click="workspaceStore.openConnectDialog" 
            class="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-all cursor-pointer"
          >
            Connect Workspace Folder
          </button>
        </div>
      </div>

      <!-- Right Column: Metamodel Status -->
      <div class="bg-card text-card-foreground p-5 rounded-lg border border-border shadow-xs space-y-4">
        <div class="border-b border-border pb-3">
          <h3 class="text-sm font-semibold text-foreground flex items-center gap-2">
            <Settings class="w-4 h-4 text-primary" />
            Metamodel Settings
          </h3>
        </div>

        <div class="space-y-3.5 text-xs">
          <div class="flex flex-col gap-1 p-2.5 rounded-md bg-muted/30 border border-border/50">
            <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Source Metamodel File</span>
            <strong class="text-foreground truncate font-mono text-[11px]">{{ metamodelStore.metamodelSource }}</strong>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 border border-border rounded-md bg-background/50 space-y-1">
              <span class="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Concepts Loaded</span>
              <span class="text-xl font-bold text-foreground">{{ metamodelStore.concepts.length }}</span>
            </div>
            <div class="p-3 border border-border rounded-md bg-background/50 space-y-1">
              <span class="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Matrices Loaded</span>
              <span class="text-xl font-bold text-foreground">{{ metamodelStore.metamodelMatrices.length }}</span>
            </div>
          </div>

          <div class="pt-2 divide-y divide-border/60">
            <div class="flex justify-between py-2">
              <span class="text-muted-foreground">Specification Version:</span>
              <span class="font-medium text-foreground">{{ documentStore.specificationVersion }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-muted-foreground">Documentation Directory:</span>
              <span class="font-mono text-foreground">{{ documentStore.documentationLocation }}</span>
            </div>
            <div class="flex justify-between py-2" v-if="workspaceStore.activeFileName">
              <span class="text-muted-foreground">Active Model File:</span>
              <span class="font-semibold text-primary truncate max-w-[180px]">{{ workspaceStore.activeFileName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section: Plain Text View Option -->
    <div class="bg-card text-card-foreground p-5 rounded-lg border border-border shadow-xs space-y-4">
      <div class="flex items-center justify-between border-b border-border pb-3">
        <h3 class="text-sm font-semibold text-foreground flex items-center gap-2">
          <FileText class="w-4 h-4 text-primary" />
          Plain Text Model View (Ver en Texto Plano)
        </h3>
        
        <div class="flex items-center gap-2">
          <label class="relative inline-flex items-center cursor-pointer select-none">
            <input 
              type="checkbox" 
              v-model="showPlainTextView" 
              class="sr-only peer"
              :disabled="!workspaceStore.activeFileName"
            >
            <div class="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            <span class="ml-2 text-xs font-medium text-muted-foreground">Show Source Code</span>
          </label>
        </div>
      </div>

      <!-- Plain Text Content Display -->
      <div v-if="showPlainTextView && workspaceStore.activeFileName" class="space-y-3 animate-in fade-in duration-200">
        <div class="flex items-center justify-between bg-muted/40 px-3 py-2 rounded-md border border-border/60">
          <span class="text-xs text-muted-foreground font-mono truncate">
            {{ workspaceStore.activeFileName }}
          </span>
          <button 
            @click="copyToClipboard" 
            class="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 px-2 py-1 rounded transition-all cursor-pointer font-semibold"
          >
            <component :is="isCopied ? Check : Copy" class="w-3.5 h-3.5" />
            <span>{{ isCopied ? 'Copied!' : 'Copy Code' }}</span>
          </button>
        </div>

        <div class="relative rounded-md border border-border bg-slate-900 overflow-hidden shadow-inner">
          <textarea
            readonly
            :value="serializedModelText"
            rows="16"
            class="w-full bg-slate-950 text-slate-200 font-mono text-xs p-4 focus:outline-none resize-none border-none outline-none leading-relaxed select-all selection:bg-indigo-600 selection:text-white"
          ></textarea>
        </div>
      </div>

      <!-- Fallback empty/disabled states -->
      <div v-else-if="!workspaceStore.activeFileName" class="py-4 text-center text-xs text-muted-foreground italic">
        Select or create a markdown file from the workspace list to view its plain text representation.
      </div>
      <div v-else class="py-4 text-center text-xs text-muted-foreground/60 italic">
        Toggle "Show Source Code" to display the raw Markdown model representation.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Info, FolderOpen, FileText, Settings, Plus, Copy, Check } from 'lucide-vue-next';
import { useWorkspaceStore } from '../../stores/workspace';
import { useMetamodelStore } from '../../stores/metamodel';
import { useDocumentStore } from '../../stores/document';
import { FileItem } from '../../types';

const workspaceStore = useWorkspaceStore();
const metamodelStore = useMetamodelStore();
const documentStore = useDocumentStore();

const showPlainTextView = ref(false);
const isCopied = ref(false);

const serializedModelText = computed(() => {
  if (!workspaceStore.activeFileName) return '';
  return documentStore.serializeActiveFile();
});

// Watch active file changes to reset copy status and text view defaults
watch(() => workspaceStore.activeFileName, () => {
  isCopied.value = false;
});

const openFile = async (file: FileItem) => {
  try {
    const content = await workspaceStore.fs.readFileContent(file.handle);
    workspaceStore.activeFileName = file.name;
    workspaceStore.activeFileHandle = file.handle;
    documentStore.loadDocument(content);
    // Switch to first concept naturally
    documentStore.selectConcept('Business summary');
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

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(serializedModelText.value);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};
</script>
