<template>
  <div class="space-y-1">
    <div 
      :class="[
        activeName === node.name 
          ? [colorClasses.bg, colorClasses.text, colorClasses.border, 'font-bold shadow-xs'] 
          : 'border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:border-slate-200 hover:text-slate-800',
        'w-full flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs transition-all text-left cursor-pointer select-none'
      ]"
      @click="emitSelect(node.name)"
    >
      <div class="flex items-center gap-1.5 truncate flex-1">
        <!-- Collapse toggle button on the left -->
        <button 
          v-if="node.children && node.children.length"
          @click.stop="isCollapsed = !isCollapsed"
          class="p-0.5 hover:bg-current/10 rounded text-current transition-colors flex items-center justify-center cursor-pointer shrink-0"
          aria-label="Toggle node collapse"
        >
          <ChevronDown 
            class="transition-transform duration-200 w-3 h-3 inline-block"
            :class="{ '-rotate-90': isCollapsed }"
          />
        </button>
        <!-- Spacer for items without children to align icons -->
        <span v-else class="w-[18px] shrink-0"></span>

        <!-- Type Icon -->
        <component :is="conceptIcon" class="w-3.5 h-3.5 shrink-0 opacity-70" />

        <!-- Emoji -->
        <span class="shrink-0 text-[11px]">{{ node.emoji || '📄' }}</span>
        
        <!-- Name -->
        <span class="truncate font-medium">{{ node.name }}</span>
      </div>
    </div>

    <!-- Recursive children rendering -->
    <div 
      v-if="node.children && node.children.length" 
      v-show="!isCollapsed"
      class="pl-4 border-l border-border ml-3 space-y-1"
    >
      <ConceptTreeNode 
        v-for="child in node.children" 
        :key="child.name" 
        :node="child" 
        :active-name="activeName"
        :expanded-generation="expandedGeneration"
        @select="emitSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { 
  ChevronDown,
  FileText,
  Folder,
  Scale,
  ListChecks,
  GitCommit,
  HelpCircle
} from 'lucide-vue-next';
import { Concept } from '../../types';
import { getColorClasses } from '../../utils/colors';

interface ConceptNode extends Concept {
  children?: ConceptNode[];
}

const props = defineProps<{
  node: ConceptNode;
  activeName: string;
  expandedGeneration?: number;
}>();

const emit = defineEmits<{
  (e: 'select', name: string): void;
}>();

const isCollapsed = ref(false);

// Watch the global generation counter to expand/collapse all
watch(() => props.expandedGeneration, (newVal) => {
  if (newVal !== undefined) {
    // Negative generation values represent "collapse all"
    isCollapsed.value = newVal < 0;
  }
}, { immediate: true });

const emitSelect = (name: string) => {
  emit('select', name);
};

const conceptColor = computed(() => props.node.color || '');
const colorClasses = computed(() => getColorClasses(conceptColor.value));

const conceptIcon = computed(() => {
  switch (props.node.type) {
    case 'text':
      return FileText;
    case 'category':
      return Folder;
    case 'weight':
      return Scale;
    case 'steps':
      return ListChecks;
    case 'sequence':
      return GitCommit;
    default:
      return HelpCircle;
  }
});
</script>
