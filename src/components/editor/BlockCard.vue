<template>
  <div
    class="relative flex items-center gap-1.5 w-full group"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Identity core -->
    <BlockPill
      :kind="kind"
      :block-id="blockId"
      :concept-type="conceptType"
      :name="name"
      :selected="selected"
      :interactive="interactive"
      class="flex-1"
      @click="$emit('click')"
    />

    <!-- Inline active markers (when not hovered) -->
    <div
      v-if="showMarkers && !isHovered && activeMarkers.length > 0"
      class="flex items-center gap-1 shrink-0 ml-1"
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

    <!-- Hover quick-action toolbar -->
    <div
      class="flex items-center gap-1 shrink-0 transition-all duration-150"
      :class="isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none -translate-x-1'"
    >
      <!-- Markers (all, cycled on click) -->
      <template v-if="showMarkers">
        <MarkerTooltip
          v-for="marker in allMarkers"
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
        <span class="w-px h-3 bg-slate-300 mx-0.5"></span>
      </template>

      <!-- Reorder controls -->
      <template v-if="showReorder">
        <button
          @click.stop="$emit('move-up')"
          :disabled="isFirst"
          aria-label="Move up"
          class="p-0.5 hover:bg-slate-100 disabled:opacity-20 rounded transition-all cursor-pointer text-slate-500 flex items-center justify-center shrink-0"
        >
          <ArrowUp class="w-3 h-3" />
        </button>
        <button
          @click.stop="$emit('move-down')"
          :disabled="isLast"
          aria-label="Move down"
          class="p-0.5 hover:bg-slate-100 disabled:opacity-20 rounded transition-all cursor-pointer text-slate-500 flex items-center justify-center shrink-0"
        >
          <ArrowDown class="w-3 h-3" />
        </button>
        <span class="w-px h-3 bg-slate-300 mx-0.5"></span>
      </template>

      <!-- Add child -->
      <button
        v-if="showAddChild"
        @click.stop="$emit('add-child')"
        aria-label="Add child"
        class="p-0.5 hover:bg-slate-100 rounded transition-all cursor-pointer text-slate-500 flex items-center justify-center shrink-0"
      >
        <PlusCircle class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowUp, ArrowDown, PlusCircle } from 'lucide-vue-next';
import BlockPill from './BlockPill.vue';
import MarkerTooltip from './MarkerTooltip.vue';
import { getMarkerIcon, getMarkerClasses } from './MarkerIcons';
import { useDocumentStore } from '../../stores/document';
import { useMetamodelStore } from '../../stores/metamodel';
import type { BlockKind } from '../../utils/conceptVisuals';

const props = withDefaults(defineProps<{
  blockId: string;
  name: string;
  kind?: BlockKind;
  conceptType?: string;
  selected?: boolean;
  interactive?: boolean;
  showMarkers?: boolean;
  showReorder?: boolean;
  showAddChild?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}>(), {
  kind: 'instance',
  selected: false,
  interactive: true,
  showMarkers: false,
  showReorder: false,
  showAddChild: false,
  isFirst: false,
  isLast: false,
});

defineEmits<{
  (e: 'click'): void;
  (e: 'add-child'): void;
  (e: 'move-up'): void;
  (e: 'move-down'): void;
}>();

const documentStore = useDocumentStore();
const metamodelStore = useMetamodelStore();

const isHovered = ref(false);

const allMarkers = computed(() => metamodelStore.markers);

const activeMarkers = computed(() => {
  return metamodelStore.markers.filter(m =>
    documentStore.getNodeMarkerValue(props.blockId, m.name) > 0
  );
});

const markerValue = (markerName: string) =>
  documentStore.getNodeMarkerValue(props.blockId, markerName);

const cycleMarker = (markerName: string) => {
  const current = documentStore.getNodeMarkerValue(props.blockId, markerName);
  documentStore.setNodeMarkerValue(props.blockId, markerName, (current + 1) % 4);
  documentStore.triggerUnsavedChanges();
};

const markerClassesFor = (markerName: string) =>
  getMarkerClasses(markerName, documentStore.getNodeMarkerValue(props.blockId, markerName));
</script>
