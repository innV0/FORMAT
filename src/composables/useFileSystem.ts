import { ref } from 'vue';
import { FileItem } from '../types';

export function useFileSystem() {
  const dirHandle = ref<FileSystemDirectoryHandle | null>(null);
  const fileList = ref<FileItem[]>([]);

  const scanDirectory = async (handle: FileSystemDirectoryHandle): Promise<FileItem[]> => {
    const items: FileItem[] = [];
    // Cast to any to access the values iterator safely in older/standard tsconfigs
    for await (const entry of (handle as any).values()) {
      if (entry.kind === 'file' && entry.name.endsWith('.md')) {
        items.push({
          name: entry.name,
          handle: entry as FileSystemFileHandle
        });
      }
    }
    // Sort alphabetically
    return items.sort((a, b) => a.name.localeCompare(b.name));
  };

  const connectDirectory = async (): Promise<FileSystemDirectoryHandle | null> => {
    try {
      const handle = await (window as any).showDirectoryPicker();
      dirHandle.value = handle;
      fileList.value = await scanDirectory(handle);
      return handle;
    } catch (err) {
      console.error('Directory connect aborted or failed:', err);
      return null;
    }
  };

  const readFileContent = async (fileHandle: FileSystemFileHandle): Promise<string> => {
    const file = await fileHandle.getFile();
    return await file.text();
  };

  const saveFileContent = async (
    directory: FileSystemDirectoryHandle,
    fileName: string,
    content: string
  ): Promise<boolean> => {
    try {
      // 1. Get or create the active file
      const fileHandle = await directory.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();

      // 2. Try creating backup
      try {
        const backupsDir = await directory.getDirectoryHandle('backups', { create: true });
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupName = fileName.replace('.md', '') + '_' + timestamp + '.md';
        const backupFileHandle = await backupsDir.getFileHandle(backupName, { create: true });
        const backupWritable = await backupFileHandle.createWritable();
        await backupWritable.write(content);
        await backupWritable.close();
      } catch (backupErr) {
        console.warn('Backup could not be written:', backupErr);
      }

      return true;
    } catch (err) {
      console.error('Failed to save file:', err);
      return false;
    }
  };

  const createNewFile = async (
    directory: FileSystemDirectoryHandle,
    fileName: string,
    initialContent: string
  ): Promise<FileSystemFileHandle | null> => {
    try {
      const fileHandle = await directory.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(initialContent);
      await writable.close();
      return fileHandle;
    } catch (err) {
      console.error('Failed to create new file:', err);
      return null;
    }
  };

  return {
    dirHandle,
    fileList,
    connectDirectory,
    scanDirectory,
    readFileContent,
    saveFileContent,
    createNewFile
  };
}
