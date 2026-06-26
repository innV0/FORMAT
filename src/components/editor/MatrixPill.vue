<template>
  <component
    :is="as"
    :class="pillClasses"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <Table2 class="shrink-0 w-3.5 h-3.5 text-slate-400" />
    <div class="min-w-0 flex-1">
      <span class="font-semibold truncate block leading-tight">{{ name }}</span>
      <span v-if="showSourceTarget && source && target" class="text-[10px] text-slate-400 font-medium block leading-tight mt-0.5">
        {{ source }} <span class="text-slate-300">→</span> {{ target }}
      </span>
    </div>
    <ChevronRight v-if="interactive" class="shrink-0 w-3.5 h-3.5 text-slate-300 group-hover:text-primary transition-colors" />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Table2, ChevronRight } from 'lucide-vue-next';

const props = withDefaults(defineProps<{
  name: string;
  source?: string;
  target?: string;
  interactive?: boolean;
  selected?: boolean;
  fullWidth?: boolean;
  showSourceTarget?: boolean;
  as?: string;
}>(), {
  interactive: false,
  selected: false,
  fullWidth: false,
  showSourceTarget: false,
  as: 'div',
});

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const pillClasses = computed(() => {
  const base = [
    'inline-flex items-center gap-2',
    'px-3 py-1.5 text-xs rounded-lg',
    'transition-all duration-200 select-none min-w-0',
    props.fullWidth ? 'w-full' : 'max-w-full',
  ];

  if (props.selected) {
    return [
      ...base,
      'bg-primary/10 text-primary border border-primary/30',
      'font-semibold',
    ];
  }

  if (props.interactive) {
    return [
      ...base,
      'bg-white text-slate-600 border border-slate-200',
      'hover:bg-primary/5 hover:text-primary hover:border-primary/30',
      'cursor-pointer active:scale-[0.99] group',
    ];
  }

  return [
    ...base,
    'text-slate-500',
  ];
});
</script>
