/**
 * Converts a string to a clean, URL-safe slug / identifier.
 * Useful for DOM IDs, key generation, and routing.
 */
export const slugify = (s: string): string => {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Sanitizes a concept or node name to make it a safe identifier
 * containing only alphanumeric characters and underscores.
 */
export const sanitizeId = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9]/g, '_');
};

/**
 * Strips markdown formatting (bold, italic, wiki-links) from a string.
 * Single source for all formatting-stripping operations.
 */
export const stripMarkdownFormatting = (s: string): string => {
  return s.replace(/\*\*|\*|__|\[\[|\]\]/g, '').trim();
};

/**
 * Sanitizes a dashboard renderer HTML fragment by removing prohibited tags
 * and attributes (skill §5.6). This is a defense-in-depth layer that runs
 * BEFORE Mustache rendering, in addition to the renderer validator and the
 * sandboxed iframe at runtime.
 *
 * Removes: <script>, <iframe>, <object>, <embed>, <link>, <meta>,
 *          all on* attributes, and javascript: URIs.
 */
export function sanitizeDashboardHtml(html: string): string {
  let result = html;

  result = result.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '');
  result = result.replace(/<script\b[^>]*\/>/gi, '');
  result = result.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe\s*>/gi, '');
  result = result.replace(/<object\b[^>]*>[\s\S]*?<\/object\s*>/gi, '');
  result = result.replace(/<embed\b[^>]*>/gi, '');
  result = result.replace(/<link\b[^>]*>/gi, '');
  result = result.replace(/<meta\b[^>]*>/gi, '');

  result = result.replace(/\son\w+\s*=\s*"[^"]*"/gi, '');
  result = result.replace(/\son\w+\s*=\s*'[^']*'/gi, '');
  result = result.replace(/\son\w+\s*=\s*[^\s>]+/gi, '');

  result = result.replace(/(href|src)\s*=\s*"\s*javascript:[^"]*"/gi, '$1="#"');
  result = result.replace(/(href|src)\s*=\s*'\s*javascript:[^']*'/gi, '$1="#"');
  result = result.replace(/(href|src)\s*=\s*javascript:[^\s>]*/gi, '$1="#"');

  return result;
}
