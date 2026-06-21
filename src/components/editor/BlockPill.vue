<template>
  <component
    :is="as"
    :class="pillClasses"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Top Row: Icon + Name + Active Markers (inline when NOT hovered) -->
    <div class="flex items-center gap-1.5 w-full min-w-0">
      <!-- Concept (mold): show the abstract TYPE icon. Instance (concrete): show its emoji. -->
      <component
        v-if="kind === 'concept'"
        :is="typeIcon"
        class="shrink-0 w-3.5 h-3.5 text-current/70"
      />
      <IconRenderer v-else-if="resolvedEmoji" :icon="resolvedEmoji" custom-class="shrink-0 w-3.5 h-3.5 text-current/80" />
      <span class="text-current leading-tight text-left flex-1 min-w-0">
        <slot>{{ name }}</slot>
      </span>
      
      <!-- Inline Active Markers (only shown when NOT hovered) -->
      <div 
        v-if="showMarkers && !isHovered && activeMarkers.length > 0"
        class="flex items-center gap-1 shrink-0 ml-1.5"
      >
        <MarkerTooltip
          v-for="marker in activeMarkers" 
          :key="marker.name"
          :marker="marker"
          :score="markerValue(marker.name)"
        >
          <component 
            :is="getMarkerIcon(marker.name)"
            class="pointer-events-none"
            :class="markerClassesFor(marker.name)"
          />
        </MarkerTooltip>
      </div>
    </div>

    <!-- Bottom Row: Expanded Options (Opciones Expandidas) -->
    <!-- Shown only when hovered -->
    <div 
      v-if="hasOptionsRow"
      class="flex items-center gap-1.5 flex-wrap text-current/85 border-t border-current/10 pt-1 mt-1 w-full"
    >
      <!-- Reorder list controls -->
      <template v-if="showReorder">
        <button 
          @click.stop="$emit('move-up')"
          :disabled="isFirst"
          title="Move Up"
          class="p-0.5 hover:bg-current/10 disabled:opacity-20 rounded transition-all cursor-pointer text-current flex items-center justify-center shrink-0"
        >
          <ArrowUp class="w-3 h-3" />
        </button>
        <button 
          @click.stop="$emit('move-down')"
          :disabled="isLast"
          title="Move Down"
          class="p-0.5 hover:bg-current/10 disabled:opacity-20 rounded transition-all cursor-pointer text-current flex items-center justify-center shrink-0"
        >
          <ArrowDown class="w-3 h-3" />
        </button>
        <span class="w-px h-3 bg-current opacity-25 mx-0.5"></span>
      </template>

      <!-- Markers -->
      <div 
        v-if="showMarkers" 
        class="flex items-center gap-1 shrink-0"
      >
        <MarkerTooltip
          v-for="marker in visibleMarkers" 
          :key="marker.name"
          :marker="marker"
          :score="markerValue(marker.name)"
        >
          <component 
            :is="getMarkerIcon(marker.name)"
            @click.stop="cycleMarker(marker.name)"
            :class="markerClassesFor(marker.name)"
          />
        </MarkerTooltip>
      </div>

      <!-- Divider if markers exist and edit/delete/add is visible -->
      <span v-if="showMarkers && (showEdit || showDelete || showAddChild)" class="w-px h-3 bg-current opacity-25 mx-0.5"></span>

      <!-- Edit Toggle Button -->
      <button 
        v-if="showEdit"
        @click.stop="$emit('edit-toggle')"
        :title="isEditing ? 'Done' : 'Edit'"
        class="p-0.5 text-current/80 hover:text-current hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
      >
        <component :is="isEditing ? Check : Pencil" class="w-3.5 h-3.5" />
      </button>

      <!-- Delete Button -->
      <button 
        v-if="showDelete"
        @click.stop="$emit('delete')"
        title="Delete"
        class="p-0.5 text-current/60 hover:text-rose-600 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
      >
        <Trash2 class="w-3.5 h-3.5" />
      </button>

      <!-- Add Child Button -->
      <button 
        v-if="showAddChild"
        @click.stop="$emit('add-child')" 
        class="flex items-center justify-center rounded text-current/60 hover:text-current hover:bg-current/10 cursor-pointer transition-all duration-200 shrink-0 p-0.5"
        title="Add Child Node"
      >
        <PlusCircle class="w-3.5 h-3.5" />
      </button>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMetamodelStore } from '../../stores/metamodel';
import { useDocumentStore } from '../../stores/document';
import { getColorClasses } from '../../utils/colors';
import IconRenderer from './IconRenderer.vue';
import MarkerTooltip from './MarkerTooltip.vue';
import { getMarkerIcon, getMarkerClasses } from './MarkerIcons';
import { getConceptTypeIcon, type BlockKind } from '../../utils/conceptVisuals';
import {
  PlusCircle,
  Pencil,
  Check,
  Trash2,
  ArrowUp,
  ArrowDown
} from 'lucide-vue-next';

