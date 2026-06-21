<template>
  <div 
    class="border border-slate-200 rounded-lg p-5 bg-white shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col gap-4 relative"
    :class="[isList ? 'border-l-4' : '', isList ? colorClasses.borderLeft : '']"
  >
    <!-- Header Block (Giant Pill + Actions in Two Levels) -->
    <div 
      :class="[
        colorClasses.border,
        colorClasses.bg,
        colorClasses.text,
        'flex flex-col border-2 rounded-xl p-4 shadow-xs transition-all duration-150 gap-3 select-none'
      ]"
    >
      <!-- Level 1: Concept Type (with internal Opciones Expandidas) -->
      <div class="flex items-center w-full">
        <BlockPill 
          size="sm" 
          :block-id="block.id || block.name"
          :concept-type="conceptName" 
          :emoji="conceptEmoji"
          :name="`${cleanConceptName}${index !== undefined ? ' #' + index : ''}`"
          :show-markers="hasMarkers && !!(block.id || block.name)"
          :show-reorder="isList"
          :is-first="isFirst"
          :is-last="isLast"
          :show-edit="true"
          :is-editing="isEditing"
          :show-delete="showDelete"
          @move-up="$emit('move-up')"
          @move-down="$emit('move-down')"
          @edit-toggle="isEditing = !isEditing"
          @delete="$emit('delete')"
          class="w-full"
        />
      </div>

      <!-- Level 2: Block Name — one consistent treatment for every block. -->
      <div class="w-full">
        <h3 class="text-lg md:text-xl font-bold break-words whitespace-normal leading-tight" :title="block.name || '(Empty)'">
          {{ block.name || '(Empty)' }}
        </h3>
      </div>
    </div>

    <!-- Read-Only Mode -->
    <div v-if="!isEditing" class="space-y-2 flex-1 flex flex-col justify-between">
      <!-- Fields Breadcrumbs -->
      <div 
        v-if="hasVisibleFields" 
        class="flex flex-wrap gap-1.5 text-[10px] text-slate-500 border-b border-slate-100 pb-2 mb-1"
      >
        <span 
          v-for="field in visibleFields" 
          :key="field.name" 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 font-medium border border-slate-200/60"
        >
          <span class="text-slate-400 mr-1 uppercase font-bold">{{ field.name.replace(/_/g, ' ') }}:</span>
          <span>{{ field.value }}</span>
        </span>
      </div>

      <!-- Description Display -->
      <div 
        class="prose prose-slate max-w-none text-xs text-slate-600 leading-relaxed break-words" 
        v-html="renderedDescription"
      ></div>
    </div>

    <!-- Edit Mode Form Controls -->
    <div v-else class="space-y-3 flex-1 flex flex-col">
      <!-- Edit Block Name -->
      <div>
        <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Name</label>
        <input 
          v-model="block.name" 
          @input="onInput"
          class="w-full mt-1 border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
          placeholder="Enter block name"
        >
      </div>

      <!-- Custom Concept Fields inputs -->
      <div v-if="conceptFields && conceptFields.length" class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
        <div v-for="field in conceptFields" :key="field.name">
          <!-- Boolean checkbox -->
          <div v-if="field.type === 'boolean'" class="flex items-center gap-2 py-2">
            <input 
              type="checkbox"
              :id="'field-' + field.name"
              :checked="block.fields && block.fields[field.name] !== undefined ? !!block.fields[field.name] : (field.default !== undefined ? !!field.default : false)"
              @change="updateField(field.name, ($event.target as HTMLInputElement).checked)"
              class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
            >
            <label :for="'field-' + field.name" class="text-xs font-semibold text-slate-700 cursor-pointer capitalize">
              {{ field.name.replace(/_/g, ' ') }}
            </label>
          </div>

          <!-- Select/Dropdown selection -->
          <div v-else-if="field.type === 'select' || field.options">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 capitalize">{{ field.name.replace(/_/g, ' ') }}</label>
            <select 
              :value="block.fields && block.fields[field.name] !== undefined ? block.fields[field.name] : (field.default !== undefined ? field.default : '')"
              @change="updateField(field.name, ($event.target as HTMLSelectElement).value)"
              class="w-full mt-1 border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none bg-white cursor-pointer"
            >
              <option value="">- Select -</option>
              <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>

          <!-- Number input -->
          <div v-else-if="field.type === 'number'">
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 capitalize">{{ field.name.replace(/_/g, ' ') }}</label>
            <input 
              type="number"
              :value="block.fields && block.fields[field.name] !== undefined ? block.fields[field.name] : (field.default !== undefined ? field.default : '')"
              @input="updateField(field.name, ($event.target as HTMLInputElement).value === '' ? '' : Number(($event.target as HTMLInputElement).value))"
              class="w-full mt-1 border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
            >
          </div>

          <!-- Default string input -->
          <div v-else>
            <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 capitalize">{{ field.name.replace(/_/g, ' ') }}</label>
            <input 
              type="text"
              :value="block.fields && block.fields[field.name] !== undefined ? block.fields[field.name] : (field.default !== undefined ? field.default : '')"
              @input="updateField(field.name, ($event.target as HTMLInputElement).value)"
              class="w-full mt-1 border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
            >
          </div>
        </div>
      </div>

      <!-- Description / Details textarea -->
      <div class="flex-1 flex flex-col min-h-[100px]">
        <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description / Details</label>
        <textarea 
          v-model="block.description" 
          @input="onInput"
          rows="4" 
          class="w-full mt-1 border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none resize-none flex-1"
          placeholder="Enter description (supports basic markdown)..."
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDocumentStore } from '../../stores/document';
import { getColorClasses } from '../../utils/colors';
import { renderInlineMarkdown } from '../../utils/renderMarkdown';
import BlockPill from './BlockPill.vue';

const props = withDefaults(defineProps<{
  block: {
    id?: string;
    name: string;
    description: string;
    fields?: Record<string, any>;
  };
  conceptName: string;
  conceptType: string;
  conceptEmoji?: string;
  conceptColor?: string;
  conceptFields?: any[];
  hasMarkers?: boolean;
  showDelete?: boolean;
  index?: number;
  isList?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}>(), {
  conceptEmoji: '',
  conceptColor: '',
  conceptFields: () => [],
  hasMarkers: false,
  showDelete: false,
  isList: false,
  isFirst: false,
  isLast: false
});

const emit = defineEmits<{
  (e: 'update:name', val: string): void;
  (e: 'update:description', val: string): void;
  (e: 'update:field', fieldName: string, value: any): void;
  (e: 'cycle-marker', markerName: string): void;
  (e: 'move-up'): void;
  (e: 'move-down'): void;
  (e: 'delete'): void;
  (e: 'change'): void;
}>();

const documentStore = useDocumentStore();

const isEditing = ref(false);

const colorClasses = computed(() => {
  return getColorClasses(props.conceptColor);
});

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
      return {
        name: field.name,
        value: typeof val === 'boolean' ? (val ? 'Yes' : 'No') : val
      };
    })
    .filter((f): f is { name: string; value: any } => f !== null);
});

const hasVisibleFields = computed(() => visibleFields.value.length > 0);

const onInput = () => {
  documentStore.triggerUnsavedChanges();
  emit('change');
};

const updateField = (fieldName: string, value: any) => {
  if (!props.block.fields) {
    props.block.fields = {};
  }
  props.block.fields[fieldName] = value;
  onInput();
  emit('update:field', fieldName, value);
};
</script>
