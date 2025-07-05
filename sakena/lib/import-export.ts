import { EncryptionService } from './encryption';
import { SecureIndexedDBStorage } from './secure-indexeddb';
import { UserData } from './types';

export interface ExportData {
    version: string;
    timestamp: string;
    appName: string;
    encrypted: boolean;
    data: string; // encrypted or plain JSON
}

export class ImportExportService {
    private static readonly EXPORT_VERSION = '1.0.0';
    private static readonly APP_NAME = 'Sakinah Mood Tracker';

    /**
     * Export user data with optional encryption
     */
    static async exportData(username: string, password: string, encrypt: boolean = true): Promise<string> {
        try {
            // Load user data from storage
            const userData = await SecureIndexedDBStorage.loadUserData(password, username);
            if (!userData) {
                throw new Error('Unable to load user data. Check your password.');
            }

            // Prepare export data
            const exportPayload: ExportData = {
                version: this.EXPORT_VERSION,
                timestamp: new Date().toISOString(),
                appName: this.APP_NAME,
                encrypted: encrypt,
                data: encrypt ? 
                    EncryptionService.encryptString(JSON.stringify(userData), password) :
                    JSON.stringify(userData)
            };

            return JSON.stringify(exportPayload, null, 2);
        } catch (error) {
            console.error('Export failed:', error);
            throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Import user data from exported file
     */
    static async importData(
        importContent: string, 
        importPassword: string, 
        username: string,
        currentAuthPassword: string,
        overwrite: boolean = false
    ): Promise<boolean> {
        try {
            // Parse the import file
            const exportData: ExportData = JSON.parse(importContent);

            // Validate export format
            if (!exportData.version || !exportData.appName || exportData.data === undefined) {
                throw new Error('Invalid export file format');
            }

            if (exportData.appName !== this.APP_NAME) {
                throw new Error('This export file is not from Sakinah Mood Tracker');
            }

            // Decrypt data if necessary
            let userData: UserData;
            if (exportData.encrypted) {
                const decrypted = EncryptionService.decryptString(exportData.data, importPassword);
                
                if (!decrypted) {
                    throw new Error('Failed to decrypt import data. Check your password.');
                }
                
                userData = JSON.parse(decrypted);
            } else {
                userData = JSON.parse(exportData.data);
            }

            // Validate user data structure
            if (!userData.user || !userData.moodEntries || !userData.journalEntries) {
                throw new Error('Invalid user data structure in import file');
            }

            // Check if user already exists
            const existingProfile = await SecureIndexedDBStorage.getUserProfile();
            if (existingProfile && !overwrite) {
                throw new Error('User already exists. Enable overwrite to replace existing data.');
            }

            // Update username in imported data
            userData.user.username = username;

            // Save imported data using current authentication password
            // This ensures the data is encrypted with the current password for future access
            const success = await SecureIndexedDBStorage.saveUserData(userData, currentAuthPassword);
            if (!success) {
                throw new Error('Failed to save imported data');
            }

            // Save user profile
            await SecureIndexedDBStorage.saveUserProfile(username);

            return true;
        } catch (error) {
            console.error('Import failed:', error);
            throw new Error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Generate a filename for export
     */
    static generateExportFilename(username: string, encrypted: boolean = true): string {
        const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const suffix = encrypted ? 'encrypted' : 'plain';
        return `sakinah-backup-${username}-${timestamp}-${suffix}.json`;
    }

    /**
     * Download export data as file
     */
    static downloadExport(content: string, filename: string): void {
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    /**
     * Read file content from File input
     */
    static readFileContent(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    resolve(e.target.result as string);
                } else {
                    reject(new Error('Failed to read file'));
                }
            };
            reader.onerror = () => reject(new Error('File reading error'));
            reader.readAsText(file);
        });
    }

    /**
     * Validate import file
     */
    static validateImportFile(content: string): { valid: boolean; error?: string; info?: any } {
        try {
            const exportData: ExportData = JSON.parse(content);
            
            if (!exportData.version) {
                return { valid: false, error: 'Missing version information' };
            }
            
            if (!exportData.appName || exportData.appName !== this.APP_NAME) {
                return { valid: false, error: 'Invalid or missing app name' };
            }
            
            if (exportData.data === undefined) {
                return { valid: false, error: 'Missing data payload' };
            }

            return { 
                valid: true, 
                info: {
                    version: exportData.version,
                    timestamp: exportData.timestamp,
                    encrypted: exportData.encrypted
                }
            };
        } catch (error) {
            return { valid: false, error: 'Invalid JSON format' };
        }
    }
}
