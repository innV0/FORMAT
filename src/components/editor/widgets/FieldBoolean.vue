<template>
  <div class="flex items-center gap-2 py-2">
    <input
      type="checkbox"
      :id="'field-' + field.name"
      :checked="!!value"
      :disabled="readonly"
      @change="updateField(field.name, ($event.target as HTMLInputElement).checked)"
      class="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    />
    <label
      :for="'field-' + field.name"
      class="text-xs font-semibold text-slate-700 cursor-pointer capitalize"
    >
      {{ field.name.replace(/_/g, ' ') }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { UpdateFieldKey } from './injection';
import type { FieldDefinition } from '../../../types';

const props = defineProps<{
  field: FieldDefinition;
  value: any;
  readonly: boolean;
}>();

const updateField = inject(UpdateFieldKey, () => {});
</script>
