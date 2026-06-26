<template>
  <Transition name="fade">
    <div 
      v-if="workspaceStore.showConnectModal" 
      class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
    >
      <div 
        class="relative max-w-lg w-full bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-100 flex items-start gap-3 bg-slate-50">
          <div class="p-2 bg-primary/5 text-primary rounded-lg shrink-0">
            <FolderOpen class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900">
              Connect Workspace Folder
            </h3>
          </div>
          <button 
            @click="closeModal" 
            class="ml-auto p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Content/Body -->
        <div class="px-6 py-5 space-y-4 text-xs text-slate-600 leading-relaxed max-h-[70vh] overflow-y-auto">
          <!-- Important Notice -->
          <div class="bg-amber-50/70 border border-amber-200 rounded-lg p-3 flex gap-2.5">
            <AlertTriangle class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div class="space-y-1">
              <p class="font-semibold text-amber-900">
                Choose the folder, not the model file
              </p>
              <p class="text-[11px] text-amber-800">
                Select the <strong>parent directory/folder</strong> containing your model, not the model file itself. Windows will not let you select files in a folder picker.
              </p>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <p>
              When the native file dialog opens, navigate to the folder that contains your <code>.md</code> business model files and click <strong>"Select Folder"</strong>.
            </p>
          </div>

          <!-- Visual Diagram -->
          <div class="border border-slate-200 rounded-lg bg-slate-50 p-4 font-mono text-[11px] text-slate-700">
            <div class="flex items-center gap-1.5 font-semibold text-primary mb-2">
              <CheckCircle class="w-3.5 h-3.5" />
              <span>Correct Selection Structure</span>
            </div>
            
            <div class="space-y-1 bg-white p-3 rounded border border-slate-100">
              <div class="flex items-center gap-1.5 font-semibold text-slate-800">
                <FolderOpen class="w-3.5 h-3.5 text-primary shrink-0" />
                <span>[📁 Select this workspace folder]</span>
              </div>
              <div class="pl-4 border-l border-slate-200 ml-1.5 py-0.5 space-y-1">
                <div class="flex items-center gap-1.5 text-slate-400">
                  <FileText class="w-3.5 h-3.5 shrink-0" />
                  <span>📄 model_file.md</span>
                  <span class="text-[9px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">(Loaded automatically)</span>
                </div>
                <div class="flex items-center gap-1.5 text-slate-400">
                  <Folder class="w-3.5 h-3.5 shrink-0" />
                  <span>📁 backups</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Native Behavior Reminder -->
<div class="bg-primary/5 rounded-lg p-3 text-[11px] text-primary border border-primary/10">
            <p class="font-semibold mb-0.5">Windows Explorer Notice</p>
            <p>
              In the file dialog window, individual files inside the folder might be invisible or grayed out. Don't worry—just select the parent directory, and the app will load all models immediately.
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 shrink-0">
          <button 
            @click="closeModal" 
            class="px-4 py-2 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer transition-colors"
          >
            Cancel
          </button>
          
          <button 
            @click="proceedToPicker" 
            class="px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <FolderOpen class="w-3.5 h-3.5" />
            Select Folder
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { FolderOpen, X, AlertTriangle, FileText, Folder, CheckCircle } from 'lucide-vue-next';
import { useWorkspaceStore } from '../../stores/workspace';

const workspaceStore = useWorkspaceStore();

const closeModal = () => {
  workspaceStore.showConnectModal = false;
};

const proceedToPicker = async () => {
  await workspaceStore.connectFolder();
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
