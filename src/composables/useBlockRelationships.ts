import { computed } from 'vue';
import { useDocumentStore } from '../stores/document';
import { useMetamodelStore } from '../stores/metamodel';
import type { TreeNode, BlockData } from '../types';

/**
 * Extract wikilinks from text using the [[BlockName]] pattern.
 */
export function extractWikiLinks(text: string): string[] {
  if (!text) return [];
  const regex = /\[\[([^\]]+)\]\]/g;
  const links: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    links.push(match[1]);
  }
  return links;
}

/**
 * Composable for computing block-level wikilink relationships.
 *
 * Provides:
 * - extractWikiLinks: pure function to extract [[links]] from text
 * - getOutgoingRelationships: which blocks does the current block reference
 * - getIncomingRelationships: which blocks reference the current block
 */
export function useBlockRelationships() {
  const documentStore = useDocumentStore();
  const metamodelStore = useMetamodelStore();

  /**
   * Get outgoing relationships for a given block.
   * Scans the block's description and all reference-type fields for wikilinks.
   */
  function getOutgoingRelationships(block: BlockData) {
    return computed(() => {
      const links = new Set<string>();

      // Scan description for wikilinks
      if (block.description) {
        extractWikiLinks(block.description).forEach(link => links.add(link));
      }

      // Scan reference-type fields for wikilinks
      if (block.fields && block.type) {
        const concept = metamodelStore.getConceptByName(block.type);
        if (concept?.fields && Array.isArray(concept.fields)) {
          for (const fieldDef of concept.fields) {
            if (fieldDef.type === 'reference') {
              const fieldValue = block.fields[fieldDef.name];
              if (fieldValue && typeof fieldValue === 'string') {
                // Reference fields store block names directly (not as [[links]])
                links.add(fieldValue);
              }
            }
          }
        }
      }

      return Array.from(links);
    });
  }

  /**
   * Get incoming relationships for a given block name.
   * Scans all modelTree nodes and modelTextData for references to this block.
   */
  function getIncomingRelationships(blockName: string) {
    return computed(() => {
      const references: Array<{ block: TreeNode; fieldName?: string }> = [];

      // Scan modelTree nodes for wikilinks in descriptions and reference fields
      const scanNodes = (nodes: TreeNode[]) => {
        for (const node of nodes) {
          // Skip the block itself to avoid self-references
          if (node.name === blockName) continue;

          // Check description for wikilinks
          if (node.description) {
            const links = extractWikiLinks(node.description);
            if (links.includes(blockName)) {
              references.push({ block: node });
            }
          }

          // Check reference-type fields
          if (node.fields && node.type) {
            const concept = metamodelStore.getConceptByName(node.type);
            if (concept?.fields && Array.isArray(concept.fields)) {
              for (const fieldDef of concept.fields) {
                if (fieldDef.type === 'reference') {
                  const fieldValue = node.fields[fieldDef.name];
                  if (fieldValue === blockName) {
                    references.push({ block: node, fieldName: fieldDef.name });
                  }
                }
              }
            }
          }

          // Recurse into children
          if (node.children && node.children.length > 0) {
            scanNodes(node.children);
          }
        }
      };

      scanNodes(documentStore.modelTree);

      // Also scan modelTextData for wikilinks
      for (const [textKey, textVal] of Object.entries(documentStore.modelTextData)) {
        if (typeof textVal === 'string') {
          const links = extractWikiLinks(textVal);
          if (links.includes(blockName)) {
            // For text data, we create a virtual reference
            // Find a matching node or create a minimal reference
            const matchingNode = documentStore.modelTree.find(n => n.name === textKey);
            if (matchingNode && matchingNode.name !== blockName) {
              // Avoid duplicates
              if (!references.some(r => r.block.name === matchingNode.name && !r.fieldName)) {
                references.push({ block: matchingNode });
              }
            }
          }
        }
      }

      return references;
    });
  }

  return {
    extractWikiLinks,
    getOutgoingRelationships,
    getIncomingRelationships,
  };
}
