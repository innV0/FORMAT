import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './assets/index.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');

// Dev-only affordance: load a model from a served path without the native
// directory picker, so the app can be driven/validated in a headless preview.
if (import.meta.env.DEV) {
  (window as any).__devLoadModel = async (path: string, fileName = 'model.md') => {
    const res = await fetch(path);
    const content = await res.text();
    const [{ useWorkspaceStore }, { useDocumentStore }] = await Promise.all([
      import('./stores/workspace'),
      import('./stores/document')
    ]);
    const ws = useWorkspaceStore();
    const doc = useDocumentStore();
    ws.activeFileName = fileName;
    doc.loadDocument(content);
    return { ok: true, length: content.length };
  };
}
