<template>
  <header class="flex items-center justify-between border-b border-border bg-card text-card-foreground px-6 py-3 shrink-0 fixed top-0 left-0 right-0 z-10">
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2.5">
        <span class="font-mono text-lg font-black text-primary select-none leading-none" style="-webkit-text-stroke: 1px hsl(var(--primary)); paint-order: stroke fill;">_F</span>
        <h1 class="text-sm font-semibold tracking-tight">FORMAT Modeler</h1>
      </div>

      <!-- Model Info Section -->
      <div v-if="workspaceStore.activeFileName && !workspaceStore.isDemoMode" class="flex items-center gap-3 pl-3 border-l border-slate-200 text-xs text-slate-500">
        <!-- Format Version -->
        <div class="flex items-center gap-1">
          <span>Format:</span>
          <span class="font-mono">{{ documentStore.formatVersion }}</span>
        </div>

        <!-- Plantilla / Template Info -->
        <div class="flex items-center gap-1">
          <span>Template:</span>
          <span>{{ documentStore.templateName }}</span>
          <span>{{ documentStore.templateVersion }}</span>
        </div>

        <!-- Model Version -->
        <div class="flex items-center gap-1">
          <span>Model:</span>
          <span class="font-mono">{{ documentStore.modelVersion }}</span>
        </div>

        <!-- File Path with Copy -->
        <div class="flex items-center gap-1">
          <span class="font-mono">{{ fullFilePath }}</span>
          <button @click="copyFilePath" class="p-0.5 rounded text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer" title="Copy path">
            <Copy class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
    
    <div class="flex items-center gap-3">
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
          <span class="w-2 h-2 rounded-full shrink-0" :class="documentStore.unsavedChanges ? 'bg-amber-400' : 'bg-emerald-400'"></span>
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
                class="flex-1 text-left px-2 py-1 text-xs text-slate-700 rounded hover:text-primary transition-colors truncate flex items-center gap-1.5 cursor-pointer"
              >
                <Folder class="w-3.5 h-3.5 text-slate-400 group-hover:text-primary shrink-0" />
                <span class="truncate" :class="workspaceStore.dirHandle?.name === dir.name && !workspaceStore.needsPermission ? 'font-semibold text-primary' : 'font-medium'">{{ dir.name }}</span>
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
            class="w-full text-left px-4 py-1.5 text-xs text-primary hover:bg-primary/5 font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <FolderPlus class="w-4 h-4" />
            Connect New Directory
          </button>
        </div>
      </div>
      
      <!-- Save Split Button with version & backup dropdown -->
      <div class="relative inline-flex rounded-md shadow-xs" ref="saveDropdownRef">
        <button
          @click="documentStore.saveActiveFile"
          :disabled="workspaceStore.isDemoMode || !workspaceStore.activeFileName"
          class="inline-flex items-center gap-1.5 rounded-l-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Save class="w-3.5 h-3.5" />
          {{ documentStore.unsavedChanges ? 'Update' : 'Save' }}
        </button>
        <button
          @click="toggleSaveDropdown"
          :disabled="workspaceStore.isDemoMode || !workspaceStore.activeFileName"
          class="inline-flex items-center rounded-r-md bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 border-l border-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          title="Save options: backup & version"
        >
          <ChevronDown class="w-3.5 h-3.5" />
        </button>

        <div
          v-if="saveDropdownOpen"
          class="absolute right-0 top-full mt-1.5 w-72 rounded-lg bg-white shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in duration-100"
        >
          <!-- Auto-backup toggle (single interactive element: no nested controls) -->
          <div class="px-3 pb-2">
            <button
              type="button"
              role="switch"
              :aria-checked="workspaceStore.autoBackup"
              @click="workspaceStore.setAutoBackup(!workspaceStore.autoBackup)"
              class="flex items-center justify-between w-full cursor-pointer"
            >
              <span class="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                <Archive class="w-3.5 h-3.5 text-slate-400" />
                Backup on every save
              </span>
              <span
                :class="workspaceStore.autoBackup ? 'bg-primary' : 'bg-slate-300'"
                class="relative inline-flex h-4 w-7 items-center rounded-full transition-colors shrink-0"
              >
                <span
                  :class="workspaceStore.autoBackup ? 'translate-x-3.5' : 'translate-x-0.5'"
                  class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform"
                ></span>
              </span>
            </button>
            <p class="text-[10px] text-slate-400 mt-1 leading-tight">
              Writes a timestamped copy into <span class="font-mono">backups/</span>.
            </p>
          </div>

          <div class="border-t border-slate-100 my-1.5"></div>

          <!-- Version bump -->
          <div class="px-3 pt-1">
            <div class="flex items-center justify-between mb-1.5">
              <span class="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Model Version
                <a
                  :href="documentStore.specificationUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary/60 hover:text-primary transition-colors cursor-pointer"
                  title="How FORMAT uses Semantic Versioning & file naming rules (spec §8). Opens the specification."
                >
                  <Info class="w-3.5 h-3.5" />
                </a>
              </span>
              <span class="font-mono text-xs font-semibold text-primary">{{ documentStore.modelVersion }}</span>
            </div>
            <p v-if="bumpError" class="text-[10px] text-red-600 mb-1.5 leading-tight">{{ bumpError }}</p>
            <div class="grid grid-cols-3 gap-1.5">
              <button
                v-for="lvl in (['major', 'minor', 'patch'] as const)"
                :key="lvl"
                @click="bumpVersion(lvl)"
                class="rounded-md bg-slate-100 px-2 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer capitalize"
              >
                {{ lvl }}
              </button>
            </div>
            <p class="text-[10px] text-slate-400 mt-1.5 leading-tight">
              Saves a new versioned file, keeping the current one.
            </p>
          </div>
        </div>
      </div>

      <!-- Edit with AI Button -->
      <button
        @click="aiGuideOpen = true"
        class="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:from-violet-500 hover:to-indigo-500 hover:shadow-lg active:scale-95 transition-all cursor-pointer relative overflow-hidden group"
        title="Learn how to edit this model with AI agents"
      >
        <!-- subtle shimmer -->
        <span class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
        <Sparkles class="w-3.5 h-3.5" />
        <span>Edit with AI</span>
        <ExternalLink class="w-3 h-3 text-violet-200" />
      </button>

      <!-- AI Guide Panel -->
      <AiGuidePanel :visible="aiGuideOpen" @close="aiGuideOpen = false" />

        <button 
          @click="documentStore.selectConcept('info')"
          :class="documentStore.activeConceptName === 'info' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'"
          class="p-1.5 rounded transition-colors cursor-pointer"
          title="View Model Status & Workspace Files"
        >
        <Info class="w-4 h-4" />
      </button>

      <!-- External links -->
      <div class="flex items-center gap-1 pl-2 border-l border-slate-200">
        <a
          href="https://innv0.com/FORMAT"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-2 py-1.5 rounded text-xs font-semibold text-slate-500 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
          title="Visit project website"
        >
          <Globe class="w-4 h-4" />
        </a>
        <a
          href="https://github.com/innV0/FORMAT"
          target="_blank"
          rel="noopener noreferrer"
          class="p-1.5 rounded text-slate-500 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
          title="View on GitHub"
        >
          <Github class="w-4 h-4" />
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Copy, FolderOpen, Save, ChevronDown, Folder, Trash2, FolderPlus, AlertTriangle, Info, Archive, Github, Globe, Sparkles, ExternalLink } from 'lucide-vue-next';
import { useWorkspaceStore } from '../../stores/workspace';
import { useDocumentStore } from '../../stores/document';
import type { BumpLevel } from '../../utils/version';
import AiGuidePanel from './AiGuidePanel.vue';

