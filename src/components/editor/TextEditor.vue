<template>
  <div class="flex flex-col flex-1 gap-4 overflow-y-auto p-1">
    <!-- Header with Add Item button for list concepts -->
    <div v-if="isListConcept" class="flex justify-between items-center pb-2 border-b border-slate-100 shrink-0">
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

    <!-- Central feed: concept pinned + instances.
         Keyed by concept so switching concepts remounts the feed — this resets
         edit state and collapse defaults (list concept = collapsed context,
         single concept = expanded content). -->
    <BlockFeed
      :key="activeConcept"
      :concept-name="activeConcept"
      :concept-type="conceptType"
      :concept-color="conceptColor"
      :concept-icon="conceptIcon"
      :concept-block="textBlock"
      :items="parsedItems"
      :is-list-concept="isListConcept"
      :has-markers="true"
      @change-concept="updateSingleBlockText"
      @change-item="syncToMarkdown"
      @add-item="addListItem"
      @delete-item="deleteListItem"
      @move-item-up="moveItemUp"
      @move-item-down="moveItemDown"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDocumentStore } from '../../stores/document';
import { useMetamodelStore } from '../../stores/metamodel';
import { Plus } from 'lucide-vue-next';
import BlockFeed from './BlockFeed.vue';
import { slugify } from '../../utils/sanitize';

const documentStore = useDocumentStore();
const metamodelStore = useMetamodelStore();

const activeConcept = computed(() => documentStore.activeConceptName);
const conceptType = computed(() => documentStore.getConceptType());

const conceptColor = computed(() => {
  return metamodelStore.getConceptByName(activeConcept.value)?.color || '';
});

const conceptIcon = computed(() => {
  return metamodelStore.getConceptByName(activeConcept.value)?.icon || '';
});

// Check if this is an instantiable list-like concept
const isListConcept = computed(() => {
  return ['weight', 'steps', 'sequence', 'list'].includes(conceptType.value);
});

// Single instance text block state.
// A stable, concept-derived id lets markers anchor to the concept block itself
// (not just its instances), and keeps those values persisted across re-renders.
const conceptBlockId = (name: string) => `concept:${slugify(name)}`;
const textBlock = ref({
  id: '',
  name: '',
  description: ''
});

const HEADER_REGEX = /^#\s+<!--\s*block:\s*[a-zA-Z0-9_\s-]+\s*-->\s*[^\n]*\r?\n*/i;

const stripHeader = (text: string) => {
  return text.replace(HEADER_REGEX, '').trim();
};

watch(activeConcept, (newVal) => {
  textBlock.value = {
    id: conceptBlockId(newVal),
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

// Build a deterministic, content-derived id so re-parsing on every keystroke
// keeps the same id — this is what lets markers stay anchored to a list item
// and prevents the component from remounting (and losing focus) while editing.
const stableItemId = (name: string, seen: Map<string, number>) => {
  const base = `li-${slugify(activeConcept.value)}-${slugify(name) || 'unnamed'}`;
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
};

// Sync from text markdown content to structured parsed items
const syncFromMarkdown = () => {
  const text = documentStore.modelTextData[activeConcept.value] || '';
  const lines = text.split('\n');
  const items: ParsedItem[] = [];
  const seenIds = new Map<string, number>();

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
        id: stableItemId(name, seenIds),
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
