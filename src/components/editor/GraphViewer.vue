<template>
  <div class="flex flex-col" :class="localNodeId ? 'h-[480px] min-h-0' : 'h-full'">
    <div class="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30 shrink-0">
      <div v-if="localNodeId" class="flex items-center gap-1.5 text-[10px] text-muted-foreground mr-2">
        <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold text-[9px]">LOCAL</span>
        <span class="truncate max-w-[140px]">{{ localNodeLabel }}</span>
        <button @click="$emit('exit-local')" class="ml-1 text-xs underline hover:text-primary cursor-pointer">Full&nbsp;graph</button>
      </div>
      <div v-else class="flex items-center gap-1 text-xs text-muted-foreground mr-2 font-semibold uppercase tracking-wider">Layout</div>
      <button
        v-for="l in layouts"
        :key="l.id"
        @click="currentLayout = l.id"
        class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer"
        :class="currentLayout === l.id ? 'bg-primary/10 text-primary border border-primary/30 shadow-xs' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground border border-transparent'"
      >
        <component :is="l.icon" class="w-3.5 h-3.5" />
        {{ l.label }}
      </button>
      <div class="flex-1"></div>
      <span class="text-[10px] text-muted-foreground">{{ displayNodes.length }} nodes · {{ displayEdges.length }} edges</span>
    </div>

    <div ref="containerRef" class="flex-1 min-h-0 relative overflow-auto bg-slate-50/50" :class="localNodeId ? 'rounded-b-lg' : ''">
      <svg ref="svgRef" class="w-full h-full" style="display:block;"></svg>
      <div v-if="displayNodes.length === 0" class="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
        No relationships for this element.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import * as d3 from 'd3';
import { GitFork, Share2, CircleDot } from 'lucide-vue-next';
import { useDocumentStore } from '../../stores/document';
import { useMetamodelStore } from '../../stores/metamodel';
import type { TreeNode } from '../../types';

const props = withDefaults(defineProps<{
  localNodeId?: string;
}>(), { localNodeId: '' });
const emit = defineEmits<{ (e: 'exit-local'): void }>();

const documentStore = useDocumentStore();
const metamodelStore = useMetamodelStore();

const containerRef = ref<HTMLDivElement>();
const svgRef = ref<SVGSVGElement>();
const currentLayout = ref('sankey');
const layouts = [
  { id: 'sankey', label: 'Sankey', icon: GitFork },
  { id: 'force', label: 'Force', icon: Share2 },
  { id: 'radial', label: 'Radial', icon: CircleDot },
];

interface GNode { id: string; label: string; concept: string; color: string; inst: boolean; }
interface GEdge { source: string; target: string; label: string; type: string; color: string; }

const localNodeLabel = computed(() => {
  if (!props.localNodeId) return '';
  const n = allNodes.value.find(x => x.id === `inst:${props.localNodeId}` || x.id === `concept:${props.localNodeId}`);
  return n ? n.label : props.localNodeId;
});

const conceptColors: Record<string, string> = {};
function initConceptColors() {
  const palette = ['#3b82f6','#22c55e','#f59e0b','#a855f7','#ef4444','#14b8a6','#f97316','#6366f1','#ec4899','#84cc16','#06b6d4','#e11d48'];
  metamodelStore.concepts.forEach((c, i) => { conceptColors[c.name] = c.color || palette[i % palette.length]; });
}
initConceptColors();

function getHexColor(colorName: string): string {
  const map: Record<string,string> = { blue:'#3b82f6',green:'#22c55e',orange:'#f97316',purple:'#a855f7',red:'#ef4444',teal:'#14b8a6',indigo:'#6366f1',violet:'#8b5cf6',amber:'#f59e0b',yellow:'#eab308',emerald:'#22c55e',rose:'#f43f5e' };
  return map[colorName?.toLowerCase()] || conceptColors[colorName] || '#94a3b8';
}

function hslStr(hex: string, satMult: number, lightOff: number): string {
  const c = d3.hsl(hex);
  return d3.hsl(c.h, Math.min(1, c.s * satMult), Math.max(0, Math.min(1, c.l + lightOff))).formatHex();
}

