<template>
  <div>
    <label class="text-xs font-bold uppercase tracking-wider text-slate-400 capitalize">
      {{ field.name.replace(/_/g, ' ') }}
    </label>
    <select
      :value="value"
      :disabled="readonly"
      @change="updateField(field.name, ($event.target as HTMLSelectElement).value)"
      class="w-full mt-1 border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-primary outline-none bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="">- Select -</option>
      <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
    </select>
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
