<template>
  <div class="flex-1 flex overflow-hidden">
    <!-- Left Section: Key Search & Domains List -->
    <div class="w-96 border-r border-slate-200 bg-slate-50/50 p-5 overflow-y-auto flex flex-col gap-4 shrink-0">
      <!-- Search Input -->
      <div>
        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Search Analysis Keys</label>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Type to search..." 
          class="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 bg-white"
        >
      </div>

      <!-- Domain Filters / Groupings -->
      <div class="flex-1 flex flex-col gap-4 overflow-y-auto">
        <div v-for="domainName in filteredDomains" :key="domainName" class="space-y-2">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/60 pb-1 flex justify-between">
            <span>{{ domainName }}</span>
            <span class="text-[9px] bg-slate-200 px-1 rounded-full text-slate-600">{{ getDomainCount(domainName) }}</span>
          </div>
          
          <div class="space-y-1.5">
            <div 
              v-for="key in getKeysByDomain(domainName)" 
              :key="key.name" 
              @click="selectedKey = key"
              :class="selectedKey?.name === key.name ? 'border-indigo-200 bg-indigo-50/60 shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50'"
              class="p-3 rounded-lg border transition-all cursor-pointer flex flex-col gap-1.5"
            >
              <div class="flex justify-between items-start">
                <span class="text-xs font-semibold text-slate-800 truncate pr-2" :title="key.name">{{ key.name }}</span>
                <div class="flex gap-1 shrink-0">
                  <span class="text-[9px] font-bold px-1 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    U: {{ getLatestScore(key.name, 'user') }}
                  </span>
                  <span class="text-[9px] font-bold px-1 py-0.5 rounded bg-cyan-50 text-cyan-700">
                    AI: {{ getLatestScore(key.name, 'ai') }}
                  </span>
                </div>
              </div>

              <!-- User Slider visible only if active -->
              <div v-if="selectedKey?.name === key.name" class="pt-2 mt-1 border-t border-slate-200/50" @click.stop>
                <div class="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>Modify score:</span>
                  <span class="font-bold text-indigo-600">{{ getLatestScore(key.name, 'user') }}</span>
                </div>
                <input 
                  type="range" min="1" max="9" 
                  :value="getLatestScore(key.name, 'user')" 
                  @input="handleScoreChange(key.name, 'user', ($event.target as HTMLInputElement).value)"
                  class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                >
              </div>
            </div>
          </div>
        </div>
        <div v-if="!filteredDomains.length" class="text-slate-400 text-xs italic text-center p-4">
          No keys found matching the search terms.
        </div>
      </div>
    </div>

    <!-- Right Section: Diagnostics, Recommendations & Evaluations logs -->
    <div class="flex-1 p-6 overflow-y-auto flex flex-col gap-6 bg-white">
      
      <!-- Diagnostic Heading and AI Button -->
      <div class="flex justify-between items-center border-b border-slate-100 pb-4 shrink-0">
        <div>
          <h2 class="text-base font-bold text-slate-800">Dynamic Diagnosis Card</h2>
          <p class="text-xs text-slate-500">Audit metamodel keys in real time</p>
        </div>
        <button 
          v-if="selectedKey"
          @click="runAIAudit"
          class="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles class="w-3.5 h-3.5" />
          <span>Audit with AI</span>
        </button>
      </div>

      <!-- Detail Card of selected Key -->
      <div v-if="selectedKey" class="bg-slate-50 border border-slate-200/60 p-5 rounded-xl space-y-4">
        <div class="flex justify-between items-start">
          <div>
            <Badge class="bg-slate-200 text-slate-600 mr-2">{{ selectedKey.domain }}</Badge>
            <h3 class="text-sm font-bold text-slate-800 mt-1.5">{{ selectedKey.name }}</h3>
          </div>
          
          <!-- Consensus Badge -->
          <div class="flex items-center gap-1.5 shrink-0">
            <span class="text-[11px] text-slate-500">Evaluation Consensus:</span>
            <Badge size="sm" :class="[consensusStyle, 'border']">{{ consensusLevel }}</Badge>
          </div>
        </div>

        <div class="space-y-1.5">
          <h4 class="text-xs font-bold text-slate-700">Description:</h4>
          <p class="text-xs text-slate-600 leading-relaxed">{{ selectedKey.description }}</p>
        </div>

        <!-- Validation Questions -->
        <div v-if="selectedKey.validation_questions" class="space-y-1.5 pt-2 border-t border-slate-200/60">
          <h4 class="text-xs font-bold text-slate-700">Validation Questions (Guide):</h4>
          <ul class="list-disc pl-4 space-y-1 text-xs text-slate-600">
            <li v-for="q in splitList(selectedKey.validation_questions)" :key="q">{{ q }}</li>
          </ul>
        </div>

        <!-- Action Items / Recommendations -->
        <div v-if="selectedKey.action_items" class="space-y-1.5 pt-2 border-t border-slate-200/60">
          <h4 class="text-xs font-bold text-slate-700">Suggested Alignment Actions:</h4>
          <ul class="list-disc pl-4 space-y-1 text-xs text-slate-600">
            <li v-for="item in splitList(selectedKey.action_items)" :key="item">{{ item }}</li>
          </ul>
        </div>

        <!-- Risk Section -->
        <div v-if="selectedKey.risk" class="space-y-1.5 pt-2 border-t border-slate-200/60 bg-rose-50/30 p-3 rounded-lg border border-rose-200/30">
          <h4 class="text-xs font-bold text-rose-800">Associated Risk: {{ selectedKey.risk }}</h4>
          <p class="text-xs text-rose-700/95 leading-relaxed">{{ selectedKey.risk_description }}</p>
          <div v-if="selectedKey.mitigation_strategy" class="text-xs text-slate-600 pt-1">
            <strong>Mitigation:</strong> {{ selectedKey.mitigation_strategy }}
          </div>
        </div>
      </div>

      <!-- Log of Evaluations -->
      <div v-if="selectedKey" class="space-y-3">
        <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluation History for this Key</h3>
        <div class="border border-slate-100 rounded-xl overflow-hidden shadow-xs">
          <table class="min-w-full divide-y divide-slate-100 text-xs">
            <thead class="bg-slate-50 text-slate-500">
              <tr>
                <th class="px-4 py-2.5 text-left font-semibold">Evaluator</th>
                <th class="px-4 py-2.5 text-left font-semibold">Score</th>
                <th class="px-4 py-2.5 text-left font-semibold">Comments</th>
                <th class="px-4 py-2.5 text-left font-semibold">Audit Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white text-slate-700">
              <tr v-for="score in activeScores" :key="score.timestamp + score.evaluator_id">
                <td class="px-4 py-3 font-medium">
                  <span 
                    :class="score.evaluator_type === 'ai' ? 'text-cyan-700 bg-cyan-50' : 'text-indigo-700 bg-indigo-50'"
                    class="px-1.5 py-0.5 rounded font-bold"
                  >
                    {{ score.evaluator_id }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span class="text-sm font-bold text-slate-800">{{ score.score }}/9</span>
                </td>
                <td class="px-4 py-3 text-slate-600">
                  {{ score.comment || 'No comments' }}
                </td>
                <td class="px-4 py-3 text-slate-400 font-mono">
                  {{ formatTime(score.timestamp) }}
                </td>
              </tr>
              <tr v-if="!activeScores.length">
                <td colspan="4" class="px-4 py-6 text-center text-slate-400 italic">
                  No evaluations recorded for this key yet. Press "Audit with AI" to start.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div v-else class="text-slate-400 text-xs italic text-center my-auto">
        Select a key from the left list to view its diagnosis.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Sparkles } from 'lucide-vue-next';
