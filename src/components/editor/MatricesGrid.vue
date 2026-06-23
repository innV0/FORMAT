<template>
  <div class="flex-1 flex flex-col min-h-0">
    <!-- Matrix Dropdown Selector Header -->
    <div class="flex items-center justify-between border-b border-slate-200 pb-3 shrink-0 mb-4 bg-slate-50 p-2 rounded-lg gap-3">
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-slate-500">Select Matrix:</span>
        <div v-if="documentStore.metamatrix.length" ref="dropdownRef" class="relative">
          <button 
            @click="isOpen = !isOpen"
            class="min-w-[200px] flex items-center justify-between gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-700 shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer transition-all"
          >
            <span class="truncate">{{ activeMatrix ? activeMatrix.name : 'Select Matrix' }}</span>
            <ChevronDown class="w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
          </button>

          <!-- Dropdown Menu -->
          <div 
            v-if="isOpen" 
            class="absolute left-0 z-20 mt-1 w-64 bg-white border border-slate-200 rounded-md shadow-lg py-1 max-h-60 overflow-y-auto"
          >
            <button
              v-for="(matrix, idx) in documentStore.metamatrix"
              :key="matrix.name"
              @click="selectMatrix(idx)"
              class="w-full flex flex-col px-3 py-2 text-left hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
              :class="{ 'bg-indigo-50/30 text-indigo-600': documentStore.activeGeneratedMatrixIndex === idx }"
            >
              <div class="flex items-center justify-between w-full">
                <span class="text-xs font-semibold truncate" :class="{ 'text-indigo-600': documentStore.activeGeneratedMatrixIndex === idx, 'text-slate-700': documentStore.activeGeneratedMatrixIndex !== idx }">
                  {{ matrix.name }}
                </span>
                <Check v-if="documentStore.activeGeneratedMatrixIndex === idx" class="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-2" />
              </div>
              <div class="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                <span>{{ matrix.source }}</span>
                <span>➔</span>
                <span>{{ matrix.target }}</span>
              </div>
            </button>
          </div>
        </div>
        <div v-else class="text-slate-400 text-xs italic">
          No relational matrices defined. Define them in Metamatrix Config.
        </div>
      </div>
      
      <div v-if="activeMatrix" class="text-slate-400 text-xs font-medium">
        Total: {{ documentStore.metamatrix.length }} matrices
      </div>
    </div>

    <!-- Active Matrix View -->
    <div v-if="activeMatrix" class="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Matrix:</span>
          <BlockPill kind="concept" :concept-type="activeMatrix.source" />
          <span class="text-slate-400">➔</span>
          <BlockPill kind="concept" :concept-type="activeMatrix.target" />
          <Badge class="text-slate-500 bg-slate-100">{{ activeMatrix.widgetType }}</Badge>
        </div>
        
        <button 
          @click="copyMatrixMarkdown" 
          class="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-[11px] font-semibold text-slate-700 cursor-pointer shadow-2xs"
        >
          <Copy class="w-3 h-3 text-slate-500" />
          Copy Table MD
        </button>
      </div>

      <!-- Relational Data Table -->
      <div class="border border-slate-200 rounded-lg overflow-x-auto max-w-full">
        <table class="min-w-full border-collapse text-xs">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="border-r border-slate-200 px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50 min-w-[150px]">
                <div class="flex items-center gap-1 flex-wrap">
                  <BlockPill kind="concept" :concept-type="activeMatrix.source" />
                  <span class="text-slate-400 font-normal">\</span>
                  <BlockPill kind="concept" :concept-type="activeMatrix.target" />
                </div>
              </th>
              <th 
                v-for="col in columns" 
                :key="col"
                class="px-3 py-3 text-center min-w-[100px] border-r border-slate-100"
              >
                <BlockPill kind="instance" :concept-type="activeMatrix.target" :name="col" :interactive="true" />
              </th>
              <th v-if="!columns.length" class="px-3 py-3 text-center font-bold text-slate-400">
                No items defined in {{ activeMatrix.target }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100">
            <tr v-for="row in rows" :key="row">
              <td class="border-r border-slate-200 px-4 py-2.5 sticky left-0 bg-white shadow-2xs min-w-[150px]">
                <BlockPill kind="instance" :concept-type="activeMatrix.source" :name="row" :interactive="true" />
              </td>
              
              <td 
                v-for="col in columns" 
                :key="col"
                class="px-2 py-2 text-center border-r border-slate-100"
              >
                <!-- 1. Widget Boolean Checkbox -->
                <div v-if="activeMatrix.widgetType === 'boolean'" class="flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    :checked="getVal(row, col) === 'X' || getVal(row, col) === true"
                    @change="setVal(row, col, ($event.target as HTMLInputElement).checked ? 'X' : '-')"
                    class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  >
                </div>

                <!-- 2. Widget Cycle Buttons -->
                <button 
                  v-else-if="activeMatrix.widgetType === 'cycle'"
                  @click="documentStore.rotateMatrixCellCycle(activeMatrix.name, row, col, activeMatrix.params)"
                  :class="[
                    documentStore.getCycleBgColor(getVal(row, col)),
                    'px-2 py-1 rounded border text-[10px] font-bold w-full transition-all cursor-pointer'
                  ]"
                >
                  {{ getVal(row, col) || 'Neutral' }}
                </button>

                <!-- 3. Widget Rating Scale -->
                <select 
                  v-else-if="activeMatrix.widgetType === 'scale'"
                  :value="getVal(row, col) === '-' ? '' : getVal(row, col)"
                  @change="setVal(row, col, ($event.target as HTMLSelectElement).value || '-')"
                  class="border rounded px-1.5 py-1 text-[10px] w-full text-center outline-none focus:ring-1 focus:ring-indigo-500 border-slate-200"
                >
                  <option value="">-</option>
                  <option v-for="num in scaleRange" :key="num" :value="num">{{ num }}</option>
                </select>

                <!-- 4. Widget Custom Set Options -->
                <select 
                  v-else-if="activeMatrix.widgetType === 'set'"
                  :value="getVal(row, col) === '-' ? '' : getVal(row, col)"
                  @change="setVal(row, col, ($event.target as HTMLSelectElement).value || '-')"
                  class="border rounded px-1.5 py-1 text-[10px] w-full outline-none focus:ring-1 focus:ring-indigo-500 border-slate-200"
                >
                  <option value="">-</option>
                  <option v-for="opt in documentStore.getSetOptionsList(activeMatrix.params)" :key="opt" :value="opt">{{ opt }}</option>
                </select>

                <!-- 5. Widget Free Text -->
                <input
                  v-else-if="activeMatrix.widgetType === 'text'"
                  type="text"
                  :value="getVal(row, col) === '-' ? '' : getVal(row, col)"
                  @input="setVal(row, col, ($event.target as HTMLInputElement).value || '-')"
                  placeholder="-"
                  class="border rounded px-1.5 py-1 text-[10px] w-full outline-none focus:ring-1 focus:ring-indigo-500 border-slate-200"
                >
              </td>
            </tr>
            <tr v-if="!rows.length">
              <td :colspan="columns.length + 1" class="text-center text-slate-400 text-xs italic py-6">
                No items defined in {{ activeMatrix.source }}. Make sure to add items to the hierarchy tree.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { Copy, ChevronDown, Check } from 'lucide-vue-next';
