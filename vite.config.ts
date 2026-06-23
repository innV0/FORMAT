import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const serveDocs = () => ({
  name: 'serve-docs',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      const urlPath = decodeURIComponent((req.url || '').split('?')[0]);
      
      // Canonical redirect for /docs to /docs/ to prevent relative path breakage
      if (urlPath === '/docs') {
        res.writeHead(301, { Location: '/docs/' });
        res.end();
        return;
      }

      if (urlPath.startsWith('/docs/')) {
        const root = fileURLToPath(new URL('.', import.meta.url));
        let filePath = path.join(root, urlPath);
        
        // If it's a directory, serve index.html
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
  plugins: [vue(), serveDocs()],
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
