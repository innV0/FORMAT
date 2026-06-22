<template>
  <component
    :is="as"
    :class="pillClasses"
  >
    <!-- Identity row: icon + name + active markers -->
    <div class="flex items-center gap-1.5 w-full min-w-0">
      <!-- Icon: TYPE icon when iconToShow is 'type', otherwise the block's own icon
           (falling back to the TYPE icon when no own icon is available). -->
      <IconRenderer
        v-if="visuals.iconToShow.value === 'icon' && visuals.resolvedIcon.value"
        :icon="visuals.resolvedIcon.value"
        custom-class="shrink-0 w-3.5 h-3.5 text-current/80"
      />
      <component
        v-else
        :is="visuals.typeIcon.value"
        class="shrink-0 w-3.5 h-3.5 text-current/70"
      />
      <span class="text-current leading-tight text-left flex-1 min-w-0">
        <slot>{{ name }}</slot>
      </span>

      <!-- Active markers, read-only, rendered inside the pill -->
      <span
        v-if="activeMarkers.length > 0"
        class="flex items-center gap-1 shrink-0"
      >
        <component
          v-for="marker in activeMarkers"
          :key="marker.name"
          :is="getMarkerIcon(marker.name)"
          class="pointer-events-none"
          :class="markerClassesFor(marker.name)"
        />
      </span>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import IconRenderer from './IconRenderer.vue';
import { getMarkerIcon, getMarkerClasses } from './MarkerIcons';
import { useBlockVisuals } from '../../composables/useBlockVisuals';
import { useDocumentStore } from '../../stores/document';
import { useMetamodelStore } from '../../stores/metamodel';
import type { BlockKind, ConceptType } from '../../utils/conceptVisuals';

const props = withDefaults(defineProps<{
  name?: string;
  kind?: BlockKind;
  conceptType?: string;
  color?: string;
  icon?: string;
  typeName?: ConceptType;
  selected?: boolean;
  interactive?: boolean;
  fullWidth?: boolean;
  as?: string;
  /** Block id — enables active marker display and content-aware (empty) state. */
  blockId?: string;
  /** Block content — used to detect the empty/disabled state. */
  description?: string;
  fields?: Record<string, any>;
  /** Number of child instances. An instanciable block with instances counts as having content. */
  instanceCount?: number;
}>(), {
  selected: false,
  interactive: false,
  fullWidth: false,
  as: 'div',
  kind: 'instance',
});

const documentStore = useDocumentStore();
const metamodelStore = useMetamodelStore();

const visuals = useBlockVisuals({
  kind: computed(() => props.kind ?? 'instance'),
  conceptType: computed(() => props.conceptType),
  color: computed(() => props.color),
  icon: computed(() => props.icon),
  typeName: computed(() => props.typeName),
});

// A block is empty when it has no description, no field with a value, and no instances.
// An instanciable block that already has instances counts as having content.
const isEmpty = computed(() => {
  const hasDescription = !!props.description && props.description.trim().length > 0;
  const hasFields = !!props.fields && Object.values(props.fields).some(
    v => v !== undefined && v !== null && v !== '' && v !== false
  );
  const hasInstances = (props.instanceCount ?? 0) > 0;
  return !hasDescription && !hasFields && !hasInstances;
});

const activeMarkers = computed(() => {
  if (!props.blockId) return [];
  const id = props.blockId;
  return metamodelStore.markers.filter(m => documentStore.getNodeMarkerValue(id, m.name) > 0);
});

const markerClassesFor = (markerName: string) =>
  getMarkerClasses(markerName, documentStore.getNodeMarkerValue(props.blockId ?? '', markerName));

const pillClasses = computed(() => {
  const baseClasses = [
    props.fullWidth ? 'flex w-full items-center' : 'inline-flex items-center max-w-full',
    'px-3 py-1.5 text-xs gap-1.5',
    'border rounded-lg font-normal whitespace-normal break-words transition-all duration-200 select-none min-w-0',
    props.interactive ? 'cursor-pointer active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1' : '',
    isEmpty.value ? 'opacity-50' : '',
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