const allNodes = computed<GNode[]>(() => {
  const result: GNode[] = [];
  const seen = new Set<string>();
  function addNode(id: string, label: string, concept: string, color: string, inst: boolean) {
    if (seen.has(id)) return;
    seen.add(id);
    result.push({ id, label, concept, color: getHexColor(color), inst });
  }
  metamodelStore.concepts.forEach(c => addNode(`concept:${c.name}`, c.name, c.name, c.color || 'slate', false));
  function collectTree(list: TreeNode[], _parent: string, pColor: string) {
    for (const n of list) {
      const color = metamodelStore.getConceptByName(n.type)?.color || pColor;
      addNode(`inst:${n.name}`, n.name, n.type, color, true);
      if (n.children) collectTree(n.children, n.type, color);
    }
  }
  collectTree(documentStore.modelTree, '', 'slate');
  for (const [conceptName, text] of Object.entries(documentStore.modelTextData)) {
    if (metamodelStore.hierarchyConcepts.includes(conceptName)) continue;
    const concept = metamodelStore.getConceptByName(conceptName);
    if (!concept) continue;
    for (const line of text.split('\n')) {
      const m = line.match(/<!--\s*block:\s*([^-]+)\s*-->\s*(.+)/);
      if (m) {
        const label = m[2].replace(/\*\*|\*|__|\[\[|\]\]/g, '').trim();
        if (label) addNode(`inst:${label}`, label, conceptName, concept.color || 'slate', true);
      }
    }
  }
  return result;
});

const allEdges = computed<GEdge[]>(() => {
  const result: GEdge[] = [];
  const nodeSet = new Set(allNodes.value.map(n => n.id));
  const getColor = (cn: string) => getHexColor(metamodelStore.getConceptByName(cn)?.color || 'slate');
  for (const [key, val] of Object.entries(documentStore.matrixValues)) {
    const parts = key.split('||');
    if (parts.length !== 3) continue;
    const [matrixName, row, col] = parts;
    const sid = `inst:${row}`, tid = `inst:${col}`;
    if (!nodeSet.has(sid) || !nodeSet.has(tid)) continue;
    const mx = documentStore.metamatrix.find(m => m.name === matrixName);
    result.push({ source: sid, target: tid, label: String(val), type: matrixName, color: getColor(mx?.source || '') });
  }
  metamodelStore.taxonomyEdges.forEach(e => {
    const sid = `concept:${e.parent}`, tid = `concept:${e.child}`;
    if (nodeSet.has(sid) && nodeSet.has(tid)) result.push({ source: sid, target: tid, label: '', type: 'taxonomy', color: '#94a3b8' });
  });
  return result;
});

const displayNodes = computed(() => {
  if (!props.localNodeId) return allNodes.value;
  const localId = `inst:${props.localNodeId}`;
  const focal = allNodes.value.find(n => n.id === localId);
  if (!focal) return allNodes.value;
  const ids = new Set<string>([localId]);
  const cnames = new Set<string>();
  allEdges.value.forEach(e => {
    if (e.source === localId) { ids.add(e.target); cnames.add(allNodes.value.find(n => n.id === e.target)?.concept || ''); }
    if (e.target === localId) { ids.add(e.source); cnames.add(allNodes.value.find(n => n.id === e.source)?.concept || ''); }
  });
  allNodes.value.forEach(n => { if (ids.has(n.id) && cnames.has(n.concept) && !n.inst) ids.add(n.id); });
  return allNodes.value.filter(n => ids.has(n.id));
});

const displayEdges = computed(() => {
  if (!props.localNodeId) return allEdges.value;
  const ids = new Set(displayNodes.value.map(n => n.id));
  return allEdges.value.filter(e => ids.has(e.source) && ids.has(e.target));
});

function navigateToNode(node: GNode) {
  if (node.inst) {
    const found = documentStore.modelTree.find(n => n.name === node.label);
    if (found) documentStore.selectTreeNode(found, node.concept);
  }
  documentStore.selectConcept(node.concept);
}

