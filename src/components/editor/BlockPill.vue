<template>
  <component
    :is="as"
    ref="triggerEl"
    :class="pillClasses"
    @mouseenter="blockId ? scheduleShow() : undefined"
    @mouseleave="blockId ? scheduleHide() : undefined"
  >
    <!-- Identity row: icon + name + active markers -->
    <div class="flex items-center gap-1.5 w-full min-w-0">
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
        <slot>
          <template v-if="conceptLabel">
            <span class="font-medium">{{ conceptLabel }}:</span>
            {{ name }}
          </template>
          <template v-else>{{ name }}</template>
        </slot>
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

    <!-- Hover popup (only when blockId is provided) -->
    <Teleport v-if="blockId" to="body">
      <Transition name="fade-fast">
        <div
          v-if="popupVisible"
          :style="popupStyle"
          class="fixed z-[998] w-80 bg-white border border-slate-200 rounded-xl shadow-2xl p-4 text-xs select-none"
          @mouseenter="cancelHide"
          @mouseleave="scheduleHide"
        >
          <!-- Header -->
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
          <div v-if="showMarkers && allMarkers.length" class="border-t border-slate-100 pt-2.5">
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
  </component>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from 'vue';
import IconRenderer from './IconRenderer.vue';
import MarkerTooltip from './MarkerTooltip.vue';
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
  iconMode?: 'type' | 'own';
  typeName?: ConceptType;
  selected?: boolean;
  interactive?: boolean;
  fullWidth?: boolean;
  as?: string;
  /** Block id — enables popup, active markers, and content-aware (empty) state. */
  blockId?: string;
  /** Shown in the popup and used to detect the empty state. */
  description?: string;
  fields?: Record<string, any>;
  /** Field definitions for labelled field chips in the popup. */
  conceptFields?: any[];
  /** Number of child instances. An instanciable block with instances counts as having content. */
  instanceCount?: number;
  /** Show the marker-cycling toolbar inside the popup. */
  showMarkers?: boolean;
}>(), {
  selected: false,
  interactive: false,
  fullWidth: false,
  as: 'div',
  kind: 'instance',
  showMarkers: false,
  conceptFields: () => [],
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

// ── Empty state ──────────────────────────────────────────────────────────────
const isEmpty = computed(() => {
  const hasDescription = !!props.description && props.description.trim().length > 0;
  const hasFields = !!props.fields && Object.values(props.fields).some(
    v => v !== undefined && v !== null && v !== '' && v !== false
  );
  const hasInstances = (props.instanceCount ?? 0) > 0;
  return !hasDescription && !hasFields && !hasInstances;
});

// For element pills (instances), prefix the name with the concept's name.
const conceptLabel = computed(() => {
  if (props.kind !== 'instance') return '';
  const ct = props.conceptType;
  if (!ct) return '';
  return metamodelStore.getConceptByName(ct)?.name || ct;
});

// ── Markers ──────────────────────────────────────────────────────────────────
const allMarkers = computed(() => metamodelStore.markers);

const activeMarkers = computed(() => {
  if (!props.blockId) return [];
  return allMarkers.value.filter(m => documentStore.getNodeMarkerValue(props.blockId!, m.name) > 0);
});

const markerValue = (markerName: string) =>
  documentStore.getNodeMarkerValue(props.blockId ?? '', markerName);

const cycleMarker = (markerName: string) => {
  if (!props.blockId) return;
  const current = documentStore.getNodeMarkerValue(props.blockId, markerName);
  documentStore.setNodeMarkerValue(props.blockId, markerName, (current + 1) % 4);
  documentStore.triggerUnsavedChanges();
};

const markerClassesFor = (markerName: string) =>
  getMarkerClasses(markerName, documentStore.getNodeMarkerValue(props.blockId ?? '', markerName));

// ── Popup ────────────────────────────────────────────────────────────────────
const triggerEl = ref<HTMLElement | null>(null);
const popupVisible = ref(false);
const coords = ref({ top: 0, left: 0 });
let showTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

const cancelShow = () => {
  if (showTimer) { clearTimeout(showTimer); showTimer = null; }
};

const cancelHide = () => {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
};

const scheduleShow = () => {
  cancelHide();
  if (showTimer) return;
  showTimer = setTimeout(() => {
    showTimer = null;
    const rect = triggerEl.value?.getBoundingClientRect();
    if (!rect) return;
    coords.value = { left: rect.left, top: rect.bottom + 6 };
    popupVisible.value = true;
  }, 400);
};

const scheduleHide = () => {
  cancelShow();
  cancelHide();
  hideTimer = setTimeout(() => { popupVisible.value = false; }, 120);
};

onBeforeUnmount(() => { cancelShow(); cancelHide(); });

const popupStyle = computed(() => ({
  top: `${coords.value.top}px`,
  left: `${coords.value.left}px`,
}));

// ── Visible fields for popup ──────────────────────────────────────────────────
const visibleFields = computed(() => {
  if (!props.conceptFields?.length || !props.fields) return [];
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

// ── Pill classes ─────────────────────────────────────────────────────────────
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
