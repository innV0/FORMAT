<template>
  <div>
    <label class="text-[10px] font-bold uppercase tracking-wider text-slate-400 capitalize">
      {{ field.name.replace(/_/g, ' ') }}
    </label>
    <input
      type="number"
      :value="value"
      :disabled="readonly"
      @input="updateField(field.name, ($event.target as HTMLInputElement).value === '' ? '' : Number(($event.target as HTMLInputElement).value))"
      class="w-full mt-1 border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    />
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