import { useDocumentStore } from '../../stores/document';
import { useMetamodelStore } from '../../stores/metamodel';
import BlockPill from './BlockPill.vue';
import Badge from '../ui/Badge.vue';

const documentStore = useDocumentStore();
const metamodelStore = useMetamodelStore();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const selectMatrix = (idx: number) => {
  documentStore.activeGeneratedMatrixIndex = idx;
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const activeMatrix = computed(() => {
  if (documentStore.metamatrix.length === 0) return null;
  return documentStore.metamatrix[documentStore.activeGeneratedMatrixIndex];
});

const rows = computed(() => {
  if (!activeMatrix.value) return [];
  return documentStore.getMatrixRowsList(activeMatrix.value.source);
});

const columns = computed(() => {
  if (!activeMatrix.value) return [];
  return documentStore.getMatrixColsList(activeMatrix.value.target);
});

const scaleRange = computed(() => {
  if (!activeMatrix.value) return [];
  // Parse params like "min:1;max:5"
  const params = activeMatrix.value.params;
  const minMatch = params.match(/min:(\d+)/);
  const maxMatch = params.match(/max:(\d+)/);
  const min = minMatch ? parseInt(minMatch[1]) : 1;
  const max = maxMatch ? parseInt(maxMatch[1]) : 5;
  const range: number[] = [];
  for (let i = min; i <= max; i++) range.push(i);
  return range;
});

const getVal = (row: string, col: string) => {
  if (!activeMatrix.value) return '';
  const key = `${activeMatrix.value.name}||${row}||${col}`;
  return documentStore.matrixValues[key] !== undefined ? documentStore.matrixValues[key] : '-';
};

const setVal = (row: string, col: string, value: string | number | boolean) => {
  if (!activeMatrix.value) return;
  const key = `${activeMatrix.value.name}||${row}||${col}`;
  documentStore.matrixValues[key] = value;
  documentStore.triggerUnsavedChanges();
};

const copyMatrixMarkdown = () => {
  if (!activeMatrix.value) return;
  let md = `| ${activeMatrix.value.source} \\ ${activeMatrix.value.target} | ` + columns.value.join(' | ') + ' |\n';
  md += `| :--- | ` + columns.value.map(() => ':---:').join(' | ') + ' |\n';
  rows.value.forEach(row => {
    const colsVal = columns.value.map(col => {
      const val = getVal(row, col);
      return val !== undefined ? val : '-';
    });
    md += `| **${row}** | ` + colsVal.join(' | ') + ' |\n';
  });

  navigator.clipboard.writeText(md);
  alert('Matrix Markdown copied to clipboard!');
};
</script>
