<template>
  <div class="space-y-2">
    <div
      v-if="!neighborhoods.length"
      class="text-muted-foreground text-xs italic text-center p-4"
    >
      This concept is not part of any lens.
    </div>

    <div
      v-for="n in neighborhoods"
      :key="n.lens.id"
      class="rounded-lg border border-border bg-background/60 p-2.5 space-y-1.5"
    >
      <!-- Lens header -->
      <div class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <IconRenderer :icon="n.lens.icon" custom-class="w-3 h-3 text-indigo-500" />
        <span>{{ n.lens.name }}</span>
      </div>

      <!-- Neighborhood strip: parents → ● self → children -->
      <div class="flex items-center flex-wrap gap-1">
        <template v-for="p in n.parents" :key="'p-' + p">
          <button
            class="lens-chip"
            @click="$emit('select', p)"
          >
            <IconRenderer :icon="iconFor(p)" custom-class="w-3 h-3 shrink-0 text-muted-foreground" />
            <span class="truncate">{{ p }}</span>
          </button>
        </template>

        <ChevronRight v-if="n.parents.length" class="w-3 h-3 text-muted-foreground shrink-0" />

        <span class="lens-chip lens-chip--active">
          <IconRenderer :icon="iconFor(conceptName)" custom-class="w-3 h-3 shrink-0 text-indigo-600" />
          <span class="truncate">{{ conceptName }}</span>
        </span>

        <ChevronRight v-if="n.children.length" class="w-3 h-3 text-muted-foreground shrink-0" />

        <template v-for="c in n.children" :key="'c-' + c">
          <button
            class="lens-chip"
            @click="$emit('select', c)"
          >
            <IconRenderer :icon="iconFor(c)" custom-class="w-3 h-3 shrink-0 text-muted-foreground" />
            <span class="truncate">{{ c }}</span>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronRight } from 'lucide-vue-next';
import { useMetamodelStore } from '../../stores/metamodel';
import IconRenderer from './IconRenderer.vue';

const props = defineProps<{
  conceptName: string;
}>();

defineEmits<{
  (e: 'select', name: string): void;
}>();

const metamodelStore = useMetamodelStore();

const neighborhoods = computed(() => metamodelStore.getConceptLenses(props.conceptName));

const iconFor = (name: string) => metamodelStore.getConceptByName(name)?.icon || '';
</script>

<style scoped>
.lens-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  max-width: 11rem;
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  line-height: 1rem;
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--foreground);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}
.lens-chip:hover {
  background: var(--accent);
}
.lens-chip--active {
  cursor: default;
  font-weight: 600;
  border-color: rgb(165 180 252);
  background: rgb(238 242 255);
  color: rgb(67 56 202);
}
</style>
