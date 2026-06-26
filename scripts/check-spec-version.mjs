#!/usr/bin/env node
/**
 * Spec Version Drift Detector
 *
 * Reads DEFAULT_FORMAT_VERSION from src/utils/constants.ts (single source of truth)
 * and verifies that every tracked artifact is in sync.
 *
 * Tracked artifacts (two categories):
 *
 * 1. Markdown / non-code files — carry an HTML comment marker:
 *      <!-- @spec-version V_x-y-z -->
 *    The script extracts the version from the marker and compares it.
 *
 * 2. TypeScript / Vue code files — must NOT hardcode the spec version as a
 *    string literal. Only constants.ts is allowed to declare it. Any other
 *    .ts/.vue file containing a `V_0-x-y` literal that is NOT inside a comment
 *    is flagged as drift (it should import from constants.ts instead).
 *
 * Exit code:
 *   0 — all artifacts in sync
 *   1 — drift detected (stale files listed on stderr)
 *
 * Usage:  node scripts/check-spec-version.mjs
 *         (or via npm run check:spec-version)
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ---- 1. Read the single source of truth from constants.ts ----

const CONSTANTS_PATH = join(ROOT, 'src', 'utils', 'constants.ts');
const constantsSource = readFileSync(CONSTANTS_PATH, 'utf8');
const versionMatch = constantsSource.match(
  /export\s+const\s+DEFAULT_FORMAT_VERSION\s*=\s*['"]([^'"]+)['"]/,
);
if (!versionMatch) {
  console.error(`FATAL: could not find DEFAULT_FORMAT_VERSION in ${CONSTANTS_PATH}`);
  process.exit(2);
}
const CURRENT_VERSION = versionMatch[1];

// ---- 2. Define the tracked files ----

/**
 * Markdown / non-code files that carry an @spec-version marker.
 * Extend this list when new non-code artifacts are added to the repo.
 */
const MARKER_FILES = [
  '.agents/skills/_FORMAT-skill/SKILL.md',
  'docs/templates/business/V_1-0-0/business_V_1-0-0_FORMAT.md',
  'docs/templates/business/V_1-0-0/samples/Ghostbusters_V_0-1-0_business_FORMAT.md',
  'docs/templates/procedures/V_1-1-0/procedures_V_1-1-0_FORMAT.md',
  'docs/templates/procedures/V_1-1-0/samples/Comprehensive_Test_Procedure_V_1-0-0_procedures_FORMAT.md',
];

/**
 * Code files allowed to contain a V_x-y-z literal:
 * - constants.ts owns the declaration
 * - version.ts references it in JSDoc comments only
 */
const CODE_ALLOWLIST = ['src/utils/constants.ts', 'src/utils/version.ts'];

// ---- 3. Validate marker files ----

let drift = false;
const errors = [];

