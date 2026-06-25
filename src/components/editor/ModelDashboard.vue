<template>
  <div class="h-full flex flex-col gap-3">
    <!-- Loading -->
    <div v-if="dashboardStatus === 'loading'" class="flex items-center gap-2 text-xs text-muted-foreground py-8 justify-center">
      <Loader2 class="w-4 h-4 animate-spin" />
      <span>Loading dashboard...</span>
    </div>

    <!-- Error -->
    <div v-else-if="dashboardStatus === 'error'" class="bg-destructive/5 border border-destructive/20 rounded-lg p-4 space-y-2">
      <div class="flex items-center gap-2 text-destructive">
        <AlertCircle class="w-4 h-4" />
        <span class="text-xs font-semibold">Dashboard Renderer Error</span>
      </div>
      <p class="text-xs text-destructive/80 font-mono break-all">{{ dashboardError }}</p>
      <p class="text-[10px] text-muted-foreground">The renderer at <code class="font-mono">{{ dashboardPathRef }}</code> failed validation or rendering.</p>
    </div>

    <!-- Missing: show copyable instructions -->
    <div v-else-if="dashboardStatus === 'missing'" class="bg-amber-50 border border-amber-200 rounded-lg p-5 space-y-4">
      <div class="flex items-center gap-2 text-amber-700">
        <Info class="w-4 h-4" />
        <span class="text-xs font-semibold">No Dashboard Renderer Found</span>
      </div>
      <p class="text-xs text-amber-700/80">
        The template <strong class="font-mono">{{ templateName }} {{ templateVersion }}</strong> does not include a <code>dashboard.html</code> renderer.
      </p>
      <p class="text-xs text-amber-700/70">To generate one, copy the instructions below and give them to your AI agent (opencode, Claude Code, Anti-gravity, or any other) with the FORMAT skill loaded:</p>
      <div class="relative">
        <pre class="bg-amber-900 text-amber-50 text-[11px] font-mono p-3 rounded-md overflow-x-auto whitespace-pre-wrap leading-relaxed">{{ dashboardInstructions }}</pre>
        <button
          @click="copyInstructions"
          class="absolute top-2 right-2 inline-flex items-center gap-1 text-[10px] bg-amber-50/20 hover:bg-amber-50/30 text-amber-50 px-2 py-1 rounded transition-colors cursor-pointer font-semibold"
        >
          <component :is="copied ? Check : Copy" class="w-3 h-3" />
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
      </div>
    </div>

    <!-- Ready: render in sandboxed iframe -->
    <template v-else-if="dashboardExists">
      <div class="flex items-center justify-between shrink-0">
        <span class="text-[10px] text-muted-foreground font-mono">{{ dashboardPathRef }}</span>
        <button
          @click="refresh"
          class="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <RefreshCw class="w-3 h-3" />
          <span>Refresh</span>
        </button>
      </div>
      <iframe
        :srcdoc="iframeSrcdoc"
        sandbox="allow-same-origin"
        class="w-full flex-1 border border-border rounded-lg bg-white"
        referrerpolicy="no-referrer"
      ></iframe>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Loader2, AlertCircle, Info, Copy, Check, RefreshCw } from 'lucide-vue-next';
import { useDashboard } from '../../composables/useDashboard';
import { useDocumentStore } from '../../stores/document';

const {
  status: dashboardStatus,
  errorMsg: dashboardError,
  exists: dashboardExists,
  compiledHtml: dashboardCompiledHtml,
  copyableInstructions: dashboardInstructions,
  dashboardPath: dashboardPathRef,
  loadDashboard,
} = useDashboard();
const documentStore = useDocumentStore();

const templateName = computed(() => documentStore.templateName);
const templateVersion = computed(() => documentStore.templateVersion);

const copied = ref(false);

const CSP_META = '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; img-src data:;">';

const iframeSrcdoc = computed(() => {
  return CSP_META + dashboardCompiledHtml.value;
});

async function copyInstructions() {
  try {
    await navigator.clipboard.writeText(dashboardInstructions.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy instructions:', err);
  }
}

function refresh() {
  loadDashboard();
}
</script>
