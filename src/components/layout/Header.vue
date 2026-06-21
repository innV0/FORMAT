<template>
  <header class="flex items-center justify-between border-b border-border bg-card text-card-foreground px-6 py-3 shrink-0">
    <div class="flex items-center gap-3">
      <button 
        @click="documentStore.selectConcept('info')"
        :class="documentStore.activeConceptName === 'info' ? 'bg-primary text-primary-foreground border-primary shadow-xs' : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 hover:text-primary'"
        class="h-8 w-8 rounded-md flex items-center justify-center border transition-all cursor-pointer shadow-2xs"
        title="View Model Status & Workspace Files"
      >
        <Info class="w-4.5 h-4.5" />
      </button>
      <div>
        <h1 class="text-sm font-semibold tracking-tight">innV0 Business Model Modeler</h1>
        <p class="text-xs text-muted-foreground">
          Workspace: 
          <span v-if="workspaceStore.dirHandle" class="font-mono text-emerald-600 font-semibold">{{ workspaceStore.dirHandle.name }}</span>
          <span v-else class="text-muted-foreground italic">Not Connected (Demo Mode)</span>
        </p>
      </div>
    </div>
    
    <div class="flex items-center gap-3">
      <!-- Unsaved changes badge -->
      <StatusBadge v-if="documentStore.unsavedChanges" status="unsaved">Unsaved Changes</StatusBadge>
      <StatusBadge v-else status="synced">Synced</StatusBadge>

      <!-- Workspace Connection Dropdown Split Button -->
      <div class="relative inline-flex rounded-md shadow-xs" ref="dropdownRef">
        <!-- Main Button: Reconnect vs Current Folder vs Connect Directory -->
        <button 
          v-if="workspaceStore.needsPermission"
          @click="reconnectLast" 
          :disabled="workspaceStore.isPendingPermission"
          class="inline-flex items-center gap-1.5 rounded-l-md bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-600/25 hover:bg-amber-100 disabled:opacity-50 transition-all cursor-pointer"
          title="Click to restore directory access / Click para autorizar acceso"
        >
          <AlertTriangle class="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>{{ workspaceStore.isPendingPermission ? 'Restoring...' : `Reconnect ${workspaceStore.dirHandle?.name}` }}</span>
        </button>
        <button 
          v-else
          @click="toggleDropdown" 
          class="inline-flex items-center gap-1.5 rounded-l-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <FolderOpen class="w-3.5 h-3.5 text-slate-500" />
          <span class="max-w-[140px] truncate">{{ workspaceStore.dirHandle ? workspaceStore.dirHandle.name : 'Connect Directory' }}</span>
        </button>

        <!-- Dropdown toggle chevron button -->
        <button 
          @click="toggleDropdown"
          :class="workspaceStore.needsPermission ? 'bg-amber-50 ring-amber-600/25 hover:bg-amber-100 text-amber-800 rounded-r-md border-l border-amber-600/10' : 'bg-white ring-slate-300 hover:bg-slate-50 text-slate-700 rounded-r-md border-l border-slate-200'"
          class="inline-flex items-center px-2 py-1.5 text-xs font-semibold shadow-xs ring-1 ring-inset transition-all cursor-pointer"
        >
          <ChevronDown class="w-3.5 h-3.5" />
        </button>

        <!-- Dropdown Menu -->
        <div 
          v-if="dropdownOpen" 
          class="absolute right-0 top-full mt-1.5 w-72 rounded-lg bg-white shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in duration-100"
        >
          <!-- History Items -->
          <div class="max-h-60 overflow-y-auto">
            <div class="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Recent Workspaces
            </div>
            
            <div v-if="workspaceStore.savedDirectories.length === 0" class="px-3 py-2 text-xs text-slate-400 italic">
              No recent directories
            </div>
            
            <div 
              v-for="dir in workspaceStore.savedDirectories.slice(0, 10)" 
              :key="dir.name"
              class="group flex items-center justify-between px-2 py-0.5 hover:bg-slate-50"
            >
              <button 
                @click="selectHistoryDirectory(dir)"
                class="flex-1 text-left px-2 py-1 text-xs text-slate-700 rounded hover:text-indigo-600 transition-colors truncate flex items-center gap-1.5 cursor-pointer"
              >
                <Folder class="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 shrink-0" />
                <span class="truncate" :class="workspaceStore.dirHandle?.name === dir.name && !workspaceStore.needsPermission ? 'font-semibold text-indigo-600' : 'font-medium'">{{ dir.name }}</span>
              </button>
              
              <button 
                @click.stop="deleteHistoryDirectory(dir.name)"
                class="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 rounded transition-all cursor-pointer"
                title="Remove from history"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div class="border-t border-slate-100 my-1.5"></div>

          <!-- Connect New Button -->
          <button 
            @click="connectNewDirectory"
            class="w-full text-left px-4 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FolderPlus class="w-4 h-4" />
            Connect New Directory
          </button>
        </div>
      </div>
      
      <button 
        @click="documentStore.saveActiveFile" 
        :disabled="workspaceStore.isDemoMode || !workspaceStore.activeFileName" 
        class="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <Save class="w-3.5 h-3.5" />
        Save (Ctrl+S)
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { FolderOpen, Save, ChevronDown, Folder, Trash2, FolderPlus, AlertTriangle, Info } from 'lucide-vue-next';
import { useWorkspaceStore } from '../../stores/workspace';
import { useDocumentStore } from '../../stores/document';
import StatusBadge from '../ui/StatusBadge.vue';

const workspaceStore = useWorkspaceStore();
const documentStore = useDocumentStore();

const dropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const reconnectLast = async () => {
  if (workspaceStore.savedDirectories.length > 0) {
    await workspaceStore.connectSavedDirectory(workspaceStore.savedDirectories[0]);
  }
};

const selectHistoryDirectory = async (dir: any) => {
  dropdownOpen.value = false;
  await workspaceStore.connectSavedDirectory(dir);
};

const deleteHistoryDirectory = async (name: string) => {
  await workspaceStore.deleteSavedDirectory(name);
};

const connectNewDirectory = () => {
  dropdownOpen.value = false;
  workspaceStore.openConnectDialog();
};

const closeDropdown = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  window.removeEventListener('click', closeDropdown);
});
</script>
