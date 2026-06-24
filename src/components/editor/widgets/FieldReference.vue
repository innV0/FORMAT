<template>
  <div class="relative">
    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 capitalize">
      {{ field.name.replace(/_/g, ' ') }}
    </label>
    <input
      type="text"
      :value="query"
      :disabled="readonly"
      @input="onInput"
      @focus="showDropdown = true"
      @blur="onBlur"
      placeholder="Search..."
      class="w-full mt-1 border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    />
    <ul
      v-if="showDropdown && filteredSuggestions.length > 0"
      class="absolute z-50 mt-1 w-full max-h-40 overflow-y-auto bg-white border border-slate-200 rounded-md shadow-lg text-xs"
    >
      <li
        v-for="suggestion in filteredSuggestions"
        :key="suggestion"
        @mousedown.prevent="selectSuggestion(suggestion)"
        class="px-3 py-1.5 cursor-pointer hover:bg-primary/5 text-slate-700"
      >
        {{ suggestion }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue';
import { UpdateFieldKey } from './injection';
import type { FieldDefinition } from '../../../types';
import { useDocumentStore } from '../../../stores/document';

const props = defineProps<{
  field: FieldDefinition;
  value: any;
  readonly: boolean;
}>();

const documentStore = useDocumentStore();
const updateField = inject(UpdateFieldKey, () => {});
const showDropdown = ref(false);
const query = ref(props.value || '');

const filteredSuggestions = computed(() => {
  const targets = props.field.target_concepts || [];
  const lowerQuery = query.value.toLowerCase();
  const matches: string[] = [];
  const visit = (nodes: typeof documentStore.modelTree) => {
    for (const node of nodes) {
      if (targets.length === 0 || targets.includes(node.type)) {
        if (!lowerQuery || node.name.toLowerCase().includes(lowerQuery)) {
          matches.push(node.name);
        }
      }
      if (node.children?.length) visit(node.children);
    }
  };
  visit(documentStore.modelTree);
  return matches;
});

const onInput = (event: Event) => {
  query.value = (event.target as HTMLInputElement).value;
  showDropdown.value = true;
  if (!query.value) {
    updateField(props.field.name, '');
  }
};

const selectSuggestion = (name: string) => {
  query.value = name;
  showDropdown.value = false;
  updateField(props.field.name, name);
};

const onBlur = () => {
  setTimeout(() => { showDropdown.value = false; }, 100);
};
</script>
