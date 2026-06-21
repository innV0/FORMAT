<template>
  <div class="flex flex-col flex-1 gap-4 overflow-y-auto p-1">
    <!-- Single instance text view -->
    <BlockViewer
      v-if="!isListConcept"
      :block="textBlock"
      :concept-name="activeConcept"
      :concept-type="'text'"
      :concept-emoji="conceptEmoji"
      :concept-color="conceptColor"
      :has-markers="true"
      @change="updateSingleBlockText"
    />

    <!-- Multi-instance list view -->
    <div v-else class="space-y-4">
      <div class="flex justify-between items-center pb-2 border-b border-slate-100">
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Concept Instances ({{ conceptType }})
        </h4>
        <button 
          @click="addListItem"
          class="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md font-bold flex items-center gap-1 cursor-pointer transition shadow-xs"
        >
          <Plus class="w-3.5 h-3.5" />
          Add Item
        </button>
      </div>

      <div v-if="parsedItems.length === 0" class="text-center py-12 text-slate-400 italic text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
        No instances found. Use "+ Add Item" or create bullet points (- Name: Description) to begin.
      </div>

      <div v-else class="space-y-4">
        <BlockViewer
          v-for="(item, idx) in parsedItems"
          :key="item.id"
          :block="item"
          :concept-name="activeConcept"
          :concept-type="conceptType"
          :concept-emoji="conceptEmoji"
          :concept-color="conceptColor"
          :index="idx + 1"
          :is-list="true"
          :is-first="idx === 0"
          :is-last="idx === parsedItems.length - 1"
          :show-delete="true"
          @delete="deleteListItem(idx)"
          @move-up="moveItemUp(idx)"
          @move-down="moveItemDown(idx)"
          @change="syncToMarkdown"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDocumentStore } from '../../stores/document';
import { useMetamodelStore } from '../../stores/metamodel';
import { Plus } from 'lucide-vue-next';
import BlockViewer from './BlockViewer.vue';

const documentStore = useDocumentStore();
const metamodelStore = useMetamodelStore();

const activeConcept = computed(() => documentStore.activeConceptName);
const conceptType = computed(() => documentStore.getConceptType());

const conceptColor = computed(() => {
  return metamodelStore.getConceptByName(activeConcept.value)?.color || '';
});

const conceptEmoji = computed(() => {
  return metamodelStore.getConceptByName(activeConcept.value)?.emoji || '';
});

// Check if this is an instantiable list-like concept
const isListConcept = computed(() => {
  return ['weight', 'steps', 'sequence', 'list'].includes(conceptType.value);
});

// Single instance text block state
const textBlock = ref({
  name: '',
  description: ''
});

const HEADER_REGEX = /^#\s+<!--\s*block:\s*[a-zA-Z0-9_\s-]+\s*-->\s*[^\n]*\r?\n*/i;

const stripHeader = (text: string) => {
  return text.replace(HEADER_REGEX, '').trim();
};

watch(activeConcept, (newVal) => {
  textBlock.value = {
    name: newVal,
    description: stripHeader(documentStore.modelTextData[newVal] || '')
  };
}, { immediate: true });

watch(() => documentStore.modelTextData[activeConcept.value], (newText) => {
  const cleanText = stripHeader(newText || '');
  if (textBlock.value.description !== cleanText) {
    textBlock.value.description = cleanText;
  }
});

const updateSingleBlockText = () => {
  const rawText = documentStore.modelTextData[activeConcept.value] || '';
  const match = rawText.match(HEADER_REGEX);
  const header = match ? match[0] : `# <!-- block: concepts --> ${activeConcept.value.toLowerCase()}\n\n`;
  documentStore.modelTextData[activeConcept.value] = header + textBlock.value.description;
  documentStore.triggerUnsavedChanges();
};

// Structural representations of list items
interface ParsedItem {
  id: string;
  name: string;
  description: string;
  blockType?: string;
}

const parsedItems = ref<ParsedItem[]>([]);

// Sync from text markdown content to structured parsed items
const syncFromMarkdown = () => {
  const text = documentStore.modelTextData[activeConcept.value] || '';
  const lines = text.split('\n');
  const items: ParsedItem[] = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      let bulletContent = trimmed.substring(1).trim();
      
      // Match optional <!-- block: [type] --> tag at the start of the bullet content
      let blockType: string | undefined = undefined;
      const markerMatch = bulletContent.match(/^<!--\s*block:\s*([a-zA-Z0-9_\s-]+)\s*-->\s*(.*)$/i);
      if (markerMatch) {
        blockType = markerMatch[1].trim();
        bulletContent = markerMatch[2].trim();
      }
      
      const colonIdx = bulletContent.indexOf(':');
      let name = '';
      let description = '';
      
      if (colonIdx !== -1) {
        name = bulletContent.substring(0, colonIdx).trim();
        description = bulletContent.substring(colonIdx + 1).trim();
      } else {
        name = bulletContent;
      }
      
      items.push({
        id: Math.random().toString(36).substr(2, 9),
        name,
        description,
        blockType
      });
    }
  });
  
  parsedItems.value = items;
};

// Sync from structured items back to markdown text
const syncToMarkdown = () => {
  const rawText = documentStore.modelTextData[activeConcept.value] || '';
  const match = rawText.match(HEADER_REGEX);
  const header = match ? match[0] : '';

  const mdLines = parsedItems.value.map(item => {
    const cleanName = item.name.trim();
    const cleanDesc = item.description.trim();
    const prefix = item.blockType ? `<!-- block: ${item.blockType} --> ` : '';
    
    if (cleanName && cleanDesc) {
      return `- ${prefix}${cleanName}: ${cleanDesc}`;
    } else if (cleanName) {
      return `- ${prefix}${cleanName}`;
    } else if (cleanDesc) {
      return `- ${prefix}${cleanDesc}`;
    }
    return '';
  }).filter(line => line !== '');
  
  documentStore.modelTextData[activeConcept.value] = header + mdLines.join('\n');
  documentStore.triggerUnsavedChanges();
};

// Watch active concept and raw markdown to keep parsed list updated
watch([activeConcept, () => documentStore.modelTextData[activeConcept.value]], () => {
  syncFromMarkdown();
}, { immediate: true });

const addListItem = () => {
  const activeLower = activeConcept.value.toLowerCase();
  const hasBlockTags = parsedItems.value.some(item => !!item.blockType) || 
                       (documentStore.modelTextData[activeConcept.value] || '').includes('<!-- block:');
                       
  parsedItems.value.push({
    id: Math.random().toString(36).substr(2, 9),
    name: 'New Concept Instance',
    description: 'Description of the concept instance.',
    blockType: hasBlockTags ? activeLower : undefined
  });
  syncToMarkdown();
};

const deleteListItem = (index: number) => {
  parsedItems.value.splice(index, 1);
  syncToMarkdown();
};

const moveItemUp = (index: number) => {
  if (index === 0) return;
  const temp = parsedItems.value[index];
  parsedItems.value[index] = parsedItems.value[index - 1];
  parsedItems.value[index - 1] = temp;
  syncToMarkdown();
};

const moveItemDown = (index: number) => {
  if (index === parsedItems.value.length - 1) return;
  const temp = parsedItems.value[index];
  parsedItems.value[index] = parsedItems.value[index + 1];
  parsedItems.value[index + 1] = temp;
  syncToMarkdown();
};
</script>
