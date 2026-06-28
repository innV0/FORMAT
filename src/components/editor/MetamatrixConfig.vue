<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center pb-2 border-b">
      <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Dynamic Relational Matrices Definitions</h3>
      <button 
        @click="documentStore.addMetamatrixRow" 
        class="bg-primary hover:bg-primary/90 text-white text-xs px-2.5 py-1.5 rounded font-semibold cursor-pointer"
      >
        + Add New Matrix Config
      </button>
    </div>

    <!-- Table definition matrix -->
    <div class="border rounded-lg overflow-hidden shadow-2xs">
      <table class="min-w-full divide-y divide-slate-200">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Matrix Name</th>
            <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
            <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Target</th>
            <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Label (relación)</th>
            <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Widget</th>
            <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Parameters</th>
            <th class="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-slate-200">
          <tr v-for="(row, index) in documentStore.metamatrix" :key="index">
            <td class="px-4 py-2.5">
              <input 
                v-model="row.name" 
                @input="documentStore.triggerUnsavedChanges"
                class="border rounded px-2 py-1 text-xs w-full outline-none focus:ring-1 focus:ring-primary border-slate-200"
              >
            </td>
            <td class="px-4 py-2.5">
              <select 
                v-model="row.source" 
                @change="documentStore.triggerUnsavedChanges"
                class="border rounded px-2 py-1 text-xs w-full outline-none focus:ring-1 focus:ring-primary border-slate-200"
              >
                <option v-for="c in instantiableConcepts" :key="c" :value="c">{{ c }}</option>
              </select>
            </td>
            <td class="px-4 py-2.5">
              <select 
                v-model="row.target" 
                @change="documentStore.triggerUnsavedChanges"
                class="border rounded px-2 py-1 text-xs w-full outline-none focus:ring-1 focus:ring-primary border-slate-200"
              >
                <option v-for="c in listConcepts" :key="c" :value="c">{{ c }}</option>
              </select>
            </td>
            <td class="px-4 py-2.5">
              <input 
                v-model="row.label" 
                @input="documentStore.triggerUnsavedChanges"
                placeholder="e.g. impacts, belongs to" 
                class="border rounded px-2 py-1 text-xs w-full outline-none focus:ring-1 focus:ring-primary border-slate-200"
              >
            </td>
            <td class="px-4 py-2.5">
              <select 
                v-model="row.widgetType" 
                @change="documentStore.triggerUnsavedChanges"
                class="border rounded px-2 py-1 text-xs w-full outline-none focus:ring-1 focus:ring-primary border-slate-200"
              >
                <option value="boolean">Boolean Checkbox</option>
                <option value="cycle">Options Cycle Button</option>
                <option value="scale">Rating Scale Input</option>
                <option value="set">Custom Selection Set</option>
                <option value="text">Free Text</option>
              </select>
            </td>
            <td class="px-4 py-2.5">
              <input 
                v-model="row.params" 
                @input="documentStore.triggerUnsavedChanges"
                placeholder="e.g. min:1;max:5 or Low;Medium;High" 
                class="border rounded px-2 py-1 text-xs w-full outline-none focus:ring-1 focus:ring-primary border-slate-200"
              >
            </td>
            <td class="px-4 py-2.5 text-right">
              <button 
                @click="documentStore.deleteMetamatrixRow(index)" 
                class="text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold px-2 py-1 rounded border border-rose-200 cursor-pointer flex items-center gap-1.5 ml-auto"
              >
                <Trash2 class="w-3 h-3 text-rose-700" />
                Remove
              </button>
            </td>
          </tr>
          <tr v-if="!documentStore.metamatrix.length">
            <td colspan="7" class="text-center text-slate-400 text-xs italic py-6">
              No relational matrices configured. Click "+ Add New Matrix Config" to define one.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Trash2 } from 'lucide-vue-next';
import { useDocumentStore } from '../../stores/document';
import { useMetamodelStore } from '../../stores/metamodel';

const documentStore = useDocumentStore();
const metamodelStore = useMetamodelStore();

const instantiableConcepts = computed(() => metamodelStore.hierarchyConcepts);

const listConcepts = computed(() => {
  return metamodelStore.concepts
    .filter(c => c.type !== 'category')
    .map(c => c.name);
});
</script>
