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

            await indexedDBStorage.saveUserData(userData.user.username, basicUserData);
            
            // Save individual entries for better performance
            const moodEntries = userData.moodEntries || [];
            const journalEntries = userData.journalEntries || [];
            
            for (const entry of moodEntries) {
                // Encrypt sensitive mood data
                if (entry.notes) {
                    entry.notes = this.encrypt(entry.notes, pin);
                }
                await indexedDBStorage.saveMoodEntry(userData.user.username, entry);
            }
            
            for (const entry of journalEntries) {
                // Encrypt journal content
                if (entry.content) {
                    entry.content = this.encrypt(entry.content, pin);
                }
                if (entry.title && entry.isPrivate) {
                    entry.title = this.encrypt(entry.title, pin);
                }
                await indexedDBStorage.saveJournalEntry(userData.user.username, entry);
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
                if (entry.notes && typeof entry.notes === 'string' && entry.notes.includes('U2FsdGVk')) {
                    try {
                        entry.notes = this.decrypt(entry.notes, pin);
                    } catch (e) {
                        console.warn('Could not decrypt mood notes');
                    }
                }
                return entry;
            });

            // Decrypt journal entries
            const decryptedJournalEntries = journalEntries.map(entry => {
                if (entry.content && typeof entry.content === 'string' && entry.content.includes('U2FsdGVk')) {
                    try {
                        entry.content = this.decrypt(entry.content, pin);
                    } catch (e) {
                        console.warn('Could not decrypt journal content');
                    }
                }
                
                if (entry.title && entry.isPrivate && typeof entry.title === 'string' && entry.title.includes('U2FsdGVk')) {
                    try {
                        entry.title = this.decrypt(entry.title, pin);
                    } catch (e) {
                        console.warn('Could not decrypt journal title');
                    }
                }
                return entry;
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
            
            // Fall back to localStorage for backward compatibility
            const legacyProfile = localStorage.getItem('mood_tracker_user');
            if (legacyProfile) {
                try {
                    const parsed = JSON.parse(legacyProfile);
                    // Migrate this profile to IndexedDB
                    await this.saveUserProfile(parsed.username);
                    return parsed.username;
                } catch (e) {
                    console.error('Error parsing legacy profile', e);
                    return legacyProfile; // Try to use the raw value if parsing fails
                }
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
                id: 'current_session',
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
            
            const session = await indexedDBStorage.getSession('current_session');
            if (!session) return null;

            const now = Date.now();
            if (now - session.timestamp > this.SESSION_TIMEOUT) {
                await indexedDBStorage.deleteEntry('sessions', 'current_session');
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
            await indexedDBStorage.deleteEntry('sessions', 'current_session');
        } catch (error) {
            console.error('Error clearing session:', error);
        }
    }

    static async clearAllData(): Promise<void> {
        try {
            await indexedDBStorage.init();
            await indexedDBStorage.clearAllData();
            
            // Also clear localStorage for complete cleanup
            localStorage.removeItem('mood_tracker_data');
            localStorage.removeItem('mood_tracker_user');
            localStorage.removeItem('mood_tracker_session_pin');
            localStorage.removeItem('mood_tracker_session_timestamp');
        } catch (error) {
            console.error('Error clearing all data:', error);
        }
    }

    static async getStorageInfo(): Promise<{ 
        usage: number; 
        quota: number; 
        usagePercentage: number;
        formattedUsage: string;
        formattedQuota: string;
    }> {
        try {
            await indexedDBStorage.init();
            const stats = await indexedDBStorage.getStorageStats();
            
            const usagePercentage = stats.quota > 0 ? (stats.estimatedUsage / stats.quota) * 100 : 0;
            
            return {
                usage: stats.estimatedUsage,
                quota: stats.quota,
                usagePercentage,
                formattedUsage: this.formatBytes(stats.estimatedUsage),
                formattedQuota: this.formatBytes(stats.quota)
            };
        } catch (error) {
            console.error('Error getting storage info:', error);
            return {
                usage: 0,
                quota: 0,
                usagePercentage: 0,
                formattedUsage: '0 B',
                formattedQuota: '0 B'
            };
        }
    }

    private static formatBytes(bytes: number): string {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Migration method to move data from localStorage to IndexedDB
    static async migrateFromLocalStorage(): Promise<boolean> {
        try {
            const legacyData = localStorage.getItem('mood_tracker_data');
            const legacyUser = localStorage.getItem('mood_tracker_user');
            
            if (!legacyData || !legacyUser) return false;
            
            // Try to parse the data - it might be encrypted
            let userData;
            let userProfile;
            
            try {
                userData = JSON.parse(legacyData);
                
                // If it's an encrypted object, we need the session pin
                if (userData.encrypted && userData.iv) {
                    const sessionPin = localStorage.getItem('mood_tracker_session_pin');
                    if (sessionPin) {
                        // Try to decrypt the data with the session pin
                        const { encrypted, iv } = userData;
                        const decrypted = EncryptionService.decrypt({ encrypted, iv }, sessionPin);
                        if (decrypted) {
                            userData = JSON.parse(decrypted);
                        } else {
                            console.error('Could not decrypt localStorage data during migration');
                            return false;
                        }
                    } else {
                        console.error('No session pin found for encrypted data');
                        return false;
                    }
                }
            } catch (e) {
                console.error('Error parsing legacy data:', e);
                return false;
            }
            
            try {
                userProfile = JSON.parse(legacyUser);
            } catch (e) {
                // If parsing fails, try using it as a string
                userProfile = { username: legacyUser };
            }
            
            // Save user profile to IndexedDB
            await this.saveUserProfile(userProfile.username);
            
            // For migration, we'll use the session pin if it exists
            const sessionPin = localStorage.getItem('mood_tracker_session_pin');
            if (!sessionPin) {
                console.error('No session pin found for migration');
                return false;
            }
            
            // Save user data with proper encryption
            await this.saveUserData(userData, sessionPin);
            
            // Save the session
            await this.saveSession(sessionPin);
            
            console.log('Successfully migrated data from localStorage to IndexedDB');
            return true;
        } catch (error) {
            console.error('Error migrating from localStorage:', error);
            return false;
        }
    }
}

export default SecureIndexedDBStorage;