let resizeObs: ResizeObserver | null = null;
let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
let root: d3.Selection<SVGGElement, unknown, null, undefined>;
let sim: d3.Simulation<any, any> | null = null;

function initSvg() {
  if (!svgRef.value || !containerRef.value) return;
  svg = d3.select(svgRef.value);
  svg.selectAll('*').remove();
  root = svg.append('g');
  const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.1, 6]).on('zoom', (e) => root.attr('transform', e.transform));
  svg.call(zoom);
  resizeObs = new ResizeObserver(() => { if (svgRef.value) svg.attr('viewBox', `0 0 ${svgRef.value.clientWidth} ${svgRef.value.clientHeight}`); });
  resizeObs.observe(containerRef.value);
}

function textColor(bg: string) { return d3.hsl(bg).l > 0.55 ? '#1e293b' : '#ffffff'; }

/* ─── SANKEY: concepts = colored column headers, instances = flow nodes ─── */
function renderSankey() {
  const W = svgRef.value?.clientWidth || 900, H = svgRef.value?.clientHeight || 600;
  const primaryEdges = displayEdges.value.filter(e => e.type !== 'taxonomy');
  const groups = d3.group(displayNodes.value, n => n.concept);
  let conceptOrder = [...groups.keys()];

  // Build layer order
  const tMap = new Map<string, string[]>();
  metamodelStore.taxonomyEdges.forEach(e => {
    if (!tMap.has(e.parent)) tMap.set(e.parent, []);
    tMap.get(e.parent)!.push(e.child);
  });

  if (tMap.size > 0) {
    const added = new Set<string>(), layers: string[][] = [];
    function addLyr(c: string, d: number) {
      if (added.has(c)) return; added.add(c);
      while (layers.length <= d) layers.push([]);
      layers[d].push(c);
      (tMap.get(c) || []).forEach(ch => addLyr(ch, d + 1));
    }
    const roots = conceptOrder.filter(c => ![...tMap.values()].flat().includes(c));
    roots.forEach(r => addLyr(r, 0));
    conceptOrder.filter(c => !added.has(c)).forEach(c => addLyr(c, layers.length));
    conceptOrder = layers.flat();
  } else {
    const srcSet = new Set(primaryEdges.map(e => displayNodes.value.find(n => n.id === e.source)?.concept).filter(Boolean));
    const tgtSet = new Set(primaryEdges.map(e => displayNodes.value.find(n => n.id === e.target)?.concept).filter(Boolean));
    const mid = new Set(conceptOrder.filter(c => srcSet.has(c) && tgtSet.has(c)));
    conceptOrder = [
      ...conceptOrder.filter(c => srcSet.has(c) && !mid.has(c)),
      ...conceptOrder.filter(c => mid.has(c)),
      ...conceptOrder.filter(c => tgtSet.has(c) && !mid.has(c)),
      ...conceptOrder.filter(c => !srcSet.has(c) && !tgtSet.has(c)),
    ];
  }

  const cCount = conceptOrder.length;
  if (cCount === 0) return;

  const headerH = 32, padX = 40, instGapY = 34;
  const slotW = (W - 2 * padX) / cCount;
  const colW = Math.max(140, Math.min(220, slotW * 0.7));

  const totalW = cCount * (colW + 48) - 48;
  const contentStartX = Math.max(20, (W - totalW) / 2);

  const colInst = new Map<string, { y: number; h: number }[]>();
  const instPos = new Map<string, { x: number; y: number; w: number; h: number }>();

  let maxBottom = 0;

  conceptOrder.forEach((cname, ci) => {
    const insts = (groups.get(cname) || []).filter(n => n.inst);
    const count = insts.length;
    const totalH = Math.max(count * instGapY, 0);
    const startY = Math.max(headerH + 20, (H - totalH) / 2 + headerH + 14);
    const x = contentStartX + ci * slotW + (slotW - colW) / 2;
    const w = colW;
    const positions: { y: number; h: number }[] = [];
    insts.forEach((n, i) => {
      const y = startY + i * instGapY;
      const h = 22;
      instPos.set(n.id, { x, y, w, h });
      positions.push({ y, h });
      maxBottom = Math.max(maxBottom, y + h + 20);
    });
    colInst.set(cname, positions);
  });

  // ── Draw flow lines (edges) between instances ──
  primaryEdges.forEach(e => {
    const s = instPos.get(e.source), t = instPos.get(e.target);
    if (!s || !t) return;
    const sx = s.x + s.w, sy = s.y + s.h / 2;
    const tx = t.x, ty = t.y + t.h / 2;
    const cpx = (sx + tx) / 2;
    root.append('path')
      .attr('d', `M${sx},${sy} C${cpx},${sy} ${cpx},${ty} ${tx},${ty}`)
      .attr('fill', 'none').attr('stroke', e.color).attr('stroke-width', 2.5)
      .attr('stroke-opacity', 0.3).attr('stroke-linecap', 'round')
      .append('title').text(`${e.label} (${e.type})`);
  });

  // ── Draw concept column headers and instance nodes ──
  conceptOrder.forEach((cname, ci) => {
    const x = contentStartX + ci * slotW + (slotW - colW) / 2;
    const w = colW;
    const baseColor = getHexColor(metamodelStore.getConceptByName(cname)?.color || 'slate');
    const fill = hslStr(baseColor, 1, 0);

    root.append('rect').attr('x', x - 2).attr('y', 6).attr('width', w + 4).attr('height', headerH)
      .attr('rx', 6).attr('fill', fill);

    const label = cname.length > 18 ? cname.slice(0, 16) + '…' : cname;
    root.append('text').text(label.toUpperCase()).attr('x', x + w / 2).attr('y', 6 + headerH / 2 + 3.5)
      .attr('text-anchor', 'middle').attr('font-size', 9).attr('font-weight', 700)
      .attr('fill', textColor(baseColor)).append('title').text(cname);

    const insts = (groups.get(cname) || []).filter(n => n.inst);
    const positions = colInst.get(cname) || [];
    insts.forEach((n, i) => {
      const pos = positions[i];
      if (!pos) return;
      const g = root.append('g').attr('cursor', 'pointer');

      g.append('rect').attr('x', x).attr('y', pos.y).attr('width', w).attr('height', pos.h)
        .attr('rx', 4).attr('fill', hslStr(n.color, 0.35, 0.35))
        .attr('stroke', n.color).attr('stroke-width', 1.5);

      g.append('text').text(n.label)
        .attr('x', x + 5).attr('y', pos.y + pos.h / 2 + 3.5)
        .attr('font-size', 8).attr('fill', '#1e293b').attr('font-weight', 500);

      g.on('click', () => navigateToNode(n));
      g.append('title').text(`${n.label} (${n.concept})`);
    });
  });
}

  /* ─── FORCE: concept nodes larger, instance nodes smaller, hover dims ─── */
