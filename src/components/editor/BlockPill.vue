<template>
  <component
    :is="as"
    :class="pillClasses"
  >
    <!-- Top Row: Icon + Name -->
    <div class="flex items-center gap-1.5 w-full min-w-0">
      <!-- Concept (mold): show the abstract TYPE icon. Instance (concrete): show its emoji. -->
      <component
        v-if="visuals.iconToShow.value === 'type'"
        :is="visuals.typeIcon.value"
        class="shrink-0 w-3.5 h-3.5 text-current/70"
      />
      <IconRenderer
        v-else-if="visuals.resolvedEmoji.value"
        :icon="visuals.resolvedEmoji.value"
        custom-class="shrink-0 w-3.5 h-3.5 text-current/80"
      />
      <span class="text-current leading-tight text-left flex-1 min-w-0">
        <slot>{{ name }}</slot>
      </span>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import IconRenderer from './IconRenderer.vue';
import { useBlockVisuals } from '../../composables/useBlockVisuals';
import type { BlockKind, ConceptType } from '../../utils/conceptVisuals';

const props = withDefaults(defineProps<{
  name?: string;
  kind?: BlockKind;
  conceptType?: string;
  color?: string;
  emoji?: string;
  typeName?: ConceptType;
  selected?: boolean;
  interactive?: boolean;
  fullWidth?: boolean;
  as?: string;
}>(), {
  selected: false,
  interactive: false,
  fullWidth: false,
  as: 'div',
  kind: 'instance',
});

const visuals = useBlockVisuals({
  kind: computed(() => props.kind ?? 'instance'),
  conceptType: computed(() => props.conceptType),
  color: computed(() => props.color),
  emoji: computed(() => props.emoji),
  typeName: computed(() => props.typeName),
});

const pillClasses = computed(() => {
  const baseClasses = [
    props.fullWidth ? 'flex w-full items-center' : 'inline-flex items-center max-w-full',
    'px-3 py-1.5 text-xs gap-1.5',
    'border rounded-lg font-normal whitespace-normal break-words transition-all duration-200 select-none min-w-0',
    props.interactive ? 'cursor-pointer active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1' : '',
  ];

  if (props.selected) {
    const p = visuals.palette.value;
    return [
      ...baseClasses,
      p.bg,
      p.text,
      'border-indigo-600 ring-1 ring-indigo-600 shadow-xs',
    ];
  }

  return [
    ...baseClasses,
    ...visuals.containerClasses.value,
    props.interactive ? 'hover:shadow-xs' : '',
  ];
});
</script>
