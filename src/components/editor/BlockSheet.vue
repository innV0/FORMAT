<template>
  <div
    class="rounded-lg bg-slate-50 transition-all duration-200 flex flex-col relative"
  >
    <!-- Header: identity pill + controls -->
    <div
      class="flex items-center rounded-xl p-3 transition-all duration-150 gap-2 select-none text-slate-700"
    >
      <!-- Chevron expand/collapse -->
      <button
        @click.stop="$emit('update:collapsed', !collapsed)"
        aria-label="Toggle expand"
        class="p-0.5 hover:bg-current/10 rounded transition-colors cursor-pointer flex items-center justify-center shrink-0"
      >
        <ChevronDown
          class="w-3.5 h-3.5 transition-transform duration-200"
          :class="{ '-rotate-90': collapsed }"
        />
      </button>

      <!-- Identity pill -->
      <BlockPill
        :kind="kind"
        :concept-type="conceptName"
        :color="conceptColor"
        :icon="conceptIcon"
        :name="`${cleanConceptName}${index !== undefined ? ' #' + index : ''}`"
        class="flex-1"
      />

      <!-- Marker cycling toolbar -->
      <template v-if="hasMarkers && block.id">
        <span class="w-px h-3.5 bg-current/20 mx-0.5"></span>
        <MarkerTooltip
          v-for="marker in allMarkers"
          :key="marker.name"
          :marker="marker"
          :score="markerValue(marker.name)"
        >
          <component
            :is="getMarkerIcon(marker.name)"
            @click.stop="cycleMarker(marker.name)"
            class="cursor-pointer"
            :class="markerClassesFor(marker.name)"
          />
        </MarkerTooltip>
        <span class="w-px h-3.5 bg-current/20 mx-0.5"></span>
      </template>

      <!-- Add child -->
      <button
        v-if="showAddChild"
        @click.stop="$emit('add-child')"
        aria-label="Add child"
        class="p-0.5 hover:bg-current/10 rounded transition-all cursor-pointer flex items-center justify-center shrink-0"
      >
        <PlusCircle class="w-3.5 h-3.5" />
      </button>

      <!-- Reorder controls -->
      <template v-if="showReorder">
        <button
          @click.stop="$emit('move-up')"
          :disabled="isFirst"
          aria-label="Move up"
          class="p-0.5 hover:bg-current/10 disabled:opacity-20 rounded transition-all cursor-pointer flex items-center justify-center shrink-0"
        >
          <ArrowUp class="w-3 h-3" />
        </button>
        <button
          @click.stop="$emit('move-down')"
          :disabled="isLast"
          aria-label="Move down"
          class="p-0.5 hover:bg-current/10 disabled:opacity-20 rounded transition-all cursor-pointer flex items-center justify-center shrink-0"
        >
          <ArrowDown class="w-3 h-3" />
        </button>
      </template>

      <!-- Pencil edit button (sole edit entry point) -->
      <button
        @click.stop="$emit('edit-toggle')"
        aria-label="Edit"
        class="p-0.5 hover:bg-current/10 rounded transition-all cursor-pointer flex items-center justify-center shrink-0"
        :class="isEditing ? 'text-current' : 'text-current/60'"
      >
        <component :is="isEditing ? Check : Pencil" class="w-3.5 h-3.5" />
      </button>

      <!-- Delete -->
      <button
        v-if="showDelete"
        @click.stop="$emit('delete')"
        aria-label="Delete"
        class="p-0.5 text-current/50 hover:text-rose-600 hover:scale-105 active:scale-95 rounded transition-all cursor-pointer flex items-center justify-center shrink-0"
      >
        <Trash2 class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Block name (read or edit) -->
    <div class="px-4 pt-3 pb-1">
      <div v-if="!isEditing">
        <h3 class="text-lg font-bold break-words whitespace-normal leading-tight text-slate-800" :title="block.name || '(Empty)'">
          {{ block.name || '(Empty)' }}
        </h3>
      </div>
      <div v-else>
        <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Name</label>
        <input
          :value="block.name"
          @input="onNameInput"
          class="w-full mt-1 border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
          placeholder="Enter block name"
        >
      </div>
    </div>

    <!-- Fields breadcrumbs (always visible when there are fields) -->
    <div
      v-if="hasVisibleFields && !isEditing"
      class="px-4 py-1 flex flex-wrap gap-1.5 text-[10px] text-slate-500"
    >
      <span
        v-for="field in visibleFields"
        :key="field.name"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 font-medium border border-slate-200/60"
      >
        <span class="text-slate-400 mr-1 uppercase font-bold">{{ field.name.replace(/_/g, ' ') }}:</span>
        <span v-if="field.isWikiLink" class="text-indigo-600 underline decoration-dotted">[[{{ field.value }}]]</span>
        <span v-else>{{ field.value }}</span>
      </span>
    </div>

    <!-- Expandable body / edit form -->
    <div
      v-show="!collapsed || isEditing"
      class="overflow-hidden transition-all duration-300"
    >
      <div class="px-4 pb-4 pt-2 space-y-3 flex flex-col">

        <!-- Edit-mode field inputs -->
        <template v-if="isEditing">
          <div v-if="conceptFields && conceptFields.length" class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div v-for="field in conceptFields" :key="field.name">
              <component
                :is="resolveWidget(field.type || 'string')"
                :field="field"
                :value="block.fields && block.fields[field.name] !== undefined ? block.fields[field.name] : (field.default !== undefined ? field.default : (field.type === 'boolean' ? false : ''))"
                :readonly="false"
              />
            </div>
          </div>

          <!-- Description textarea -->
          <div class="flex flex-col min-h-[100px]">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description / Details</label>
            <textarea
              v-model="block.description"
              @input="onInput"
              rows="4"
              class="w-full mt-1 border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none resize-none flex-1"
              placeholder="Enter description (supports basic markdown)..."
            ></textarea>
          </div>
        </template>

        <!-- Read-mode expanded body -->
        <template v-else>
          <div
            class="prose prose-slate max-w-none text-xs text-slate-600 leading-relaxed break-words"
            v-html="renderedDescription"
          ></div>
          <BlockRelationships
            :block="block"
            :concept-name="conceptName"
            :concept-color="conceptColor"
          />
          <ConceptRelationshipGraph
            :concept-name="conceptName"
            :concept-color="conceptColor"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import { ChevronDown, ArrowUp, ArrowDown, Pencil, Check, Trash2, PlusCircle } from 'lucide-vue-next';