function renderForce() {
  const W = svgRef.value?.clientWidth || 900, H = svgRef.value?.clientHeight || 600;
  const gData = { nodes: JSON.parse(JSON.stringify(displayNodes.value)), edges: JSON.parse(JSON.stringify(displayEdges.value)) };
  gData.nodes.forEach((n: any) => { n.x = W/2 + (Math.random()-0.5)*300; n.y = H/2 + (Math.random()-0.5)*300; n._active = true; });

  const edgeG = root.append('g');
  const link = edgeG.selectAll('line').data(gData.edges).join('line')
    .attr('stroke', (d: any) => d.color).attr('stroke-width', 2).attr('stroke-opacity', 0.3)
    .attr('stroke-dasharray', (d: any) => d.type === 'taxonomy' ? '4,3' : 'none');

  const linkLabel = edgeG.selectAll('text').data(gData.edges).join('text')
    .attr('font-size', 7).attr('fill', '#64748b').attr('pointer-events', 'none')
    .attr('text-anchor', 'middle').attr('dy', -5).text((d: any) => d.label);

  const nodeG = root.append('g');
  const node = nodeG.selectAll('g').data(gData.nodes).join('g').attr('cursor', 'pointer');

  node.append('circle').attr('r', (d: any) => d.inst ? 16 : 28).attr('fill', (d: any) => d.color)
    .attr('stroke', 'white').attr('stroke-width', (d: any) => d.inst ? 2 : 3);

  // Inner ring for concept nodes
  node.each(function(d: any) {
    if (!d.inst) {
      d3.select(this).insert('circle', ':first-child').attr('r', 22)
        .attr('fill', 'none').attr('stroke', 'white').attr('stroke-width', 1.5).attr('opacity', 0.5);
    }
  });

  node.append('text').text((d: any) => d.label.length > 18 ? d.label.slice(0, 16) + '…' : d.label)
    .attr('text-anchor', 'middle').attr('dy', (d: any) => d.inst ? 3 : 4)
    .attr('font-size', (d: any) => d.inst ? 7 : 9).attr('font-weight', (d: any) => d.inst ? 500 : 700)
    .attr('fill', (d: any) => textColor(d.color)).attr('pointer-events', 'none');

  node.append('title').text((d: any) => `${d.label} (${d.concept})${d.inst ? ' · instance' : ' · concept'}`);

  // Hover: dim non-connected, highlight connected
  node.on('mouseenter', function(_e: any, d: any) {
    const connected = new Set([d.id]);
    gData.edges.forEach((e: any) => {
      if (e.source.id === d.id) connected.add(e.target.id);
      if (e.target.id === d.id) connected.add(e.source.id);
    });
    nodeG.selectAll('g').each(function(n: any) {
      const el = d3.select(this);
      if (connected.has(n.id)) {
        el.attr('opacity', 1);
        el.select('circle').attr('stroke-width', n.inst ? 3 : 4).attr('stroke', n.inst ? d.color : '#fff');
      } else {
        el.attr('opacity', 0.25);
      }
    });
    edgeG.selectAll('line').attr('stroke-opacity', (e: any) => connected.has(e.source.id) && connected.has(e.target.id) ? 0.7 : 0.08);
    edgeG.selectAll('text').attr('opacity', (e: any) => connected.has(e.source.id) && connected.has(e.target.id) ? 1 : 0.05);
  }).on('mouseleave', function() {
    nodeG.selectAll('g').attr('opacity', 1).select('circle').attr('stroke-width', (d: any) => d.inst ? 2 : 3).attr('stroke', 'white');
    edgeG.selectAll('line').attr('stroke-opacity', 0.3);
    edgeG.selectAll('text').attr('opacity', 1);
  });

  node.call(d3.drag<any, any>()
    .on('start', (e, d: any) => { if (!e.active) sim?.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
    .on('drag', (e, d: any) => { d.fx = e.x; d.fy = e.y; })
    .on('end', (e, d: any) => { if (!e.active) sim?.alphaTarget(0); d.fx = null; d.fy = null; })
  ).on('click', (_e: any, d: any) => navigateToNode(d));

  sim = d3.forceSimulation(gData.nodes)
    .force('link', d3.forceLink(gData.edges).id((d: any) => d.id).distance(160).strength(0.12))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('center', d3.forceCenter(W/2, H/2))
    .force('collision', d3.forceCollide(36))
    .on('tick', () => {
      link.attr('x1', (d: any) => d.source.x).attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x).attr('y2', (d: any) => d.target.y);
      linkLabel.attr('x', (d: any) => (d.source.x + d.target.x)/2).attr('y', (d: any) => (d.source.y + d.target.y)/2);
      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });
}

/* ─── RADIAL: concept rings labeled, instances per ring ─── */
function renderRadial() {
  const W = svgRef.value?.clientWidth || 900, H = svgRef.value?.clientHeight || 600;
  const cx = W / 2, cy = H / 2;
  const groups = d3.group(displayNodes.value, n => n.concept);
  const conceptNames = [...groups.keys()];
  const count = conceptNames.length;
  if (count === 0) return;

  const maxR = Math.min(W, H) / 2 - 80;
  const rStep = count > 1 ? maxR / count : maxR / 2;

  // Draw rings and label them
  conceptNames.forEach((cname, li) => {
    const r = rStep * (li + 1);
    const color = getHexColor(metamodelStore.getConceptByName(cname)?.color || 'slate');
    root.append('circle').attr('cx', cx).attr('cy', cy).attr('r', r)
      .attr('fill', 'none').attr('stroke', hslStr(color, 0.3, 0.4)).attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4');
    // Ring label at 12 o'clock
    root.append('text').text(cname).attr('x', cx).attr('y', cy - r - 8)
      .attr('text-anchor', 'middle').attr('font-size', 8).attr('font-weight', 700)
      .attr('fill', color).attr('text-transform', 'uppercase');
  });

  // Position instances on their concept ring
  const nodePos = new Map<string, { x: number; y: number }>();
  conceptNames.forEach((cname, li) => {
    const insts = (groups.get(cname) || []).filter(n => n.inst);
    const r = rStep * (li + 1);
    const angleStep = (2 * Math.PI) / Math.max(insts.length, 1);
    const start = -Math.PI / 2;
    insts.forEach((n, i) => {
      const angle = start + i * angleStep;
      nodePos.set(n.id, { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    });
  });

  // Draw edges between instances
  const linkData = displayEdges.value.filter(e => e.type !== 'taxonomy').map(e => {
    const s = nodePos.get(e.source), t = nodePos.get(e.target);
    return s && t ? { ...e, sx: s.x, sy: s.y, tx: t.x, ty: t.y } : null;
  }).filter(Boolean) as any[];

  root.append('g').selectAll('line').data(linkData).join('line')
    .attr('x1', (d: any) => d.sx).attr('y1', (d: any) => d.sy).attr('x2', (d: any) => d.tx).attr('y2', (d: any) => d.ty)
    .attr('stroke', (d: any) => d.color).attr('stroke-width', 1.5).attr('stroke-opacity', 0.2).attr('stroke-dasharray', '3,3');

  // Draw nodes
  const grp = root.append('g').selectAll('g').data([...nodePos.entries()]).join('g').attr('cursor', 'pointer');
  grp.each(function([id, pos]: any) {
    const n = displayNodes.value.find(x => x.id === id);
    if (!n) return;
    const el = d3.select(this);
    el.append('circle').attr('cx', pos.x).attr('cy', pos.y).attr('r', n.inst ? 14 : 22)
      .attr('fill', n.color).attr('stroke', 'white').attr('stroke-width', 2);
    el.append('text').text(n.label.length > 14 ? n.label.slice(0, 12) + '…' : n.label)
      .attr('x', pos.x).attr('y', pos.y + 3.5).attr('text-anchor', 'middle')
      .attr('font-size', n.inst ? 7 : 8).attr('font-weight', n.inst ? 500 : 700).attr('fill', '#1e293b');
    el.on('click', () => navigateToNode(n));
  });
}

function render() {
  if (!svgRef.value) return;
  svg.selectAll('*').remove();
  root = svg.append('g');
  if (displayNodes.value.length === 0) return;
  const W = svgRef.value.clientWidth || 900, H = svgRef.value.clientHeight || 600;
  svg.attr('viewBox', `0 0 ${W} ${H}`);
  switch (currentLayout.value) {
    case 'sankey': renderSankey(); break;
    case 'force': renderForce(); break;
    case 'radial': renderRadial(); break;
  }
  // Auto-fit: scale to show all content with padding
  requestAnimationFrame(() => {
    try {
      const bounds = (root.node() as SVGGElement)?.getBBox();
      if (bounds && bounds.width > 0 && bounds.height > 0) {
        const pad = 50;
        svg.attr('viewBox', `${bounds.x - pad} ${bounds.y - pad} ${bounds.width + 2 * pad} ${bounds.height + 2 * pad}`);
      }
    } catch (_) { /* ignore */ }
  });
}

watch(currentLayout, () => render());
watch([() => documentStore.modelTree, () => documentStore.matrixValues, () => documentStore.modelTextData], () => {
  initConceptColors();
  render();
}, { deep: true });

onMounted(() => { initSvg(); render(); });
onUnmounted(() => { if (sim) sim.stop(); if (resizeObs) resizeObs.disconnect(); });
</script>