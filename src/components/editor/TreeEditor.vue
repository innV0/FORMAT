<template>
  <div class="flex flex-1 min-h-[400px] overflow-hidden w-full">
    <!-- Detail Editor Column (100% width) -->
    <div class="flex-1 flex flex-col overflow-y-auto">
      <!-- Single node selected: show detail -->
      <template v-if="documentStore.selectedNode">
        <div class="flex-1 flex flex-col justify-between">
          <BlockSheet
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
        </div>
      </template>

      <!-- No node selected: show all concept instances as collapsed BlockSheets -->
      <template v-else-if="conceptInstances.length > 0">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0 mb-3">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {{ documentStore.activeConceptName }} ({{ conceptInstances.length }})
          </h4>
        </div>
        <div class="space-y-2">
          <BlockSheet
            v-for="(instance, idx) in conceptInstances"
            :key="instance.id"
            :block="instance"
            :kind="'instance'"
            :concept-name="documentStore.activeConceptName"
            :concept-type="activeConceptType || 'text'"
            :concept-icon="activeConceptIcon"
            :concept-color="activeConceptColor"
            :concept-fields="activeConceptFields"
            :has-markers="activeConceptType === 'weight'"
            :index="idx + 1"
            :show-delete="true"
            :collapsed="true"
            :disable-expand="true"
            :is-editing="editingInstanceId === instance.id"
            @edit-toggle="toggleEditInstance(instance.id)"
            @delete="documentStore.deleteTreeNode(instance.id)"
            @change="documentStore.triggerUnsavedChanges()"
          />
        </div>
      </template>

      <!-- Fallback when no node is selected and no instances -->
      <div v-else class="text-slate-400 text-xs italic text-center my-auto flex flex-col items-center justify-center gap-2.5">
        <FolderOpen class="w-8 h-8 text-slate-300" />
        <span>No elements yet. Add one from the left panel or create a &lt;!-- block: --&gt; entry in the text editor.</span>
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
import type { TreeNode } from '../../types';

const documentStore = useDocumentStore();
const metamodelStore = useMetamodelStore();

const isCollapsed = ref(false);
const isEditing = ref(false);

const editingInstanceId = ref<string | null>(null);

// Reset edit state and expand sheet when selected node changes
watch(() => documentStore.selectedNode?.id, () => {
  isEditing.value = false;
  isCollapsed.value = false;
}, { immediate: true });

// Reset editing state when active concept changes
watch(() => documentStore.activeConceptName, () => {
  editingInstanceId.value = null;
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

// Get all instances of the active concept from modelTree
const conceptInstances = computed(() => {
  const conceptName = documentStore.activeConceptName;
  if (!conceptName) return [];
  
  const instances: TreeNode[] = [];
  const walk = (nodes: TreeNode[]) => {
    for (const node of nodes) {
      if (node.type === conceptName) {
        instances.push(node);
      }
      if (node.children?.length) {
        walk(node.children);
      }
    }
  };
  walk(documentStore.modelTree);
  return instances;
});

// Active concept metadata for instances
const activeConceptType = computed(() => {
  const concept = metamodelStore.getConceptByName(documentStore.activeConceptName);
  return concept?.type || null;
});

const activeConceptIcon = computed(() => {
  return metamodelStore.getConceptByName(documentStore.activeConceptName)?.icon || '';
});

const activeConceptColor = computed(() => {
  return metamodelStore.getConceptByName(documentStore.activeConceptName)?.color || '';
});

interface MetamodelField {
  name: string;
  type?: 'string' | 'boolean' | 'number' | 'select' | string;
  options?: string[];
  choices?: string[];
  default?: any;
}

const activeConceptFields = computed<MetamodelField[]>(() => {
  const concept = metamodelStore.getConceptByName(documentStore.activeConceptName);
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

const toggleEditInstance = (id: string) => {
  editingInstanceId.value = editingInstanceId.value === id ? null : id;
};
</script>
