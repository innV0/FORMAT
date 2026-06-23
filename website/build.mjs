import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { marked } from 'marked';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dir, '..', 'docs');

// Parse frontmatter + body
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  match[1].split('\n').forEach(line => {
    const colon = line.indexOf(':');
    if (colon === -1) return;
    meta[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  });
  return { meta, body: match[2] };
}

// Split body into sections by horizontal rule
function buildSections(body) {
  return body
    .split(/\n---\n/)
    .map((raw, i) => {
      const cls = i === 0 ? 'hero' : `section section-${i}`;
      return `<section class="${cls}">\n${marked(raw.trim())}\n</section>`;
    })
    .join('\n');
}

const raw = readFileSync(join(__dir, 'content', 'landing.md'), 'utf8');
const { meta, body } = parseFrontmatter(raw);
const sections = buildSections(body);

let template = readFileSync(join(__dir, 'template.html'), 'utf8');
template = template
  .replace(/\{\{title\}\}/g, meta.title || '_FORMAT')
  .replace(/\{\{description\}\}/g, meta.description || '')
  .replace(/\{\{og_image\}\}/g, meta.og_image || '')
  .replace(/\{\{content\}\}/g, sections);

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'index.html'), template, 'utf8');

// Preserve CNAME for custom domain
const cname = join(__dir, 'CNAME');
if (existsSync(cname)) copyFileSync(cname, join(outDir, 'CNAME'));

console.log('✓ Built → docs/index.html');
