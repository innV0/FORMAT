#!/usr/bin/env node
/**
 * Template Version Drift Detector
 *
 * Reads each template file and sample model in the registry and validates
 * that `template.version` in the frontmatter matches an existing template
 * directory under docs/templates/.
 *
 * Exit code:
 *   0 — all template references valid
 *   1 — drift detected (stale references listed on stderr)
 *
 * Usage:  node scripts/check-template-version.mjs
 *         (or via npm run check:template-version)
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const TEMPLATES_DIR = join(ROOT, 'docs', 'templates');

// ---- 1. Build the map of available template versions ----

function getAvailableTemplates(baseDir) {
  const templates = {};
  for (const type of readdirSync(baseDir)) {
    const typeDir = join(baseDir, type);
    if (!statSync(typeDir).isDirectory()) continue;
    const versions = [];
    for (const entry of readdirSync(typeDir)) {
      const entryPath = join(typeDir, entry);
      if (statSync(entryPath).isDirectory() && entry.startsWith('V_')) {
        versions.push(entry);
      }
    }
    templates[type] = versions;
  }
  return templates;
}

const availableTemplates = getAvailableTemplates(TEMPLATES_DIR);

// ---- 2. Define tracked files ----

const TRACKED_FILES = [
  // Templates (self-check: own template.version must match directory)
  { path: 'docs/templates/business/V_0-1-0/business_V_0-1-0_FORMAT.md', type: 'template' },
  { path: 'docs/templates/procedures/V_0-1-0/procedures_V_0-1-0_FORMAT.md', type: 'template' },
  // Sample models
  { path: 'docs/templates/business/V_0-1-0/samples/Ghostbusters_V_0-1-0_business_FORMAT.md', type: 'model' },
  { path: 'docs/templates/business/V_0-1-0/samples/Ghostbusters_V_0-1-1_business_FORMAT.md', type: 'model' },
  { path: 'docs/templates/procedures/V_0-1-0/samples/Comprehensive_Test_Procedure_V_1-0-0_procedures_FORMAT.md', type: 'model' },
  { path: 'docs/templates/procedures/V_0-1-0/samples/Knowledge_Management_V_1-0-0_procedures_FORMAT.md', type: 'model' },
];

let drift = false;
const errors = [];

for (const entry of TRACKED_FILES) {
  const absPath = join(ROOT, entry.path);
  if (!existsSync(absPath)) {
    errors.push(`[MISSING] ${entry.path} — listed in TRACKED_FILES but does not exist`);
    drift = true;
    continue;
  }

  const content = readFileSync(absPath, 'utf8');
  const fmMatch = content.match(/^---\r?\n([\s\S]+?)\r?\n---/m);
  if (!fmMatch) {
    errors.push(`[NO-FRONTMATTER] ${entry.path} — no YAML frontmatter block found`);
    drift = true;
    continue;
  }

  const fm = fmMatch[1];

  // Extract the template block by iterating indented lines after `template:`
  const lines = fm.split(/\r?\n/);
  let inTemplate = false;
  let templateName = null;
  let templateVersion = null;
  for (const line of lines) {
    const trimmed = line.trimStart();
    if (trimmed.startsWith('template:')) { inTemplate = true; continue; }
    if (inTemplate) {
      if (/^\s/.test(line)) { // still indented
        // Skip list items (matrix entries under matrices:)
        if (line.trimStart().startsWith('- ')) continue;
        const n = line.match(/^\s+name:\s*"([^"]+)"/);
        const v = line.match(/^\s+version:\s*"([^"]+)"/);
        if (n && !templateName) templateName = n[1];
        if (v && !templateVersion) templateVersion = v[1];
      } else {
        inTemplate = false; // end of template block
      }
    }
  }

  if (!templateName) {
    errors.push(`[NO-TEMPLATE-NAME] ${entry.path} — template.name not found in frontmatter`);
    drift = true;
    continue;
  }
  if (!templateVersion) {
    errors.push(`[NO-TEMPLATE-VERSION] ${entry.path} — template.version not found in frontmatter`);
    drift = true;
    continue;
  }

  // Validate against available templates
  if (!availableTemplates[templateName]) {
    errors.push(`[UNKNOWN-TEMPLATE] ${entry.path} — template.name "${templateName}" — no such template directory under docs/templates/`);
    drift = true;
    continue;
  }

  if (!availableTemplates[templateName].includes(templateVersion)) {
    errors.push(`[STALE-TEMPLATE-VERSION] ${entry.path} — template.version "${templateVersion}" — not found in docs/templates/${templateName}/ (available: ${availableTemplates[templateName].join(', ') || 'none'})`);
    drift = true;
  }

  // For template files themselves, verify their directory matches their version
  if (entry.type === 'template') {
    const dirMatch = entry.path.match(/V_(\d+-\d+-\d+)\//);
    if (dirMatch) {
      const dirVersion = 'V_' + dirMatch[1];
      if (dirVersion !== templateVersion) {
        errors.push(`[DIR-VERSION-MISMATCH] ${entry.path} — lives in ${dirVersion}/ but declares template.version "${templateVersion}"`);
        drift = true;
      }
    }
  }
}

// Also cross-check with AGENTS.md registry
const AGENTS_PATH = join(ROOT, '.agents', 'AGENTS.md');
if (existsSync(AGENTS_PATH)) {
  const agentsSrc = readFileSync(AGENTS_PATH, 'utf8');
  const registryHeader = '### Template-Version Tracked Files Registry';
  const headerIdx = agentsSrc.indexOf(registryHeader);
  if (headerIdx === -1) {
    errors.push(`[REGISTRY-MISSING] .agents/AGENTS.md — section "${registryHeader}" not found`);
    drift = true;
  }
}

if (drift) {
  console.error(`\nTemplate version drift detected.\n`);
  for (const e of errors) console.error(`  ${e}`);
  console.error(`\nFix: ensure template.version matches an existing template directory,`);
  console.error(`then re-run this script.`);
  process.exit(1);
} else {
  console.log('OK — all template references are valid');
  process.exit(0);
}
