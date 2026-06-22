<template>
  <div class="flex flex-col flex-1 gap-4">
    <!-- Pinned concept Sheet at top -->
    <BlockSheet
      :block="conceptBlock"
      kind="concept"
      :concept-name="conceptName"
      :concept-type="conceptType"
      :concept-color="conceptColor"
      :concept-icon="conceptIcon"
      :concept-fields="conceptFields"
      :has-markers="hasMarkers"
      :collapsed="conceptCollapsed"
      :is-editing="editingId === 'concept'"
      :show-reorder="false"
      :show-delete="false"
      :show-add-child="isListConcept"
      @update:collapsed="conceptCollapsed = $event"
      @edit-toggle="toggleEdit('concept')"
      @add-child="$emit('add-item')"
      @change="$emit('change-concept')"
    />

    <!-- Instance Sheets (list concept only) -->
    <div v-if="isListConcept" class="pl-4 space-y-3">
      <div v-if="items.length === 0" class="text-center py-12 text-slate-400 italic text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
        No instances found. Use "+ Add Item" or create bullet points (- Name: Description) to begin.
      </div>

      <BlockSheet
        v-for="(item, idx) in items"
        :key="item.id"
        :block="item"
        kind="instance"
        :concept-name="conceptName"
        :concept-type="conceptType"
        :concept-color="conceptColor"
        :concept-icon="conceptIcon"
        :concept-fields="conceptFields"
        :has-markers="hasMarkers"
        :index="idx + 1"
        :is-list="true"
        :show-reorder="true"
        :show-delete="true"
        :is-first="idx === 0"
        :is-last="idx === items.length - 1"
        :collapsed="instanceCollapsed[item.id] ?? true"
        :is-editing="editingId === item.id"
        @update:collapsed="setInstanceCollapsed(item.id, $event)"
        @edit-toggle="toggleEdit(item.id)"
        @move-up="$emit('move-item-up', idx)"
        @move-down="$emit('move-item-down', idx)"
        @delete="$emit('delete-item', idx)"
        @change="$emit('change-item')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import BlockSheet from './BlockSheet.vue';
import type { BlockKind } from '../../utils/conceptVisuals';

interface ParsedItem {
  id: string;
  name: string;
  description: string;
  fields?: Record<string, any>;
  blockType?: string;
}

const props = withDefaults(defineProps<{
  conceptName: string;
  conceptType: string;
  conceptColor?: string;
  conceptIcon?: string;
  conceptFields?: any[];
  conceptBlock: { id?: string; name: string; description: string; fields?: Record<string, any> };
  items: ParsedItem[];
  isListConcept: boolean;
  hasMarkers?: boolean;
}>(), {
  conceptColor: '',
  conceptIcon: '',
  conceptFields: () => [],
  hasMarkers: false,
});

defineEmits<{
  (e: 'change-concept'): void;
  (e: 'change-item'): void;
  (e: 'add-item'): void;
  (e: 'delete-item', index: number): void;
  (e: 'move-item-up', index: number): void;
  (e: 'move-item-down', index: number): void;
}>();

// Single-active-editor state: at most ONE editor open at a time
const editingId = ref<string | null>(null);

// Collapse state for concept sheet and instance sheets.
// A list concept's sheet is pure context (collapse it); a single-block concept's
// sheet IS the content, so it starts expanded for immediate read/edit.
const conceptCollapsed = ref(props.isListConcept);
const instanceCollapsed = reactive<Record<string, boolean>>({});

const toggleEdit = (key: string) => {
  editingId.value = editingId.value === key ? null : key;
};

const setInstanceCollapsed = (id: string, val: boolean) => {
  instanceCollapsed[id] = val;
};
</script>
