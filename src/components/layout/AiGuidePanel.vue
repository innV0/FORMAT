<template>
  <Teleport to="body">
    <Transition name="panel-slide">
      <div v-if="visible" class="fixed inset-0 z-50 flex justify-end">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/30 backdrop-blur-sm"
          @click="$emit('close')"
        ></div>

        <!-- Panel -->
        <div class="relative w-full max-w-lg bg-white shadow-2xl border-l border-slate-200 h-full overflow-y-auto animate-in slide-in-from-right duration-200">
          <!-- Header -->
          <div class="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
            <div class="flex items-center gap-3">
              <Sparkles class="w-5 h-5" />
              <h2 class="text-base font-bold">Edit with AI</h2>
            </div>
            <button
              @click="$emit('close')"
              class="p-1.5 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Content -->
          <div class="px-6 py-6 space-y-8 text-sm text-slate-700">
            <!-- Intro -->
            <section>
              <p class="text-slate-600 leading-relaxed">
                You can modify this FORMAT model using <strong>any AI coding agent</strong>.
                The agent reads the model, understands its structure via the <strong>FORMAT skill</strong>,
                and makes precise edits while preserving referential integrity.
              </p>
            </section>

            <!-- Supported Agents -->
            <section>
              <h3 class="text-xs font-bold uppercase tracking-wider text-violet-600 mb-3">Supported Agents</h3>
              <div class="grid grid-cols-2 gap-2">
                <div v-for="agent in agents" :key="agent.name"
                  class="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"
                >
                  <span class="text-lg">{{ agent.icon }}</span>
                  <div>
                    <span class="text-xs font-semibold text-slate-800">{{ agent.name }}</span>
                    <span v-if="agent.badge" class="ml-1.5 inline-block text-2xs font-bold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded">{{ agent.badge }}</span>
                  </div>
                </div>
              </div>
            </section>

            <!-- Step by step -->
            <section>
              <h3 class="text-xs font-bold uppercase tracking-wider text-violet-600 mb-3">How to use it</h3>
              <ol class="space-y-4">
                <li v-for="(step, i) in steps" :key="i" class="flex gap-3">
                  <span class="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold">{{ i + 1 }}</span>
                  <div class="pt-0.5">
                    <p class="text-slate-700 leading-relaxed" v-html="step.text"></p>
                    <div v-if="step.code" class="mt-1.5">
                      <button
                        @click="copy(step.code)"
                        class="group relative w-full text-left"
                      >
                        <pre class="text-2xs font-mono bg-slate-900 text-slate-200 rounded-lg p-3 overflow-x-auto leading-relaxed">{{ step.code }}</pre>
                        <span class="absolute top-2 right-2 text-2xs text-slate-500 group-hover:text-slate-300 transition-colors">{{ copiedIndex === i ? 'Copied!' : 'Copy' }}</span>
                      </button>
                    </div>
                  </div>
                </li>
              </ol>
            </section>

            <!-- Prompt templates -->
            <section>
              <h3 class="text-xs font-bold uppercase tracking-wider text-violet-600 mb-3">Example prompts</h3>
              <div class="space-y-2">
                <button
                  v-for="(example, i) in examples"
                  :key="i"
                  @click="copyExample(example.prompt, i)"
                  class="group relative w-full text-left rounded-lg border border-slate-200 bg-slate-50 p-3 hover:border-violet-200 hover:bg-violet-50 transition-all cursor-pointer"
                >
                  <p class="text-xs text-slate-700 leading-relaxed pr-12">{{ example.prompt }}</p>
                  <span class="absolute top-3 right-3 text-2xs text-slate-400 group-hover:text-violet-600 transition-colors">{{ copiedExampleIndex === i ? 'Copied!' : 'Copy' }}</span>
                </button>
              </div>
            </section>

            <!-- Keyboard shortcut hint -->
            <section class="rounded-lg bg-amber-50 border border-amber-200 p-4">
              <div class="flex items-start gap-2.5">
                <Lightbulb class="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p class="text-xs font-semibold text-amber-800">Tip</p>
                  <p class="text-xs text-amber-700 mt-1 leading-relaxed">
                    Once your AI agent has the FORMAT skill loaded, you can just say things like <em>"add a new stakeholder called Marketing"</em> or <em>"change the priority of feature X to High"</em> — the agent handles the rest.
                  </p>
                </div>
              </div>
            </section>

            <!-- Footer -->
            <section class="border-t border-slate-100 pt-4 pb-2">
              <p class="text-xs text-slate-400 text-center">
                The FORMAT skill is available at
                <a href="https://github.com/innV0/FORMAT" target="_blank" rel="noopener noreferrer" class="text-violet-600 hover:text-violet-700 underline">github.com/innV0/FORMAT</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Sparkles, X, Lightbulb } from 'lucide-vue-next';

defineProps<{ visible: boolean }>();
defineEmits<{ close: [] }>();

const agents = [
  { name: 'OpenCode', icon: '⚡', badge: 'Recommended' },
  { name: 'Claude Code', icon: '🧠' },
  { name: 'Anti-gravity', icon: '🔄' },
  { name: 'Cursor', icon: '📝' },
  { name: 'GitHub Copilot', icon: '🤖' },
  { name: 'Cline', icon: '🔧' },
];

const steps = [
  {
    text: 'Open the project root (<strong class="text-slate-900">FORMAT/</strong>) in your AI agent.',
  },
  {
    text: 'Make sure the agent has loaded the <strong class="text-slate-900">FORMAT skill</strong>. It auto-detects from the <span class="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">.agents/</span> directory.',
  },
  {
    text: 'Tell the agent what you want to change. Be specific about the concept, element, and field.',
    code: 'Add a new element "Social Media" under "Channels" with scope "external" and priority "High".',
  },
  {
    text: 'The agent edits the model, updates all wikilinks and matrix references automatically, and tags changes with <span class="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">#AI</span>.',
  },
  {
    text: 'Review the changes, save the file, and close the loop.',
  },
];

const examples = [
  {
    prompt: 'Add a new stakeholder "Marketing Team" with scope "internal" to the business model.',
  },
  {
    prompt: 'Rename the concept "Problems" to "Challenges" and update all references.',
  },
  {
    prompt: 'Add a new Value Proposition "24/7 Support" and link it to the "Enterprise" segment in the matrix.',
  },
  {
    prompt: 'Bump the model version to minor and save.',
  },
];

const copiedIndex = ref<number | null>(null);
const copiedExampleIndex = ref<number | null>(null);

async function copy(text: string) {
  await navigator.clipboard.writeText(text);
};

function copyExample(text: string, index: number) {
  navigator.clipboard.writeText(text);
  copiedExampleIndex.value = index;
  setTimeout(() => { copiedExampleIndex.value = null; }, 2000);
};
</script>

<style scoped>
.panel-slide-enter-active {
  transition: all 0.2s ease-out;
}
.panel-slide-leave-active {
  transition: all 0.15s ease-in;
}
.panel-slide-enter-from .relative,
.panel-slide-leave-to .relative {
  transform: translateX(100%);
}
.panel-slide-enter-from .absolute,
.panel-slide-leave-to .absolute {
  opacity: 0;
}
</style>