import Badge from '../ui/Badge.vue';
import { useMetamodelStore } from '../../stores/metamodel';
import { useDocumentStore } from '../../stores/document';
import { AnalysisKey } from '../../types';

const metamodelStore = useMetamodelStore();
const documentStore = useDocumentStore();

const searchQuery = ref('');
const selectedKey = ref<AnalysisKey | null>(metamodelStore.analysisKeys[0] || null);

const filteredKeys = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return metamodelStore.analysisKeys;
  return metamodelStore.analysisKeys.filter(k => 
    k.name.toLowerCase().includes(query) || 
    k.domain.toLowerCase().includes(query) ||
    k.description.toLowerCase().includes(query)
  );
});

const filteredDomains = computed(() => {
  const domains = new Set(filteredKeys.value.map(k => k.domain));
  return Array.from(domains).sort();
});

const getDomainCount = (domain: string): number => {
  return filteredKeys.value.filter(k => k.domain === domain).length;
};

const getKeysByDomain = (domain: string): AnalysisKey[] => {
  return filteredKeys.value.filter(k => k.domain === domain);
};

const activeScores = computed(() => {
  if (!selectedKey.value) return [];
  return documentStore.analysisScores[selectedKey.value.name] || [];
});

const getLatestScore = (keyName: string, evaluatorType: 'user' | 'ai'): number => {
  const scores = documentStore.analysisScores[keyName] || [];
  const matches = scores.filter(s => {
    if (evaluatorType === 'user') return s.evaluator_type === 'human';
    return s.evaluator_type === 'ai';
  });
  if (!matches.length) return 5;
  return matches[matches.length - 1].score;
};

const handleScoreChange = (keyName: string, type: 'user' | 'ai', score: string) => {
  const num = Number(score);
  const evalId = type === 'user' ? 'human_user' : 'ai_evaluator';
  documentStore.addEvaluatorScore(keyName, evalId, type === 'user' ? 'human' : 'ai', num, 'Manual user evaluation.');
};

const consensus = computed(() => {
  if (!selectedKey.value) return { level: 'None', deviation: 0 };
  return documentStore.getKeyConsensus(selectedKey.value.name);
});

const consensusLevel = computed(() => {
  const lvl = consensus.value.level;
  if (lvl === 'High') return 'High Consensus';
  if (lvl === 'Medium') return 'Medium Consensus';
  if (lvl === 'Low') return 'Discrepancy';
  return 'No Data';
});

const consensusStyle = computed(() => {
  const lvl = consensus.value.level;
  if (lvl === 'High') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (lvl === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (lvl === 'Low') return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-slate-50 text-slate-500 border-slate-200';
});

const runAIAudit = () => {
  if (!selectedKey.value) return;
  
  // Perform simulated semantic audit using the key's risk description
  const riskName = selectedKey.value.risk || 'General error';
  const riskDesc = selectedKey.value.risk_description || 'General inconsistency detected in assumptions.';
  const score = Math.floor(Math.random() * 4) + 2; // Range 2 to 5 to simulate issues
  
  const comment = `AI assesses a medium-high risk for factor "${riskName}": ${riskDesc} It is recommended to follow the mitigation strategy defined in the metamodel.`;
  
  documentStore.addEvaluatorScore(
    selectedKey.value.name,
    'ai_model_diagnostician',
    'ai',
    score,
    comment
  );
};

const splitList = (semiColonStr: string): string[] => {
  if (!semiColonStr) return [];
  return semiColonStr.split(';').map(s => s.trim()).filter(s => s !== '');
};

const formatTime = (isoString: string) => {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return isoString;
  }
};
</script>
