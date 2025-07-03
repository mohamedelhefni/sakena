import CryptoJS from 'crypto-js';

export interface EncryptedData {
    encrypted: string;
    iv: string;
}

export class EncryptionService {
    private static deriveKey(pin: string, salt: string): string {
        return CryptoJS.PBKDF2(pin, salt, {
            keySize: 256 / 32,
            iterations: 1000,
        }).toString();
    }

    static encrypt(data: string, pin: string): EncryptedData {
        const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
        const key = this.deriveKey(pin, salt);
        const iv = CryptoJS.lib.WordArray.random(128 / 8);

        const encrypted = CryptoJS.AES.encrypt(data, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return {
            encrypted: salt + ':' + encrypted.toString(),
            iv: iv.toString(),
        };
    }

    static decrypt(encryptedData: EncryptedData, pin: string): string | null {
        try {
            const [salt, encrypted] = encryptedData.encrypted.split(':');
            const key = this.deriveKey(pin, salt);
            const iv = CryptoJS.enc.Hex.parse(encryptedData.iv);

            const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            });

            const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
            return decryptedText || null;
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    }

    static validatePin(pin: string): boolean {
        return pin.length >= 4 && /^\d+$/.test(pin);
    }
}

// Local storage with encryption
export class SecureStorage {
    private static readonly STORAGE_KEY = 'mood_tracker_data';
    private static readonly USER_KEY = 'mood_tracker_user';
    private static readonly SESSION_KEY = 'mood_tracker_session';
    private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    static saveUserData(userData: any, pin: string): boolean {
        try {
            const jsonData = JSON.stringify(userData);
            const encrypted = EncryptionService.encrypt(jsonData, pin);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(encrypted));
            return true;
        } catch (error) {
            console.error('Failed to save user data:', error);
            return false;
        }
    }

    static loadUserData(pin: string): any | null {
        try {
            const encryptedData = localStorage.getItem(this.STORAGE_KEY);
            if (!encryptedData) return null;

            const parsed = JSON.parse(encryptedData);
            const decrypted = EncryptionService.decrypt(parsed, pin);

            if (!decrypted) return null;
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('Failed to load user data:', error);
            return null;
        }
    }

    static saveUserProfile(username: string): void {
        localStorage.setItem(this.USER_KEY, username);
    }

    static getUserProfile(): string | null {
        return localStorage.getItem(this.USER_KEY);
    }

    static saveSession(pin: string): void {
        const session = {
            pin,
            timestamp: Date.now(),
            expires: Date.now() + this.SESSION_TIMEOUT
        };
        const encrypted = EncryptionService.encrypt(JSON.stringify(session), 'session_key_' + Date.now());
        localStorage.setItem(this.SESSION_KEY, encrypted.encrypted);
    }

    static getValidSession(): string | null {
        try {
            const encryptedSession = localStorage.getItem(this.SESSION_KEY);
            if (!encryptedSession) return null;

            // For session, we'll use a simpler approach - just check timestamp
            const sessionData = localStorage.getItem(this.SESSION_KEY + '_timestamp');
            if (!sessionData) return null;

            const timestamp = parseInt(sessionData);
            if (Date.now() - timestamp > this.SESSION_TIMEOUT) {
                this.clearSession();
                return null;
            }

            const pin = localStorage.getItem(this.SESSION_KEY + '_pin');
            return pin;
        } catch (error) {
            console.error('Failed to get session:', error);
            return null;
        }
    }

    static saveSimpleSession(pin: string): void {
        localStorage.setItem(this.SESSION_KEY + '_pin', pin);
        localStorage.setItem(this.SESSION_KEY + '_timestamp', Date.now().toString());
    }

    static clearSession(): void {
        localStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem(this.SESSION_KEY + '_pin');
        localStorage.removeItem(this.SESSION_KEY + '_timestamp');
    }

    static clearAllData(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.clearSession();
    }
}
