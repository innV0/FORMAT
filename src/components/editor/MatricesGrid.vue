<template>
  <div class="flex-1 flex flex-col min-h-0">
    <!-- Matrix Tabs Header -->
    <div class="flex border-b border-slate-200 overflow-x-auto shrink-0 mb-4 bg-slate-50 p-1 rounded-md">
      <button 
        v-for="(matrix, idx) in documentStore.metamatrix" 
        :key="matrix.name"
        @click="documentStore.activeGeneratedMatrixIndex = idx"
        :class="[
          documentStore.activeGeneratedMatrixIndex === idx 
            ? 'bg-white text-indigo-600 font-semibold shadow-xs' 
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50',
          'px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap cursor-pointer transition-all'
        ]"
      >
        {{ matrix.name }}
      </button>
      <div v-if="!documentStore.metamatrix.length" class="text-slate-400 text-xs italic p-2 mx-auto">
        No relational matrices defined. Define them in Metamatrix Config.
      </div>
    </div>

    <!-- Active Matrix View -->
    <div v-if="activeMatrix" class="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Matrix:</span>
          <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border" :class="[sourceColorClasses.bg, sourceColorClasses.text, sourceColorClasses.border]">
            <span v-if="sourceConceptEmoji" class="mr-0.5">{{ sourceConceptEmoji }}</span>{{ activeMatrix.source }}
          </span>
          <span class="text-slate-400">➔</span>
          <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border" :class="[targetColorClasses.bg, targetColorClasses.text, targetColorClasses.border]">
            <span v-if="targetConceptEmoji" class="mr-0.5">{{ targetConceptEmoji }}</span>{{ activeMatrix.target }}
          </span>
          <span class="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {{ activeMatrix.widgetType }}
          </span>
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
                  <span class="px-1.5 py-0.5 rounded text-[9px] font-bold border" :class="[sourceColorClasses.bg, sourceColorClasses.text, sourceColorClasses.border]">
                    {{ activeMatrix.source }}
                  </span>
                  <span class="text-slate-400 font-normal">\</span>
                  <span class="px-1.5 py-0.5 rounded text-[9px] font-bold border" :class="[targetColorClasses.bg, targetColorClasses.text, targetColorClasses.border]">
                    {{ activeMatrix.target }}
                  </span>
                </div>
              </th>
              <th 
                v-for="col in columns" 
                :key="col"
                class="px-3 py-3 text-center min-w-[100px] border-r border-slate-100"
              >
                <span class="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold border whitespace-nowrap" :class="[targetColorClasses.bg, targetColorClasses.text, targetColorClasses.border]">
                  <span v-if="targetConceptEmoji">{{ targetConceptEmoji }}</span>
                  {{ col }}
                </span>
              </th>
              <th v-if="!columns.length" class="px-3 py-3 text-center font-bold text-slate-400">
                No items defined in {{ activeMatrix.target }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100">
            <tr v-for="row in rows" :key="row">
              <td class="border-r border-slate-200 px-4 py-2.5 sticky left-0 bg-white shadow-2xs min-w-[150px]">
                <span class="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold border whitespace-nowrap" :class="[sourceColorClasses.bg, sourceColorClasses.text, sourceColorClasses.border]">
                  <span v-if="sourceConceptEmoji">{{ sourceConceptEmoji }}</span>
                  {{ row }}
                </span>
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
import { computed } from 'vue';
import { Copy } from 'lucide-vue-next';
import { useDocumentStore } from '../../stores/document';
import { useMetamodelStore } from '../../stores/metamodel';
import { getColorClasses } from '../../utils/colors';

const documentStore = useDocumentStore();
const metamodelStore = useMetamodelStore();

const activeMatrix = computed(() => {
  if (documentStore.metamatrix.length === 0) return null;
  return documentStore.metamatrix[documentStore.activeGeneratedMatrixIndex];
});

const sourceConceptEmoji = computed(() => {
  if (!activeMatrix.value) return '';
  return metamodelStore.getConceptByName(activeMatrix.value.source)?.emoji || '';
});

const targetConceptEmoji = computed(() => {
  if (!activeMatrix.value) return '';
  return metamodelStore.getConceptByName(activeMatrix.value.target)?.emoji || '';
});

const sourceConceptColor = computed(() => {
  if (!activeMatrix.value) return '';
  return metamodelStore.getConceptByName(activeMatrix.value.source)?.color || '';
});

const targetConceptColor = computed(() => {
  if (!activeMatrix.value) return '';
  return metamodelStore.getConceptByName(activeMatrix.value.target)?.color || '';
});

const sourceColorClasses = computed(() => getColorClasses(sourceConceptColor.value));
const targetColorClasses = computed(() => getColorClasses(targetConceptColor.value));

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
