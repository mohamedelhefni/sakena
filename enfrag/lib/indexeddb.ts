/**
 * IndexedDB utility for storing mood tracking and journal data
 * Replaces localStorage to overcome storage limitations
 */

export interface DBSchema {
  userData: {
    user: any;
    moodEntries: any[];
    journalEntries: any[];
    settings: any;
    lastUpdated?: string;
    pinVerification?: string;
  };
  userProfiles: {
    id: string;
    username: string;
    createdAt: string;
  };
  sessions: {
    id: string;
    pin: string;
    timestamp: number;
  };
}

class IndexedDBStorage {
  private dbName = 'MoodTrackerDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('userData')) {
          db.createObjectStore('userData', { keyPath: 'username' });
        }

        if (!db.objectStoreNames.contains('userProfiles')) {
          db.createObjectStore('userProfiles', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('moodEntries')) {
          const moodStore = db.createObjectStore('moodEntries', { keyPath: 'id' });
          moodStore.createIndex('username', 'username', { unique: false });
          moodStore.createIndex('date', 'date', { unique: false });
        }

        if (!db.objectStoreNames.contains('journalEntries')) {
          const journalStore = db.createObjectStore('journalEntries', { keyPath: 'id' });
          journalStore.createIndex('username', 'username', { unique: false });
          journalStore.createIndex('date', 'date', { unique: false });
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }

  async saveUserData(username: string, userData: DBSchema['userData']): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['userData'], 'readwrite');
    const store = transaction.objectStore('userData');
    
    const dataToStore = {
      username,
      ...userData,
      lastUpdated: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const request = store.put(dataToStore);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save user data'));
    });
  }

  async getUserData(username: string): Promise<DBSchema['userData'] | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['userData'], 'readonly');
    const store = transaction.objectStore('userData');

    return new Promise((resolve, reject) => {
      const request = store.get(username);
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          const { username: _, lastUpdated, ...userData } = result;
          resolve(userData);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(new Error('Failed to get user data'));
    });
  }

  async saveMoodEntry(username: string, moodEntry: any): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['moodEntries'], 'readwrite');
    const store = transaction.objectStore('moodEntries');
    
    const entryToStore = {
      ...moodEntry,
      username,
      createdAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const request = store.put(entryToStore);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save mood entry'));
    });
  }

  async getMoodEntries(username: string): Promise<any[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['moodEntries'], 'readonly');
    const store = transaction.objectStore('moodEntries');
    const index = store.index('username');

    return new Promise((resolve, reject) => {
      const request = index.getAll(username);
      request.onsuccess = () => {
        const entries = request.result.map(entry => {
          const { username: _, createdAt, ...moodEntry } = entry;
          return moodEntry;
        });
        resolve(entries);
      };
      request.onerror = () => reject(new Error('Failed to get mood entries'));
    });
  }

  async saveJournalEntry(username: string, journalEntry: any): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['journalEntries'], 'readwrite');
    const store = transaction.objectStore('journalEntries');
    
    const entryToStore = {
      ...journalEntry,
      username,
      createdAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const request = store.put(entryToStore);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save journal entry'));
    });
  }

  async getJournalEntries(username: string): Promise<any[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['journalEntries'], 'readonly');
    const store = transaction.objectStore('journalEntries');
    const index = store.index('username');

    return new Promise((resolve, reject) => {
      const request = index.getAll(username);
      request.onsuccess = () => {
        const entries = request.result.map(entry => {
          const { username: _, createdAt, ...journalEntry } = entry;
          return journalEntry;
        });
        resolve(entries);
      };
      request.onerror = () => reject(new Error('Failed to get journal entries'));
    });
  }

  async deleteEntry(storeName: string, id: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to delete entry from ${storeName}`));
    });
  }

  async saveUserProfile(profile: DBSchema['userProfiles']): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['userProfiles'], 'readwrite');
    const store = transaction.objectStore('userProfiles');

    return new Promise((resolve, reject) => {
      const request = store.put(profile);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save user profile'));
    });
  }

  async getUserProfile(username: string): Promise<DBSchema['userProfiles'] | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['userProfiles'], 'readonly');
    const store = transaction.objectStore('userProfiles');

    return new Promise((resolve, reject) => {
      const request = store.get(username);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(new Error('Failed to get user profile'));
    });
  }

  async getAllUserProfiles(): Promise<DBSchema['userProfiles'][]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['userProfiles'], 'readonly');
    const store = transaction.objectStore('userProfiles');

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(new Error('Failed to get user profiles'));
    });
  }

  async saveSession(session: DBSchema['sessions']): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['sessions'], 'readwrite');
    const store = transaction.objectStore('sessions');

    return new Promise((resolve, reject) => {
      const request = store.put(session);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save session'));
    });
  }

  async getSession(sessionId: string): Promise<DBSchema['sessions'] | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['sessions'], 'readonly');
    const store = transaction.objectStore('sessions');

    return new Promise((resolve, reject) => {
      const request = store.get(sessionId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(new Error('Failed to get session'));
    });
  }

  async clearAllData(): Promise<void> {
    const db = await this.ensureDB();
    const storeNames = ['userData', 'userProfiles', 'sessions', 'moodEntries', 'journalEntries'];
    
    for (const storeName of storeNames) {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error(`Failed to clear ${storeName}`));
      });
    }
  }

  async getStorageStats(): Promise<{ estimatedUsage: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        estimatedUsage: estimate.usage || 0,
        quota: estimate.quota || 0
      };
    }
    return { estimatedUsage: 0, quota: 0 };
  }
}

// Singleton instance
const indexedDBStorage = new IndexedDBStorage();

export default indexedDBStorage;
