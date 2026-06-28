#!/usr/bin/env node
/**
 * Skill Reference Integrity Checker
 *
 * Validates that hardcoded template paths, versions, and file references
 * in .agents/skills/innv0-format/SKILL.md match the actual file tree.
 *
 * Exit code:
 *   0 — all references valid
 *   1 — drift detected
 *
 * Usage:  node scripts/check-skill-refs.mjs
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SKILL_PATH = join(ROOT, '.agents', 'skills', 'innv0-format', 'SKILL.md');
const TEMPLATES_DIR = join(ROOT, 'docs', 'templates');

// ---- 1. Build actual template file tree ----

const actualTemplates = {};
for (const type of readdirSync(TEMPLATES_DIR)) {
  const typeDir = join(TEMPLATES_DIR, type);
  if (!statSync(typeDir).isDirectory()) continue;
  actualTemplates[type] = {};
  for (const ver of readdirSync(typeDir)) {
    const verDir = join(typeDir, ver);
    if (!statSync(verDir).isDirectory() || !ver.startsWith('V_')) continue;
    actualTemplates[type][ver] = [];
    for (const file of readdirSync(verDir)) {
      const filePath = join(verDir, file);
      if (statSync(filePath).isFile()) {
        actualTemplates[type][ver].push(file);
      }
    }
  }
}

// ---- 2. Expected references in SKILL.md ----

const expectedRefs = [];

// Template directories
for (const [type, versions] of Object.entries(actualTemplates)) {
  for (const [ver, files] of Object.entries(versions)) {
    // The template file itself
    const templateFile = files.find(f => f.endsWith('_FORMAT.md') && !f.includes('samples'));
    if (templateFile) {
      expectedRefs.push({
        what: 'template file',
        pattern: `docs/templates/${type}/${ver}/${templateFile}`,
      });
    }
    // Sample files
    const samplesDir = join(TEMPLATES_DIR, type, ver, 'samples');
    if (existsSync(samplesDir)) {
      for (const sample of readdirSync(samplesDir)) {
        const samplePath = join(samplesDir, sample);
        if (statSync(samplePath).isFile() && sample.endsWith('_FORMAT.md')) {
          expectedRefs.push({
            what: 'sample file',
            pattern: sample,
          });
        }
      }
    }
  }
}

// ---- 3. Scan SKILL.md for stale references ----

if (!existsSync(SKILL_PATH)) {
  console.error(`[MISSING] SKILL.md not found at ${SKILL_PATH}`);
  process.exit(1);
}

const skillContent = readFileSync(SKILL_PATH, 'utf8');
let drift = false;
const errors = [];

// Check that every V_x-y-z in the skill matches an actual template dir
const versionRefs = skillContent.match(/V_\d+-\d+-\d+/g) || [];
const actualVersions = new Set();
for (const versions of Object.values(actualTemplates)) {
  for (const ver of Object.keys(versions)) actualVersions.add(ver);
}

for (const ref of versionRefs) {
  // Skip spec versions (V_0-1-x) — those are checked by check:spec-version
  if (ref.startsWith('V_0-')) continue;
  // Skip example model versions — those are arbitrary
  if (ref === 'V_1-0-0' || ref === 'V_0-3-2' || ref === 'V_0-3-0') continue;
  if (!actualVersions.has(ref)) {
    errors.push(`[STALE-VERSION] SKILL.md references "${ref}" but no template directory with that version exists (found: ${[...actualVersions].join(', ')})`);
    drift = true;
  }
}

// Check that template file references in Markdown code blocks exist
const fileRefs = skillContent.match(/docs\/templates\/[^\s)`]+/g) || [];
for (const ref of fileRefs) {
  // Skip pattern placeholders (e.g. <name>, <templateName>)
  if (ref.includes('<')) continue;
  // Skip dashboard.html references — absence of a renderer is by design
  if (ref.endsWith('dashboard.html')) continue;
  const absPath = join(ROOT, ref);
  if (!existsSync(absPath)) {
    // Check if it's a sample that might have a different name
    const dirPart = ref.substring(0, ref.lastIndexOf('/'));
    const fileName = ref.substring(ref.lastIndexOf('/') + 1);
    const dirAbs = join(ROOT, dirPart);
    if (existsSync(dirAbs)) {
      const actualFiles = readdirSync(dirAbs).filter(f => f.endsWith('_FORMAT.md'));
      if (actualFiles.length > 0 && !actualFiles.includes(fileName)) {
        errors.push(`[STALE-FILE-REF] SKILL.md references "${ref}" but that file does not exist. Actual files in that directory: ${actualFiles.join(', ')}`);
        drift = true;
      }
    } else {
      errors.push(`[MISSING-FILE-REF] SKILL.md references "${ref}" — path does not exist`);
      drift = true;
    }
  }
}

if (drift) {
  console.error(`\nSkill reference drift detected in .agents/skills/innv0-format/SKILL.md\n`);
  for (const e of errors) console.error(`  ${e}`);
  console.error(`\nFix: update SKILL.md to match the actual template file tree.`);
  process.exit(1);
} else {
  console.log('OK — all SKILL.md references match the actual file tree');
  process.exit(0);
}
