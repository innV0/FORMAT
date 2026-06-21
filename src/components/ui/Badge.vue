<template>
  <span :class="['inline-flex items-center rounded-full px-2 py-0.5 font-bold', sizeClass]">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  size?: 'xs' | 'sm'
}>(), { size: 'xs' });

const sizeClass = computed(() =>
  props.size === 'sm' ? 'text-[10px]' : 'text-[9px] uppercase tracking-wider'
);
</script>
