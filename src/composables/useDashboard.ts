import { ref, computed, watch } from 'vue';
import { useDocumentStore } from '../stores/document';
import { useMetamodelStore } from '../stores/metamodel';
import { useWorkspaceStore } from '../stores/workspace';
import {
  buildDashboardData,
  renderDashboard,
  validateRenderer,
  DashboardData,
} from '../utils/templateEngine';
import { sanitizeDashboardHtml } from '../utils/sanitize';

export type DashboardStatus = 'idle' | 'loading' | 'ready' | 'missing' | 'error';

export function useDashboard() {
  const documentStore = useDocumentStore();
  const metamodelStore = useMetamodelStore();
  const workspaceStore = useWorkspaceStore();

  const rendererHtml = ref<string>('');
  const compiledHtml = ref<string>('');
  const status = ref<DashboardStatus>('idle');
  const errorMsg = ref<string>('');

  const templateName = computed(() => documentStore.templateName);
  const templateVersion = computed(() => documentStore.templateVersion);

  const dashboardPath = computed(
    () => `docs/templates/${templateName.value}/${templateVersion.value}/dashboard.html`,
  );

  const hasModel = computed(
    () => !!workspaceStore.activeFileName || documentStore.modelTree.length > 0,
  );

  const exists = computed(() => status.value === 'ready' && rendererHtml.value.length > 0);

  const copyableInstructions = computed(() => {
    const name = templateName.value;
    const version = templateVersion.value;
    return `The template ${name} ${version} does not include a dashboard renderer. To generate one, ask your AI agent (opencode, Claude Code, Anti-gravity, or any other) using the FORMAT skill:

    Genera un archivo HTML sin encabezados ni nada, solo código HTML que represente de la mejor forma posible a nivel visual el modelo cargado, usando los placeholders Mustache definidos en el skill de FORMAT.

The renderer MUST be saved at:
    docs/templates/${name}/${version}/dashboard.html

Constraints: HTML fragment only, no scripts, no external resources, inline CSS, Mustache placeholders only (no triple-mustache, no partials, no delimiter changes), template-agnostic keys. See the FORMAT skill for the full specification.`;
  });

  async function fetchRenderer(): Promise<string | null> {
    const path = dashboardPath.value;

    // 1. Try reading from the connected workspace
    if (workspaceStore.dirHandle && !workspaceStore.needsPermission) {
      try {
        const content = await workspaceStore.readWorkspaceFile(path);
        if (content) return content;
      } catch {
        // not in workspace
      }
    }

    // 2. Try fetching from the dev server (Vite serves project root in dev)
    try {
      const resp = await fetch(`/${path}`);
      if (resp.ok) {
        const text = await resp.text();
        // Vite dev server returns index.html (SPA fallback) for missing files.
        // Detect it by checking for HTML document markers — a real renderer is
        // an HTML fragment without these.
        if (text && !/^\s*<!DOCTYPE|^\s*<html/i.test(text)) {
          return text;
        }
      }
    } catch {
      // not available via fetch
    }

    return null;
  }

  function buildData(): DashboardData {
    return buildDashboardData({
      modelTitle: workspaceStore.activeFileName?.replace(/\.md$/, '') || 'Untitled Model',
      modelVersion: documentStore.modelVersion,
      specificationVersion: documentStore.formatVersion,
      templateName: templateName.value,
      templateVersion: templateVersion.value,
      templateTitle: metamodelStore.metamodelSource,
      concepts: metamodelStore.concepts,
      hierarchyConcepts: metamodelStore.hierarchyConcepts as unknown as string[],
      taxonomyEdges: metamodelStore.taxonomyEdges,
      modelTree: documentStore.modelTree,
      modelTextData: documentStore.modelTextData,
      metamatrix: documentStore.metamatrix,
      matrixValues: documentStore.matrixValues,
      getMatrixRowsList: documentStore.getMatrixRowsList,
      getMatrixColsList: documentStore.getMatrixColsList,
    });
  }

  async function loadDashboard() {
    if (!hasModel.value) {
      status.value = 'idle';
      return;
    }

    status.value = 'loading';
    errorMsg.value = '';

    try {
      const raw = await fetchRenderer();

      if (!raw) {
        status.value = 'missing';
        rendererHtml.value = '';
        compiledHtml.value = '';
        return;
      }

      const validation = validateRenderer(raw);
      if (!validation.valid) {
        status.value = 'error';
        errorMsg.value = validation.errors.join('; ');
        return;
      }

      const sanitized = sanitizeDashboardHtml(raw);
      const data = buildData();
      const rendered = renderDashboard(sanitized, data);

      rendererHtml.value = raw;
      compiledHtml.value = rendered;
      status.value = 'ready';
    } catch (err) {
      status.value = 'error';
      errorMsg.value = err instanceof Error ? err.message : String(err);
    }
  }

  watch(
    [templateName, templateVersion, () => workspaceStore.activeFileName],
    () => {
      // Only load when a model file is actually active, not on store init
      // with stale default template name/version.
      if (!workspaceStore.activeFileName) {
        status.value = 'idle';
        return;
      }
      loadDashboard();
    },
    { immediate: true },
  );

  return {
    status,
    errorMsg,
    exists,
    compiledHtml,
    copyableInstructions,
    dashboardPath,
    loadDashboard,
  };
}