import BlockPill from './BlockPill.vue';
import MarkerTooltip from './MarkerTooltip.vue';
import ConceptRelationshipGraph from './ConceptRelationshipGraph.vue';
import BlockRelationships from './BlockRelationships.vue';
import { getMarkerIcon, getMarkerClasses } from './MarkerIcons';
import { useMetamodelStore } from '../../stores/metamodel';
import { renderInlineMarkdown } from '../../utils/renderMarkdown';
import { useDocumentStore } from '../../stores/document';
import { UpdateFieldKey } from './widgets/injection';
import { resolveWidget } from './widgets';
import { MARKER_CYCLE_COUNT } from '../../utils/constants';
import type { BlockKind } from '../../utils/conceptVisuals';

const props = withDefaults(defineProps<{
  block: { id?: string; name: string; description: string; fields?: Record<string, any> };
  kind: BlockKind;
  conceptType: string;
  conceptName: string;
  conceptFields?: any[];
  conceptColor?: string;
  conceptIcon?: string;
  collapsed: boolean;
  isEditing: boolean;
  hasMarkers?: boolean;
  index?: number;
  isList?: boolean;
  showDelete?: boolean;
  showReorder?: boolean;
  showAddChild?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}>(), {
  conceptFields: () => [],
  conceptColor: '',
  conceptIcon: '',
  hasMarkers: false,
  isList: false,
  showDelete: false,
  showReorder: false,
  showAddChild: false,
  isFirst: false,
  isLast: false,
});

const emit = defineEmits<{
  (e: 'update:collapsed', val: boolean): void;
  (e: 'edit-toggle'): void;
  (e: 'move-up'): void;
  (e: 'move-down'): void;
  (e: 'delete'): void;
  (e: 'add-child'): void;
  (e: 'change'): void;
  (e: 'update:field', fieldName: string, value: any): void;
}>();

const documentStore = useDocumentStore();
const metamodelStore = useMetamodelStore();

const allMarkers = computed(() => metamodelStore.markers);

const markerValue = (markerName: string) =>
  documentStore.getNodeMarkerValue(props.block.id ?? '', markerName);

const cycleMarker = (markerName: string) => {
  const id = props.block.id;
  if (!id) return;
  const current = documentStore.getNodeMarkerValue(id, markerName);
  documentStore.setNodeMarkerValue(id, markerName, (current + 1) % MARKER_CYCLE_COUNT);
  documentStore.triggerUnsavedChanges();
};

const markerClassesFor = (markerName: string) =>
  getMarkerClasses(markerName, documentStore.getNodeMarkerValue(props.block.id ?? '', markerName));

const cleanConceptName = computed(() => {
  const name = props.conceptName;
  return name.endsWith('s') ? name.slice(0, -1) : name;
});

const renderedDescription = computed(() => renderInlineMarkdown(props.block.description));

const visibleFields = computed(() => {
  if (!props.conceptFields || !props.block.fields) return [];
  return props.conceptFields
    .map(field => {
      const val = props.block.fields?.[field.name];
      if (val === undefined || val === '' || val === null || val === false) return null;
      const isReference = field.type === 'reference';
      return {
        name: field.name,
        value: typeof val === 'boolean' ? (val ? 'Yes' : 'No') : val,
        isWikiLink: isReference,
      };
    })
    .filter((f): f is { name: string; value: any; isWikiLink: boolean } => f !== null);
});

const hasVisibleFields = computed(() => visibleFields.value.length > 0);

const onInput = () => {
  documentStore.triggerUnsavedChanges();
  emit('change');
};

const onNameInput = (event: Event) => {
  const newName = (event.target as HTMLInputElement).value;
  const oldName = props.block.name;
  props.block.name = newName;

  // Determine rename context from component props
  const context: 'tree-node' | 'list-item' | 'concept' =
    props.kind === 'concept'
      ? 'concept'
      : props.isList
        ? 'list-item'
        : 'tree-node';

  documentStore.renameBlock(oldName, newName, context);
  emit('change');
};

const updateField = (fieldName: string, value: any) => {
  if (!props.block.fields) {
    (props.block as any).fields = {};
  }
  props.block.fields![fieldName] = value;
  onInput();
  emit('update:field', fieldName, value);
};

provide(UpdateFieldKey, updateField);
</script>
