<template>
  <div v-if="hasRelationships" class="mt-6 border-t border-slate-200/60 pt-4">
    <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
      <GitFork class="w-3.5 h-3.5 text-slate-400" />
      Lenses & Relationships (Neighborhood)
    </h4>
    
    <div class="space-y-4">
      <div 
        v-for="n in neighborhoods" 
        :key="n.lens.id" 
        class="border border-slate-200/60 rounded-xl p-3.5 bg-slate-50/30 flex flex-col gap-2.5 transition-all duration-200 hover:bg-slate-50/60"
      >
        <!-- Lens Header -->
        <div class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <IconRenderer 
            :icon="n.lens.icon || 'layers'" 
            custom-class="w-3.5 h-3.5 text-slate-400" 
          />
          <span>Lente: {{ n.lens.name }}</span>
        </div>
        
        <!-- Graph Visualization (Grid 3 Columns + Connectors) -->
        <div class="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3 py-1.5">
          
          <!-- 1. Parents List -->
          <div class="flex flex-col gap-1.5 items-end justify-center min-w-0">
            <button
              v-for="parent in n.parents"
              :key="parent"
              @click="navigateToConcept(parent)"
              class="w-full truncate text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/10 transition-all duration-150 shadow-3xs text-right cursor-pointer font-medium hover:scale-[1.02]"
              :title="`Navigate to ${parent}`"
            >
              {{ parent }}
            </button>
            <span v-if="n.parents.length === 0" class="text-[10px] text-slate-400 italic pr-1 select-none">
              No parents
            </span>
          </div>
          
          <!-- 2. Left Connector -->
          <div class="flex items-center justify-center text-slate-300 shrink-0 select-none">
            <ArrowRight v-if="n.parents.length > 0" class="w-3.5 h-3.5 animate-pulse" />
            <div v-else class="w-3.5 h-3.5"></div>
          </div>
          
          <!-- 3. Active Concept (Central) -->
          <div class="flex justify-center min-w-0">
            <div 
              class="w-full truncate text-[11px] px-3 py-1.5 rounded-lg font-bold border-2 shadow-sm text-center select-none"
              :class="[activePalette.bg, activePalette.text, activePalette.border]"
            >
              {{ conceptName }}
            </div>
          </div>
          
          <!-- 4. Right Connector -->
          <div class="flex items-center justify-center text-slate-300 shrink-0 select-none">
            <ArrowRight v-if="n.children.length > 0" class="w-3.5 h-3.5 animate-pulse" />
            <div v-else class="w-3.5 h-3.5"></div>
          </div>
          
          <!-- 5. Children List -->
          <div class="flex flex-col gap-1.5 items-start justify-center min-w-0">
            <button
              v-for="child in n.children"
              :key="child"
              @click="navigateToConcept(child)"
              class="w-full truncate text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/10 transition-all duration-150 shadow-3xs text-left cursor-pointer font-medium hover:scale-[1.02]"
              :title="`Navigate to ${child}`"
            >
              {{ child }}
            </button>
            <span v-if="n.children.length === 0" class="text-[10px] text-slate-400 italic pl-1 select-none">
              No children
            </span>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ArrowRight, GitFork } from 'lucide-vue-next';
import { useMetamodelStore } from '../../stores/metamodel';
import { useDocumentStore } from '../../stores/document';
import { getColorClasses } from '../../utils/colors';
import IconRenderer from './IconRenderer.vue';

const props = defineProps<{
  conceptName: string;
  conceptColor?: string;
}>();

const metamodelStore = useMetamodelStore();
const documentStore = useDocumentStore();

const neighborhoods = computed(() => {
  return metamodelStore.getConceptLenses(props.conceptName);
});

const hasRelationships = computed(() => {
  return neighborhoods.value.length > 0;
});

const activePalette = computed(() => {
  // Use the concept's theme color or fallback to indigo/slate
  return getColorClasses(props.conceptColor || 'indigo');
});

const navigateToConcept = (name: string) => {
  documentStore.selectConcept(name);
};
</script>