const props = withDefaults(defineProps<{
  name?: string;
  conceptType?: string;
  color?: string;
  emoji?: string;
  selected?: boolean;
  interactive?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  as?: string;
  simplified?: boolean;
  /** Semantic kind: 'concept' renders an outline mold, 'instance' a solid fill. */
  kind?: BlockKind;
  /** Concept type ('text' | 'category' | ...) used to pick the type icon for concepts. */
  typeName?: string;
  // Expanded options support
  blockId?: string;
  showMarkers?: boolean;
  showAddChild?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showReorder?: boolean;
  isEditing?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}>(), {
  selected: false,
  interactive: false,
  size: 'md',
  fullWidth: false,
  as: 'div',
  simplified: false,
  kind: 'instance',
  showMarkers: false,
  showAddChild: false,
  showEdit: false,
  showDelete: false,
  showReorder: false,
  isEditing: false,
  isFirst: false,
  isLast: false
});

const emit = defineEmits<{
  (e: 'add-child'): void;
  (e: 'edit-toggle'): void;
  (e: 'delete'): void;
  (e: 'move-up'): void;
  (e: 'move-down'): void;
}>();

const metamodelStore = useMetamodelStore();
const documentStore = useDocumentStore();

const isHovered = ref(false);

const resolvedColor = computed(() => {
  if (props.color) return props.color;
  if (props.conceptType) {
    return metamodelStore.getConceptByName(props.conceptType)?.color || '';
  }
  return '';
});

const resolvedEmoji = computed(() => {
  if (props.emoji !== undefined) return props.emoji;
  if (props.conceptType) {
    return metamodelStore.getConceptByName(props.conceptType)?.emoji || '';
  }
  return '';
});

const resolvedType = computed(() => {
  if (props.typeName) return props.typeName;
  if (props.conceptType) {
    return metamodelStore.getConceptByName(props.conceptType)?.type || null;
  }
  return null;
});

const typeIcon = computed(() => getConceptTypeIcon(resolvedType.value));

const colorClasses = computed(() => getColorClasses(resolvedColor.value));

const activeMarkers = computed(() => {
  if (!props.blockId) return [];
  return metamodelStore.markers.filter(m => {
    return documentStore.getNodeMarkerValue(props.blockId!, m.name) > 0;
  });
});

const visibleMarkers = computed(() => {
  if (isHovered.value) {
    return metamodelStore.markers;
  }
  return activeMarkers.value;
});

const hasOptionsRow = computed(() => {
  const hasControls = props.showReorder || props.showEdit || props.showDelete || props.showAddChild || props.showMarkers;
  return isHovered.value && hasControls;
});

const pillClasses = computed(() => {
  const isColLayout = hasOptionsRow.value;
  const baseClasses = [
    // Layout classes
    props.fullWidth 
      ? (isColLayout ? 'flex flex-col w-full items-start' : 'flex w-full justify-between items-center') 
      : (isColLayout ? 'inline-flex flex-col items-start max-w-full' : 'inline-flex items-center max-w-full'),
    // Size classes
    props.size === 'xs' ? 'px-1.5 py-0.5 text-[9px] gap-1 tracking-wider' : 
    props.size === 'sm' ? 'px-2 py-1 text-[10px] gap-1' : 
    props.size === 'lg' ? 'px-4 py-2 text-sm gap-2' : 
    'px-3 py-1.5 text-xs gap-1.5',
    // Base styles
    'border rounded-lg font-normal whitespace-normal break-words transition-all duration-200 select-none min-w-0',
    // Interactive states
    props.interactive ? 'cursor-pointer active:scale-[0.99]' : ''
  ];

  if (props.selected) {
    return [
      ...baseClasses,
      colorClasses.value.bg,
      colorClasses.value.text,
      'border-indigo-600 ring-1 ring-indigo-600 shadow-xs'
    ];
  }

  if (props.simplified) {
    return [
      ...baseClasses,
      'bg-transparent border-slate-200 text-slate-500',
      props.interactive ? `${colorClasses.value.hoverBg} ${colorClasses.value.hoverBorder} ${colorClasses.value.hoverText} hover:shadow-2xs` : ''
    ];
  }

  // Concept (mold): outline / dashed border, no solid fill — reads as abstract.
  if (props.kind === 'concept') {
    return [
      ...baseClasses,
      'bg-white border-dashed',
      colorClasses.value.text,
      colorClasses.value.border,
      props.interactive ? `${colorClasses.value.hoverBg} hover:shadow-xs` : ''
    ];
  }

  // Instance (concrete): solid tinted fill — reads as a real, materialized block.
  return [
    ...baseClasses,
    colorClasses.value.bg,
    colorClasses.value.text,
    colorClasses.value.border,
    props.interactive ? 'hover:shadow-xs' : ''
  ];
});

// Marker logic
const markerValue = (markerName: string) => {
  if (!props.blockId) return 0;
  return documentStore.getNodeMarkerValue(props.blockId, markerName);
};

const cycleMarker = (markerName: string) => {
  if (!props.blockId) return;
  const currentVal = documentStore.getNodeMarkerValue(props.blockId, markerName);
  const nextVal = (currentVal + 1) % 4; // Cycles: 0 -> 1 -> 2 -> 3 -> 0
  documentStore.setNodeMarkerValue(props.blockId, markerName, nextVal);
  documentStore.triggerUnsavedChanges();
};

const markerClassesFor = (markerName: string) => {
  if (!props.blockId) return '';
  return getMarkerClasses(markerName, documentStore.getNodeMarkerValue(props.blockId, markerName));
};
</script>
