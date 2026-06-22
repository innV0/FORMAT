<template>
  <div class="flex flex-1 min-h-[400px] overflow-hidden w-full">
    <!-- Detail Editor Column (100% width) -->
    <div class="flex-1 border border-slate-200 rounded-lg p-6 bg-white flex flex-col justify-between overflow-y-auto">
      <BlockSheet
        v-if="documentStore.selectedNode"
        :block="documentStore.selectedNode"
        :kind="'instance'"
        :concept-name="documentStore.selectedNodeType"
        :concept-type="selectedNodeConceptType || 'text'"
        :concept-icon="conceptIcon"
        :concept-color="conceptColor"
        :concept-fields="conceptFields"
        :has-markers="selectedNodeConceptType === 'weight'"
        :show-delete="true"
        :collapsed="isCollapsed"
        :is-editing="isEditing"
        @update:collapsed="isCollapsed = $event"
        @edit-toggle="isEditing = !isEditing"
        @delete="documentStore.deleteTreeNode(documentStore.selectedNode.id)"
        @change="documentStore.triggerUnsavedChanges()"
      />

      <!-- Fallback when no node is selected -->
      <div v-else class="text-slate-400 text-xs italic text-center my-auto flex flex-col items-center justify-center gap-2.5">
        <FolderOpen class="w-8 h-8 text-slate-300" />
        <span>Select a node in the left hierarchy tree to modify its properties and metadata scores.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { FolderOpen } from 'lucide-vue-next';
import { useDocumentStore } from '../../stores/document';
import { useMetamodelStore } from '../../stores/metamodel';
import BlockSheet from './BlockSheet.vue';

const documentStore = useDocumentStore();
const metamodelStore = useMetamodelStore();

const isCollapsed = ref(false);
const isEditing = ref(false);

// Reset edit state when selected node changes
watch(() => documentStore.selectedNode?.id, () => {
  isEditing.value = false;
  isCollapsed.value = false;
});

const selectedNodeConceptType = computed(() => {
  if (!documentStore.selectedNodeType) return null;
  return metamodelStore.getConceptByName(documentStore.selectedNodeType)?.type || null;
});

const conceptIcon = computed(() => {
  return metamodelStore.getConceptByName(documentStore.selectedNodeType)?.icon || '';
});

const conceptColor = computed(() => {
  return metamodelStore.getConceptByName(documentStore.selectedNodeType)?.color || '';
});

interface MetamodelField {
  name: string;
  type?: 'string' | 'boolean' | 'number' | 'select' | string;
  options?: string[];
  choices?: string[];
  default?: any;
}

const conceptFields = computed<MetamodelField[]>(() => {
  if (!documentStore.selectedNodeType) return [];
  const concept = metamodelStore.getConceptByName(documentStore.selectedNodeType);
  if (!concept) return [];
  const fields = (concept as any).fields;
  if (Array.isArray(fields)) {
    return fields.map((f: any): MetamodelField | null => {
      if (typeof f === 'string') {
        return { name: f, type: 'string' };
      }
      if (f && typeof f === 'object' && typeof f.name === 'string') {
        return {
          name: f.name,
          type: f.type || 'string',
          options: f.options || f.choices || undefined,
          default: f.default
        };
      }
      return null;
    }).filter((f): f is MetamodelField => f !== null);
  }
  return [];
});
</script>
