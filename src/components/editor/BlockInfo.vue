<template>
  <div
    ref="triggerEl"
    class="contents"
    @mouseenter="showPopup"
    @mouseleave="scheduleHide"
  >
    <slot></slot>

    <Teleport to="body">
      <Transition name="fade-fast">
        <div
          v-if="visible"
          :style="popupStyle"
          class="fixed z-[998] w-80 bg-white border border-slate-200 rounded-xl shadow-2xl p-4 text-xs select-none transition-all duration-200"
          @mouseenter="cancelHide"
          @mouseleave="scheduleHide"
        >
          <!-- Header: identity -->
          <div class="flex items-center gap-1.5 mb-2">
            <component
              v-if="visuals.iconToShow.value === 'type'"
              :is="visuals.typeIcon.value"
              class="shrink-0 w-4 h-4 text-slate-500"
            />
            <IconRenderer
              v-else-if="visuals.resolvedIcon.value"
              :icon="visuals.resolvedIcon.value"
              custom-class="shrink-0 w-4 h-4 text-slate-500"
            />
            <span class="font-semibold text-sm text-slate-800 break-words">{{ name || '(Empty)' }}</span>
          </div>

          <!-- Fields -->
          <div v-if="visibleFields.length" class="flex flex-wrap gap-1.5 mb-2">
            <span
              v-for="field in visibleFields"
              :key="field.name"
              class="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 text-[10px] font-medium border border-slate-200/60"
            >
              <span class="text-slate-400 mr-1 uppercase font-bold">{{ field.name.replace(/_/g, ' ') }}:</span>
              <span>{{ field.value }}</span>
            </span>
          </div>

          <!-- Description -->
          <p v-if="description && description.trim()" class="text-slate-600 leading-relaxed text-[11px] mb-3 break-words">
            {{ description }}
          </p>
          <p v-else class="text-slate-400 italic text-[11px] mb-3">Sin contenido.</p>

          <!-- Marker cycling toolbar -->
          <div v-if="showMarkers" class="border-t border-slate-100 pt-2.5">
            <div class="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">Marcadores</div>
            <div class="flex items-center gap-1.5">
              <MarkerTooltip
                v-for="marker in allMarkers"
                :key="marker.name"
                :marker="marker"
                :score="markerValue(marker.name)"
              >
                <component
                  :is="getMarkerIcon(marker.name)"
                  @click.stop="cycleMarker(marker.name)"
                  class="cursor-pointer"
                  :class="markerClassesFor(marker.name)"
                />
              </MarkerTooltip>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import IconRenderer from './IconRenderer.vue';
import MarkerTooltip from './MarkerTooltip.vue';
import { getMarkerIcon, getMarkerClasses } from './MarkerIcons';
import { useBlockVisuals } from '../../composables/useBlockVisuals';
import { useDocumentStore } from '../../stores/document';
import { useMetamodelStore } from '../../stores/metamodel';
import type { BlockKind, ConceptType } from '../../utils/conceptVisuals';

const props = withDefaults(defineProps<{
  blockId: string;
  name?: string;
  kind?: BlockKind;
  conceptType?: string;
  color?: string;
  icon?: string;
  typeName?: ConceptType;
  description?: string;
  fields?: Record<string, any>;
  conceptFields?: any[];
  showMarkers?: boolean;
}>(), {
  kind: 'instance',
  showMarkers: true,
  conceptFields: () => [],
});

const documentStore = useDocumentStore();
const metamodelStore = useMetamodelStore();

const visuals = useBlockVisuals({
  kind: computed(() => props.kind),
  conceptType: computed(() => props.conceptType),
  color: computed(() => props.color),
  icon: computed(() => props.icon),
  typeName: computed(() => props.typeName),
});

const triggerEl = ref<HTMLElement | null>(null);
const visible = ref(false);
const coords = ref({ top: 0, left: 0 });
let hideTimer: ReturnType<typeof setTimeout> | null = null;
let showTimer: ReturnType<typeof setTimeout> | null = null;

const showPopup = () => {
  cancelHide();
  if (showTimer) return;
  showTimer = setTimeout(() => {
    showTimer = null;
    const trigger = triggerEl.value?.firstElementChild as HTMLElement | null;
    const rect = (trigger ?? triggerEl.value)?.getBoundingClientRect();
    if (!rect) return;
    coords.value = { left: rect.left, top: rect.bottom + 6 };
    visible.value = true;
  }, 400);
};

const cancelShow = () => {
  if (showTimer) {
    clearTimeout(showTimer);
    showTimer = null;
  }
};

const cancelHide = () => {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
};

const scheduleHide = () => {
  cancelShow();
  cancelHide();
  hideTimer = setTimeout(() => { visible.value = false; }, 120);
};

onBeforeUnmount(() => { cancelShow(); cancelHide(); });

const popupStyle = computed(() => ({
  top: `${coords.value.top}px`,
  left: `${coords.value.left}px`,
}));

const allMarkers = computed(() => metamodelStore.markers);

const markerValue = (markerName: string) =>
  documentStore.getNodeMarkerValue(props.blockId, markerName);

const cycleMarker = (markerName: string) => {
  const current = documentStore.getNodeMarkerValue(props.blockId, markerName);
  documentStore.setNodeMarkerValue(props.blockId, markerName, (current + 1) % 4);
  documentStore.triggerUnsavedChanges();
};

const markerClassesFor = (markerName: string) =>
  getMarkerClasses(markerName, documentStore.getNodeMarkerValue(props.blockId, markerName));

const visibleFields = computed(() => {
  if (!props.conceptFields || !props.fields) return [];
  return props.conceptFields
    .map(field => {
      const val = props.fields?.[field.name];
      if (val === undefined || val === '' || val === null || val === false) return null;
      return {
        name: field.name,
        value: typeof val === 'boolean' ? (val ? 'Yes' : 'No') : val,
      };
    })
    .filter((f): f is { name: string; value: any } => f !== null);
});
</script>

<style scoped>
.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.12s ease-out, transform 0.12s ease-out;
}
.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
}
</style>
