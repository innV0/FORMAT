<template>
  <div v-if="participations.length > 0" class="mt-4 border-t border-slate-200/60 pt-4 space-y-3">
    <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
      <Table2 class="w-3.5 h-3.5 text-slate-400" />
      Matrix Relationships
    </h4>

    <div v-for="part in participations" :key="part.matrixName" class="space-y-1">
      <!-- Matrix name (clickable) -->
      <button
        @click="$emit('navigate-to-matrix', part.matrixIndex)"
        class="text-[10px] font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer uppercase tracking-wider"
      >
        {{ part.matrixName }}
      </button>

      <!-- Connections -->
      <div
        v-for="cell in part.cells"
        :key="cell.counterpart"
        class="flex items-center gap-1.5 text-[11px] pl-2"
      >
        <BlockPill
          kind="instance"
          :concept-type="part.role === 'source' ? conceptName : counterpartConcept(part)"
          :name="part.role === 'source' ? blockName : cell.counterpart"
          :block-id="resolveBlockId(part.role === 'source' ? blockName : cell.counterpart, part.role === 'source' ? conceptName : counterpartConcept(part))"
          class="shrink-0"
        />
        <ArrowRight class="w-3 h-3 text-slate-300 shrink-0" />
        <span
          :class="valueClasses(cell.value)"
          class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border shrink-0"
        >
          {{ formatValue(cell.value) }}
        </span>
        <ArrowRight class="w-3 h-3 text-slate-300 shrink-0" />
        <BlockPill
          kind="instance"
          :concept-type="part.role === 'source' ? counterpartConcept(part) : conceptName"
          :name="part.role === 'source' ? cell.counterpart : blockName"
          :block-id="resolveBlockId(part.role === 'source' ? cell.counterpart : blockName, part.role === 'source' ? counterpartConcept(part) : conceptName)"
          class="shrink-0"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Table2, ArrowRight } from 'lucide-vue-next';
import { useDocumentStore } from '../../stores/document';
import { useMetamodelStore } from '../../stores/metamodel';
import { findNodeByName } from '../../utils/tree';
import { slugify } from '../../utils/sanitize';
import BlockPill from './BlockPill.vue';

const props = defineProps<{
  blockName: string;
  conceptName: string;
}>();

defineEmits<{
  (e: 'navigate-to-matrix', matrixIndex: number): void;
}>();

const documentStore = useDocumentStore();
const metamodelStore = useMetamodelStore();

const isHierarchyConcept = (conceptName: string) =>
  metamodelStore.hierarchyConcepts.includes(conceptName);

const resolveBlockId = (name: string, conceptType: string): string | undefined => {
  if (isHierarchyConcept(conceptType)) {
    const node = findNodeByName(documentStore.modelTree, name);
    return node?.id;
  }
  // List concepts use stable generated IDs
  return `li-${slugify(conceptType)}-${slugify(name)}`;
};

const participations = computed(() =>
  documentStore.getBlockMatrixSummary(props.blockName, props.conceptName)
);

const counterpartConcept = (part: { role: 'source' | 'target'; matrixName: string }) => {
  const m = documentStore.metamatrix.find(m => m.name === part.matrixName);
  if (!m) return '';
  return part.role === 'source' ? m.target : m.source;
};

const formatValue = (val: string | number | boolean): string => {
  if (val === true || val === 'X') return 'X';
  if (val === false) return '-';
  return String(val);
};

const valueClasses = (val: string | number | boolean): string => {
  const cleanVal = String(val).trim().toLowerCase();
  if (cleanVal === '-' || cleanVal === '' || cleanVal === 'none') {
    return 'bg-white text-slate-400 border-slate-200';
  }
  if (cleanVal === 'x' || cleanVal === 'true' || cleanVal === 'yes') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
  if (cleanVal === 'false' || cleanVal === 'no') {
    return 'bg-slate-50 text-slate-500 border-slate-200';
  }
  return documentStore.getCycleBgColor(val);
};
</script>
