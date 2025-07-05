import CryptoJS from 'crypto-js';
import indexedDBStorage from './indexeddb';
import { EncryptionService } from './encryption';

export class SecureIndexedDBStorage {
    private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    private static encrypt(data: any, key: string): string {
        return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    }

    private static decrypt(encryptedData: string, key: string): any {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, key);
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptedData);
        } catch (error) {
            throw new Error('Failed to decrypt data');
        }
    }

    private static isEncrypted(data: string): boolean {
        // Check if the string looks like encrypted data (base64 with specific patterns)
        // AES encrypted data typically starts with "U2FsdGVk" (base64 for "Salted")
        return data.includes('U2FsdGVk') ||
            (data.length > 20 && /^[A-Za-z0-9+/]+=*$/.test(data) && data.length % 4 === 0);
    }

    static async saveUserData(userData: any, pin: string): Promise<boolean> {
        try {
            await indexedDBStorage.init();

            // Save basic user data with encryption for sensitive information
            const basicUserData = {
                user: userData.user,
                moodEntries: [], // We'll store these separately
                journalEntries: [], // We'll store these separately
                settings: userData.settings || {
                    notifications: true,
                    backupEnabled: true,
                    islamicFeatures: true
                },
                lastUpdated: new Date().toISOString(),
                // Add encryption verification field to validate pin later
                pinVerification: this.encrypt('verified', pin)
            };

            await indexedDBStorage.saveUserData(userData?.user?.username || "username", basicUserData);

            // Save individual entries for better performance
            const moodEntries = userData.moodEntries || [];
            const journalEntries = userData.journalEntries || [];

            for (const entry of moodEntries) {
                // Encrypt sensitive mood data
                const encryptedEntry = { ...entry };
                if (entry.notes) {
                    encryptedEntry.notes = this.encrypt(entry.notes, pin);
                }
                await indexedDBStorage.saveMoodEntry(userData.user.username, encryptedEntry);
            }

            for (const entry of journalEntries) {
                // Encrypt journal content
                const encryptedEntry = { ...entry };
                if (entry.content) {
                    encryptedEntry.content = this.encrypt(entry.content, pin);
                }
                if (entry.title && entry.isPrivate) {
                    encryptedEntry.title = this.encrypt(entry.title, pin);
                }
                await indexedDBStorage.saveJournalEntry(userData.user.username, encryptedEntry);
            }

            return true;
        } catch (error) {
            console.error('Error saving user data:', error);
            return false;
        }
    }

    static async loadUserData(pin: string, username: string): Promise<any | null> {
        try {
            await indexedDBStorage.init();

            const userData = await indexedDBStorage.getUserData(username);
            if (!userData) return null;

            // Verify PIN using the verification field
            if (userData.pinVerification) {
                try {
                    const verified = this.decrypt(userData.pinVerification, pin);
                    if (verified !== 'verified') {
                        console.log('PIN verification failed');
                        return null; // PIN is incorrect
                    }
                } catch (error) {
                    console.log('PIN decryption failed');
                    return null; // Could not decrypt with provided PIN
                }
            }

            // Get individual entries
            const [moodEntries, journalEntries] = await Promise.all([
                indexedDBStorage.getMoodEntries(username),
                indexedDBStorage.getJournalEntries(username)
            ]);

            // Decrypt mood entries
            const decryptedMoodEntries = moodEntries.map(entry => {
                const decryptedEntry = { ...entry };
                if (entry.notes && typeof entry.notes === 'string' && this.isEncrypted(entry.notes)) {
                    try {
                        decryptedEntry.notes = this.decrypt(entry.notes, pin);
                    } catch (e) {
                        console.warn('Could not decrypt mood notes, keeping original');
                        // Keep the original encrypted text to prevent data loss
                        decryptedEntry.notes = '[Encrypted - Please re-enter PIN]';
                    }
                }
                return decryptedEntry;
            });

            // Decrypt journal entries
            const decryptedJournalEntries = journalEntries.map(entry => {
                const decryptedEntry = { ...entry };
                if (entry.content && typeof entry.content === 'string' && this.isEncrypted(entry.content)) {
                    try {
                        decryptedEntry.content = this.decrypt(entry.content, pin);
                    } catch (e) {
                        console.warn('Could not decrypt journal content, keeping original');
                        decryptedEntry.content = '[Encrypted content - Please re-enter PIN to view]';
                    }
                }

                if (entry.title && entry.isPrivate && typeof entry.title === 'string' && this.isEncrypted(entry.title)) {
                    try {
                        decryptedEntry.title = this.decrypt(entry.title, pin);
                    } catch (e) {
                        console.warn('Could not decrypt journal title, keeping original');
                        decryptedEntry.title = '[Encrypted title]';
                    }
                }
                return decryptedEntry;
            });

            return {
                user: userData.user,
                moodEntries: decryptedMoodEntries || [],
                journalEntries: decryptedJournalEntries || [],
                settings: userData.settings || {
                    notifications: true,
                    backupEnabled: true,
                    islamicFeatures: true
                }
            };
        } catch (error) {
            console.error('Error loading user data:', error);
            return null;
        }
    }

    static async saveUserProfile(username: string): Promise<void> {
        try {
            await indexedDBStorage.init();
            await indexedDBStorage.saveUserProfile({
                id: username,
                username,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error saving user profile:', error);
        }
    }

    static async getUserProfile(): Promise<string | null> {
        try {
            await indexedDBStorage.init();

            // First try to get the profiles from IndexedDB
            const userProfiles = await indexedDBStorage.getAllUserProfiles();
            if (userProfiles && userProfiles.length > 0) {
                // Return the most recently created profile
                const sortedProfiles = userProfiles.sort((a: any, b: any) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                return sortedProfiles[0].username;
            }

            return null;
        } catch (error) {
            console.error('Error getting user profile:', error);
            return null;
        }
    }

    static async saveSession(pin: string): Promise<void> {
        try {
            await indexedDBStorage.init();

            const sessionData = {
                id: 'current',
                pin: this.encrypt(pin, 'session_key'),
                timestamp: Date.now()
            };

            await indexedDBStorage.saveSession(sessionData);
        } catch (error) {
            console.error('Error saving session:', error);
        }
    }

    static async getValidSession(): Promise<string | null> {
        try {
            await indexedDBStorage.init();

            const session = await indexedDBStorage.getSession('current');
            if (!session) return null;

            if (Date.now() - session.timestamp > this.SESSION_TIMEOUT) {
                return null;
            }

            return this.decrypt(session.pin, 'session_key');
        } catch (error) {
            console.error('Error getting session:', error);
            return null;
        }
    }

    static async clearSession(): Promise<void> {
        try {
            await indexedDBStorage.init();
            await indexedDBStorage.deleteEntry('sessions', 'current');
        } catch (error) {
            console.error('Error clearing session:', error);
        }
    }

    static async clearAllData(): Promise<void> {
        try {
            await indexedDBStorage.init();
            await indexedDBStorage.clearAllData();
        } catch (error) {
            console.error('Error clearing all data:', error);
        }
    }

    // Delete specific entries
    static async deleteMoodEntry(username: string, entryId: string): Promise<boolean> {
        try {
            await indexedDBStorage.init();
            await indexedDBStorage.deleteEntry('moodEntries', entryId);
            return true;
        } catch (error) {
            console.error('Error deleting mood entry:', error);
            return false;
        }
    }

    static async deleteJournalEntry(username: string, entryId: string): Promise<boolean> {
        try {
            await indexedDBStorage.init();
            await indexedDBStorage.deleteEntry('journalEntries', entryId);
            return true;
        } catch (error) {
            console.error('Error deleting journal entry:', error);
            return false;
        }
    }
    static async getStorageInfo() {
        if (navigator.storage && navigator.storage.estimate) {
            const { usage = 0, quota = 0 } = await navigator.storage.estimate();
            const usagePercentage = quota ? (usage / quota) * 100 : 0;
            return {
                usage,
                quota,
                usagePercentage,
                formattedUsage: SecureIndexedDBStorage.formatBytes(usage),
                formattedQuota: SecureIndexedDBStorage.formatBytes(quota),
            };
        }
        // Fallback if estimate is not available
        return {
            usage: 0,
            quota: 0,
            usagePercentage: 0,
            formattedUsage: '0 B',
            formattedQuota: '0 B',
        };
    }

    static formatBytes(bytes: number) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
