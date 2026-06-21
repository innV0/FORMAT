<template>
  <div class="relative flex shrink-0 transition-all duration-300 ease-in-out" :class="[isCollapsed ? 'w-0' : 'w-80']">
    <!-- Collapse Button Trigger when Collapsed (Square Icon Button) -->
    <button 
      v-if="isCollapsed"
      @click="isCollapsed = false"
      class="absolute top-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-indigo-600 transition-all duration-200 cursor-pointer hover:scale-105"
      title="Show Guidance Panel"
    >
      <BookOpen class="w-4 h-4" />
    </button>

    <!-- Sidebar Container -->
    <aside 
      :class="[
        isCollapsed ? 'w-0 opacity-0 border-l-0 p-0 pointer-events-none' : 'w-80 opacity-100 border-l border-slate-200 p-6',
        'bg-slate-50 flex flex-col overflow-y-auto shrink-0 transition-all duration-300 ease-in-out relative h-full'
      ]"
    >
      <!-- Collapse Button Inside Sidebar (top right when open) -->
      <button 
        v-if="!isCollapsed"
        @click="isCollapsed = true"
        class="absolute top-4 right-4 z-10 flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
        title="Hide Guidance Panel"
      >
        <ChevronRight class="w-4 h-4" />
      </button>

      <!-- Associated Matrices Section (above the guidance) -->
      <div v-if="!isCollapsed && associatedMatrices.length" class="space-y-3 mt-8 mb-4 border-b border-slate-200/60 pb-4">
        <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <BarChart2 class="w-3.5 h-3.5 text-indigo-600" />
          Associated Matrices
        </h3>
        <div class="space-y-1.5">
          <button
            v-for="matrix in associatedMatrices"
            :key="matrix.name"
            @click="openAssociatedMatrix(matrix.index)"
            class="w-full flex items-center justify-between bg-white border border-slate-200 hover:border-indigo-400 rounded-lg p-2.5 text-xs text-slate-700 hover:bg-indigo-50/20 transition-all cursor-pointer shadow-3xs text-left group"
          >
            <div class="truncate flex-1">
              <span class="font-bold block truncate group-hover:text-indigo-600 transition-colors">{{ matrix.name }}</span>
              <span class="text-[10px] text-slate-400 block mt-0.5 font-medium">
                {{ matrix.source }} ➔ {{ matrix.target }}
              </span>
            </div>
            <ChevronRight class="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      <!-- Main Guidance Content -->
      <div v-if="guidance" class="space-y-6 mt-4">
        <!-- Title & Emoji -->
        <div>
          <div class="flex items-center gap-2">
            <IconRenderer :icon="guidance?.emoji" fallback="info" custom-class="w-6 h-6 text-indigo-600 shrink-0" />
            <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wide">
              {{ activeConcept }} Guidance
            </h2>
          </div>
          <p class="text-xs text-slate-500 mt-1">Methodology and instructions to fill this section.</p>
        </div>

        <!-- Summary -->
        <div v-if="guidance.summary" class="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-xs text-indigo-950 font-medium leading-relaxed">
          {{ guidance.summary }}
        </div>

        <!-- Description -->
        <div v-if="guidance.description" class="space-y-2">
          <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Methodology Description</h3>
          <div 
            class="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap"
            v-html="renderMarkdown(guidance.description)"
          ></div>
        </div>

        <!-- Methodologies -->
        <div v-if="guidance.methodologies" class="space-y-2 pt-2 border-t border-slate-200/60">
          <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Related Methodologies</h3>
          <div 
            class="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap bg-white/60 rounded-lg p-3 border border-slate-100"
            v-html="renderMarkdown(guidance.methodologies)"
          ></div>
        </div>

        <!-- Prompts / AI Guidance Suggestions -->
        <div v-if="prompts && prompts.length" class="space-y-2.5 pt-2 border-t border-slate-200/60">
          <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Suggested Prompts</h3>
          <div class="space-y-2">
            <div 
              v-for="(promptText, idx) in prompts" 
              :key="idx" 
              @click="copyPrompt(promptText)"
              class="group relative bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/20 transition-all cursor-pointer shadow-2xs"
            >
              <p class="font-mono leading-normal pr-8 select-all">{{ promptText }}</p>
              <span class="absolute top-2.5 right-2.5 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <Copy class="w-3.5 h-3.5 text-slate-400" />
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Fallback if metamatrix/matrices selected but no active matrix loaded yet -->
      <div v-else class="text-slate-400 text-xs italic text-center my-auto">
        No active concept or matrix guidance selected.
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Copy, ChevronRight, BookOpen, BarChart2 } from 'lucide-vue-next';
import { useDocumentStore } from '../../stores/document';
import IconRenderer from '../editor/IconRenderer.vue';

const documentStore = useDocumentStore();
const isCollapsed = ref(false);

const activeConcept = computed(() => documentStore.activeConceptName);
const guidance = computed(() => documentStore.getActiveConceptGuidance(activeConcept.value));

const associatedMatrices = computed(() => {
  const concept = activeConcept.value;
  if (!concept) return [];
  return documentStore.metamatrix.map((matrix, index) => ({
    ...matrix,
    index
  })).filter(matrix => 
    matrix.source.toLowerCase() === concept.toLowerCase() || 
    matrix.target.toLowerCase() === concept.toLowerCase()
  );
});

const openAssociatedMatrix = (index: number) => {
  documentStore.activeGeneratedMatrixIndex = index;
  documentStore.selectConcept('matrices');
};

const prompts = computed(() => {
  return documentStore.getCleanPrompts(activeConcept.value);
});

const copyPrompt = (text: string) => {
  navigator.clipboard.writeText(text);
  alert('Prompt copied to clipboard!');
};

const renderMarkdown = (text: string) => {
  if (!text) return '';
  // Bold **text** -> <strong>text</strong>
  let html = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-slate-800">$1</strong>');
  // Backticks `code` -> <code>code</code>
  html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1 py-0.5 rounded text-[10px] font-mono text-indigo-600 font-semibold">$1</code>');
  return html;
};
</script>
