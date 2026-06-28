import { useWorkspaceStore } from '../stores/workspace';
import { useDocumentStore } from '../stores/document';

export function useUrlDocLoader() {
  const loadFromUrlParam = async (): Promise<boolean> => {
    const params = new URLSearchParams(window.location.search);
    const docUrl = params.get('doc');
    if (!docUrl) return false;

    try {
      const url = decodeURIComponent(docUrl);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const content = await res.text();

      const ws = useWorkspaceStore();
      const doc = useDocumentStore();

      const fileName = url.split('/').pop() || 'remote-model.md';
      ws.activeFileName = fileName;
      ws.setDocSource('url');
      doc.loadDocument(content);
      return true;
    } catch (err) {
      console.error('Failed to load doc from URL param:', err);
      return false;
    }
  };

  return { loadFromUrlParam };
}
