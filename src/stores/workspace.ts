import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { FileItem } from '../types';
import { useFileSystem } from '../composables/useFileSystem';
import { saveDirectoryHandle, getSavedDirectories, deleteDirectoryHandle, SavedDirectory } from '../utils/db';

export const useWorkspaceStore = defineStore('workspace', () => {
  const fs = useFileSystem();
  
  const dirHandle = ref<FileSystemDirectoryHandle | null>(null);
  const mdFiles = ref<FileItem[]>([]);
  const activeFileName = ref<string>('');
  const activeFileHandle = ref<FileSystemFileHandle | null>(null);
  const newFileName = ref<string>('');
  const showConnectModal = ref<boolean>(false);

  // Persistence and history state
  const savedDirectories = ref<SavedDirectory[]>([]);
  const needsPermission = ref<boolean>(false);
  const isPendingPermission = ref<boolean>(false);

  // When enabled, every save also writes a timestamped copy into backups/.
  // Guarded for non-browser environments (e.g. the test runner) where
  // localStorage is not defined.
  const hasLocalStorage = typeof localStorage !== 'undefined';
  const autoBackup = ref<boolean>(
    hasLocalStorage && localStorage.getItem('format.autoBackup') === 'true'
  );
  const setAutoBackup = (value: boolean) => {
    autoBackup.value = value;
    if (hasLocalStorage) {
      localStorage.setItem('format.autoBackup', String(value));
    }
  };

  const isDemoMode = computed(() => !dirHandle.value || needsPermission.value);

  const imageCache = ref<Record<string, string>>({});

  const openConnectDialog = () => {
    showConnectModal.value = true;
  };

  const loadSavedDirectoriesList = async () => {
    savedDirectories.value = await getSavedDirectories();
  };

  const verifyPermission = async (handle: any, readWrite: boolean) => {
    const options: any = {};
    if (readWrite) {
      options.mode = 'readwrite';
    }
    try {
      if ((await handle.queryPermission(options)) === 'granted') {
        return true;
      }
      if ((await handle.requestPermission(options)) === 'granted') {
        return true;
      }
    } catch (e) {
      console.error('Permission request failed:', e);
    }
    return false;
  };

  const setupConnectedDirectory = async (handle: FileSystemDirectoryHandle) => {
    dirHandle.value = handle;
    needsPermission.value = false;
    mdFiles.value = await fs.scanDirectory(handle);
    imageCache.value = {};

    // Auto-load if there is exactly one markdown file
    if (mdFiles.value.length === 1) {
      const file = mdFiles.value[0];
      try {
        const content = await fs.readFileContent(file.handle);
        activeFileName.value = file.name;
        activeFileHandle.value = file.handle;
        
        // Import document store dynamically to avoid circular dependency at load time
        const { useDocumentStore } = await import('./document');
        const documentStore = useDocumentStore();
        documentStore.loadDocument(content);
      } catch (err) {
        console.error('Error auto-opening single file:', err);
      }
    }
  };

  const connectFolder = async () => {
    showConnectModal.value = false;
    const handle = await fs.connectDirectory();
    if (handle) {
      await saveDirectoryHandle(handle.name, handle);
      await loadSavedDirectoriesList();
      await setupConnectedDirectory(handle);
    }
  };

  const connectSavedDirectory = async (savedDir: SavedDirectory) => {
    isPendingPermission.value = true;
    try {
      const hasPermission = await verifyPermission(savedDir.handle, true);
      if (hasPermission) {
        await saveDirectoryHandle(savedDir.name, savedDir.handle);
        await loadSavedDirectoriesList();
        await setupConnectedDirectory(savedDir.handle);
      } else {
        needsPermission.value = true;
        dirHandle.value = savedDir.handle;
      }
    } catch (err) {
      console.error('Error connecting to saved directory:', err);
      needsPermission.value = true;
      dirHandle.value = savedDir.handle;
    } finally {
      isPendingPermission.value = false;
    }
  };

  const deleteSavedDirectory = async (name: string) => {
    await deleteDirectoryHandle(name);
    await loadSavedDirectoriesList();
    // If the active directory is deleted, clear it to avoid stale state
    if (dirHandle.value && dirHandle.value.name === name) {
      dirHandle.value = null;
      mdFiles.value = [];
      activeFileName.value = '';
      activeFileHandle.value = null;
    }
  };

  const loadLastDirectory = async () => {
    await loadSavedDirectoriesList();
    if (savedDirectories.value.length > 0) {
      const lastDir = savedDirectories.value[0];
      try {
        const status = await (lastDir.handle as any).queryPermission({ mode: 'readwrite' });
        if (status === 'granted') {
          await setupConnectedDirectory(lastDir.handle);
        } else {
          dirHandle.value = lastDir.handle;
          needsPermission.value = true;
        }
      } catch (err) {
        console.error('Error auto-loading last directory:', err);
        dirHandle.value = lastDir.handle;
        needsPermission.value = true;
      }
    }
  };

  // Point the workspace at a (just-written) file, rescanning the directory so
  // the new versioned file shows up in the list and becomes the active handle.
  const switchActiveFile = async (fileName: string) => {
    activeFileName.value = fileName;
    await refreshFiles();
    activeFileHandle.value = mdFiles.value.find(f => f.name === fileName)?.handle || null;
  };

  const refreshFiles = async () => {
    if (dirHandle.value && !needsPermission.value) {
      try {
        mdFiles.value = await fs.scanDirectory(dirHandle.value);
      } catch (err) {
        console.warn('Failed to scan files (need permission?):', err);
      }
    }
  };

  const setDemoFilesList = (files: FileItem[]) => {
    mdFiles.value = files;
  };

  const loadImage = async (path: string) => {
    if (imageCache.value[path] || !dirHandle.value || needsPermission.value) return;
    const parts = path.split('/');
    if (parts.length < 2 || parts[0] !== 'assets') return;
    try {
      const assetsDir = await dirHandle.value.getDirectoryHandle('assets');
      const fileName = parts.slice(1).join('/');
      const fileHandle = await assetsDir.getFileHandle(fileName);
      const file = await fileHandle.getFile();
      imageCache.value[path] = URL.createObjectURL(file);
    } catch (err) {
      console.warn(`Could not load image ${path} from assets folder:`, err);
    }
  };

  const saveImageToAssets = async (file: File): Promise<string | null> => {
    if (!dirHandle.value || needsPermission.value) {
      const url = URL.createObjectURL(file);
      const mockPath = `assets/${file.name}`;
      imageCache.value[mockPath] = url;
      return mockPath;
    }
    try {
      const assetsDir = await dirHandle.value.getDirectoryHandle('assets', { create: true });
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileHandle = await assetsDir.getFileHandle(safeName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(file);
      await writable.close();
      
      const path = `assets/${safeName}`;
      const fileObj = await fileHandle.getFile();
      imageCache.value[path] = URL.createObjectURL(fileObj);
      return path;
    } catch (err) {
      console.error('Error saving image to assets:', err);
      return null;
    }
  };

  const readWorkspaceFile = async (relativePath: string): Promise<string> => {
    if (!dirHandle.value || needsPermission.value) throw new Error("No folder connected or access denied");
    const cleanPath = relativePath.replace(/\\/g, '/');
    const parts = cleanPath.split('/').filter(p => p && p !== '.' && p !== '..');
    let currentDir = dirHandle.value;
    for (let i = 0; i < parts.length - 1; i++) {
      currentDir = await currentDir.getDirectoryHandle(parts[i]);
    }
    const fileHandle = await currentDir.getFileHandle(parts[parts.length - 1]);
    const file = await fileHandle.getFile();
    return await file.text();
  };

  return {
    dirHandle,
    mdFiles,
    activeFileName,
    activeFileHandle,
    newFileName,
    isDemoMode,
    showConnectModal,
    imageCache,
    savedDirectories,
    needsPermission,
    isPendingPermission,
    autoBackup,
    setAutoBackup,
    switchActiveFile,
    openConnectDialog,
    connectFolder,
    connectSavedDirectory,
    deleteSavedDirectory,
    loadLastDirectory,
    refreshFiles,
    setDemoFilesList,
    loadImage,
    saveImageToAssets,
    readWorkspaceFile,
    fs
  };
});


