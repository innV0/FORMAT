<template>
  <component
    :is="as"
    :class="pillClasses"
    :title="tooltipText"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <IconRenderer
      :icon="resolvedSourceIcon"
      custom-class="shrink-0 w-3.5 h-3.5"
      :class="sourceAccent"
    />
    <span v-if="showSourceTarget && source && target" class="truncate min-w-0 leading-tight flex items-center gap-1">
      <span :class="sourceText">{{ source }}</span>
      <span v-if="label" class="text-xs text-slate-400 font-normal italic">{{ label }}</span>
      <span class="text-slate-300 font-normal">→</span>
      <span :class="targetText">{{ target }}</span>
    </span>
    <span v-else class="truncate min-w-0 leading-tight">{{ name }}</span>
    <ChevronRight v-if="interactive" class="shrink-0 w-3.5 h-3.5 transition-colors" :class="chevronClasses" />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Table2, ChevronRight } from 'lucide-vue-next';
import { useMetamodelStore } from '../../stores/metamodel';
import { getColorClasses } from '../../utils/colors';
import IconRenderer from './IconRenderer.vue';

const metamodelStore = useMetamodelStore();

const props = withDefaults(defineProps<{
  name: string;
  source?: string;
  target?: string;
  label?: string;
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
  label: '',
  as: 'div',
});

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const resolvedSourceIcon = computed(() => {
  if (!props.source) return 'table-2';
  const concept = metamodelStore.getConceptByName(props.source);
  return concept?.icon || 'table-2';
});

const sourcePalette = computed(() => {
  if (!props.source) return null;
  const concept = metamodelStore.getConceptByName(props.source);
  return concept?.color ? getColorClasses(concept.color) : null;
});

const targetPalette = computed(() => {
  if (!props.target) return null;
  const concept = metamodelStore.getConceptByName(props.target);
  return concept?.color ? getColorClasses(concept.color) : null;
});

const sourceText = computed(() => sourcePalette.value?.text || 'text-slate-600');
const targetText = computed(() => targetPalette.value?.text || 'text-slate-600');
const sourceAccent = computed(() => sourcePalette.value?.accent || 'text-slate-400');

const chevronClasses = computed(() => {
  if (!props.interactive) return 'hidden';
  return sourcePalette.value?.accent
    ? `${sourcePalette.value.accent} opacity-0 group-hover:opacity-100`
    : 'text-slate-300 group-hover:text-primary';
});

const tooltipText = computed(() => {
  if (props.showSourceTarget && props.source && props.target) {
    let t = `${props.name} — ${props.source} → ${props.target}`;
    if (props.label) t += ` (${props.label})`;
    return t;
  }
  return props.name;
});

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
