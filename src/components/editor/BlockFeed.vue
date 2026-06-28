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
        No elements yet. Add one with the '+' button above or use a &lt;!-- block: --&gt; entry in the markdown.
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
        :disable-expand="!selectedItemName || item.name !== selectedItemName"
        :is-first="idx === 0"
        :is-last="idx === items.length - 1"
        :collapsed="itemCollapsed(item)"
        :is-editing="editingId === item.id"
        @update:collapsed="onItemCollapsed(item, $event)"
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
import { ref, watch } from 'vue';
import BlockSheet from './BlockSheet.vue';
import type { BlockKind } from '../../utils/conceptVisuals';
import type { ParsedItem } from '../../types';

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
  selectedItemName?: string;
}>(), {
  conceptColor: '',
  conceptIcon: '',
  conceptFields: () => [],
  hasMarkers: false,
  selectedItemName: '',
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

// Per-item collapsed state tracking (user toggles via chevron).
// Keyed by item name so toggling persists across re-renders
// but resets when a different element is selected.
const collapsedOverrides = ref<Record<string, boolean>>({});

// A list concept's sheet is pure context (collapse it); a single-block concept's
// sheet IS the content, so it starts expanded for immediate read/edit.
const conceptCollapsed = ref(props.isListConcept);

const toggleEdit = (key: string) => {
  editingId.value = editingId.value === key ? null : key;
};

// Collapse the concept header when a specific element is selected
watch(() => props.selectedItemName, (name) => {
  // Reset per-item overrides when selection changes so the new item starts expanded
  collapsedOverrides.value = {};
  if (name) {
    conceptCollapsed.value = true;
  }
}, { immediate: true });

const itemCollapsed = (item: ParsedItem): boolean => {
  const override = collapsedOverrides.value[item.name];
  if (override !== undefined) return override;
  // Default: expanded only when it's the currently selected item
  return props.selectedItemName ? item.name !== props.selectedItemName : true;
};

const onItemCollapsed = (item: ParsedItem, val: boolean) => {
  collapsedOverrides.value = { ...collapsedOverrides.value, [item.name]: val };
};

</script>
