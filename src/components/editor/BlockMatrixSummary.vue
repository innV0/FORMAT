<template>
  <div v-if="participations.length > 0" class="space-y-3">
    <div v-for="part in participations" :key="part.matrixName" class="space-y-1">
      <div
        v-for="cell in part.cells"
        :key="cell.counterpart"
        class="flex items-center gap-1.5 text-xs"
      >
        <BlockPill
          kind="instance"
          :concept-type="part.role === 'source' ? conceptName : counterpartConcept(part)"
          :name="part.role === 'source' ? blockName : cell.counterpart"
          :block-id="resolveBlockId(part.role === 'source' ? blockName : cell.counterpart, part.role === 'source' ? conceptName : counterpartConcept(part))"
          class="shrink-0"
        />
        <span
          class="text-xs font-semibold text-slate-400 px-1.5 py-0.5 rounded cursor-pointer hover:text-primary hover:bg-slate-100 transition-colors shrink-0"
          @click="$emit('navigate-to-matrix', part.matrixIndex)"
        >
          {{ part.matrixName }}
        </span>
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
  return `li-${slugify(conceptType)}-${slugify(name)}`;
};

const participations = computed(() =>
  documentStore.getBlockMatrixSummary(props.blockName, props.conceptName)
);

const getMatrixMeta = (matrixName: string) =>
  documentStore.metamatrix.find(m => m.name === matrixName);

const counterpartConcept = (part: { role: 'source' | 'target'; matrixName: string }) => {
  const m = getMatrixMeta(part.matrixName);
  if (!m) return '';
  return part.role === 'source' ? m.target : m.source;
};
</script>