// 3a. Cross-check MARKER_FILES against the registry table in AGENTS.md.
//     The table is the human-readable registry; the script array is the
//     machine-readable one. They MUST stay in sync.
const AGENTS_PATH = join(ROOT, '.agents', 'AGENTS.md');
if (existsSync(AGENTS_PATH)) {
  const agentsSrc = readFileSync(AGENTS_PATH, 'utf8');
  const registryHeader = '### Spec-Version Tracked Files Registry';
  const headerIdx = agentsSrc.indexOf(registryHeader);
  if (headerIdx === -1) {
    errors.push(
      `[REGISTRY-MISSING] .agents/AGENTS.md — section "${registryHeader}" not found; the registry table is required and must list every path present in MARKER_FILES`,
    );
    drift = true;
  } else {
    // Extract the table rows under the header (until the next blank line).
    const tableSection = agentsSrc
      .slice(headerIdx)
      .split(/\n\n/)[0];
    const tableRowRegex = /^\|\s*`([^`]+)`/gm;
    const registryPaths = [];
    let m;
    while ((m = tableRowRegex.exec(tableSection)) !== null) {
      registryPaths.push(m[1]);
    }
    const markerSet = new Set(MARKER_FILES);
    const registrySet = new Set(registryPaths);
    for (const p of MARKER_FILES) {
      if (!registrySet.has(p)) {
        errors.push(
          `[REGISTRY-DRIFT] ${p} — present in MARKER_FILES (script) but missing from the registry table in .agents/AGENTS.md`,
        );
        drift = true;
      }
    }
    for (const p of registryPaths) {
      if (!markerSet.has(p)) {
        errors.push(
          `[REGISTRY-DRIFT] ${p} — present in the AGENTS.md registry table but missing from MARKER_FILES in scripts/check-spec-version.mjs`,
        );
        drift = true;
      }
    }
  }
}

// 3b. Validate each marker file exists and carries the correct version.
for (const relPath of MARKER_FILES) {
  const absPath = join(ROOT, relPath);
  if (!existsSync(absPath)) {
    errors.push(`[MISSING] ${relPath} — listed in MARKER_FILES but does not exist`);
    drift = true;
    continue;
  }
  const content = readFileSync(absPath, 'utf8');
  const markerMatch = content.match(/@spec-version\s+(V_\d+-\d+-\d+)/);
  if (!markerMatch) {
    errors.push(
      `[NO-MARKER] ${relPath} — expected "<!-- @spec-version ${CURRENT_VERSION} -->" but marker not found`,
    );
    drift = true;
    continue;
  }
  const fileVersion = markerMatch[1];
  if (fileVersion !== CURRENT_VERSION) {
    errors.push(`[STALE] ${relPath} — marker says ${fileVersion}, expected ${CURRENT_VERSION}`);
    drift = true;
  }
}

// ---- 4. Validate code files: no hardcoded version literals outside allowlist ----

function walkDir(dir, exts) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git' || entry === 'dist' || entry === '.atl' || entry === '.claude')
      continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...walkDir(full, exts));
    } else if (exts.some((e) => entry.endsWith(e))) {
      out.push(full);
    }
  }
  return out;
}

const codeFiles = [...walkDir(join(ROOT, 'src'), ['.ts', '.vue'])];

// Match any V_0-x-y literal (the spec version lineage, currently V_0-1-x).
// Template versions are V_1-x-y and model defaults are V_0-1-0 as modelVersion
// default — those are NOT spec drift. We only flag the spec version lineage.
//
// The spec version currently follows V_0-1-x. When a major/minor bump moves
// the spec to e.g. V_1-0-x, update this regex accordingly.
const SPEC_VERSION_PATTERN = /V_0-\d+-\d+/g;

for (const absPath of codeFiles) {
  const relPath = relative(ROOT, absPath).replace(/\\/g, '/');
  if (CODE_ALLOWLIST.includes(relPath)) continue;
  const content = readFileSync(absPath, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trimStart();
    // Skip comment-only lines — those are documentation, not runtime.
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*'))
      continue;
    const matches = line.match(SPEC_VERSION_PATTERN);
    if (matches) {
      // V_0-1-0 is the default modelVersion, not spec drift. Skip it.
      if (matches[0] === 'V_0-1-0') continue;
      errors.push(
        `[HARDCODED] ${relPath}:${i + 1} — version literal "${matches[0]}" must be imported from constants.ts, not hardcoded`,
      );
      drift = true;
    }
  }
}

// ---- 5. Report ----

if (drift) {
  console.error(`\nSpec version drift detected. Current source of truth: ${CURRENT_VERSION}\n`);
  for (const e of errors) console.error(`  ${e}`);
  console.error(`\nFix: update DEFAULT_FORMAT_VERSION in src/utils/constants.ts and/or`);
  console.error(`update each stale file to match, then re-run this script.`);
  process.exit(1);
} else {
  console.log(`OK — all spec-version artifacts in sync with ${CURRENT_VERSION}`);
  process.exit(0);
}
