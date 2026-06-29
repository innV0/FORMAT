import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const serveStatic = (prefix: string, dir: string) => ({
  name: `serve-${prefix.replace('/', '')}`,
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      const urlPath = decodeURIComponent((req.url || '').split('?')[0]);

      if (urlPath === prefix.replace(/\/$/, '')) {
        res.writeHead(301, { Location: prefix });
        res.end();
        return;
      }

      if (urlPath.startsWith(prefix)) {
        const root = fileURLToPath(new URL('.', import.meta.url));
        let filePath = path.join(root, dir, urlPath.replace(prefix, ''));

        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }

        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath);
          const contentTypes: Record<string, string> = {
            '.html': 'text/html; charset=utf-8',
            '.js': 'application/javascript; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.md': 'text/markdown; charset=utf-8',
            '.json': 'application/json; charset=utf-8',
            '.svg': 'image/svg+xml',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
          };
          res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain; charset=utf-8' });
          res.end(fs.readFileSync(filePath));
          return;
        }
      }
      next();
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  base: '/app/',
  plugins: [vue(), serveStatic('/documentation/', 'docs/documentation'), serveStatic('/site/', 'docs')],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    globals: true,
    environment: 'node'
  }
});