const workspaceStore = useWorkspaceStore();
const documentStore = useDocumentStore();

const dropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const saveDropdownOpen = ref(false);
const saveDropdownRef = ref<HTMLElement | null>(null);
const bumpError = ref('');

const aiGuideOpen = ref(false);

const fullFilePath = computed(() => {
  if (!workspaceStore.dirHandle || !workspaceStore.activeFileName) return '';
  return `${workspaceStore.dirHandle.name}/${workspaceStore.activeFileName}`;
});

const copyFilePath = async () => {
  if (fullFilePath.value) {
    try {
      await navigator.clipboard.writeText(fullFilePath.value);
    } catch {
      // clipboard not available
    }
  }
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const toggleSaveDropdown = () => {
  bumpError.value = '';
  saveDropdownOpen.value = !saveDropdownOpen.value;
};

const bumpVersion = async (level: BumpLevel) => {
  bumpError.value = '';
  const result = await documentStore.saveActiveFileWithVersionBump(level);
  if (result.ok) {
    saveDropdownOpen.value = false;
  } else {
    bumpError.value = result.error || 'Could not bump version.';
  }
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
  if (saveDropdownRef.value && !saveDropdownRef.value.contains(e.target as Node)) {
    saveDropdownOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  window.removeEventListener('click', closeDropdown);
});
</script>
