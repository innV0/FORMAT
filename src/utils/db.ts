const DB_NAME = 'FORMAT-db';
const STORE_NAME = 'directories';
const DB_VERSION = 1;

export interface SavedDirectory {
  name: string;
  handle: FileSystemDirectoryHandle;
  connectedAt: number;
}

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'name' });
      }
    };
  });
}

export async function saveDirectoryHandle(name: string, handle: FileSystemDirectoryHandle): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const data: SavedDirectory = {
      name,
      handle,
      connectedAt: Date.now()
    };
    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getSavedDirectories(): Promise<SavedDirectory[]> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        const list = request.result as SavedDirectory[];
        // Sort by connectedAt descending
        list.sort((a, b) => b.connectedAt - a.connectedAt);
        resolve(list);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Failed to get saved directories from IndexedDB', err);
    return [];
  }
}

export async function deleteDirectoryHandle(name: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(name);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
