import { defineStore } from 'pinia'
import encryptionService from '../utils/encryption.js'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        userPin: null
    }),

    actions: {
        async login(pin) {
            try {
                // Set the encryption key with the PIN
                encryptionService.setSecretKey(pin)

                // Try to decrypt existing data to verify the PIN is correct
                const testData = localStorage.getItem('enfrag_mental_health_data')
                if (testData) {
                    // If there's existing data, try to decrypt it
                    encryptionService.decrypt(testData)
                }

                this.isAuthenticated = true
                this.userPin = pin
                return { success: true }
            } catch (error) {
                this.isAuthenticated = false
                this.userPin = null
                return { success: false, error: 'رقم PIN غير صحيح' }
            }
        },

        logout() {
            this.isAuthenticated = false
            this.userPin = null
            encryptionService.setSecretKey(null)
        },

        async setupPin(pin) {
            try {
                encryptionService.setSecretKey(pin)
                this.isAuthenticated = true
                this.userPin = pin

                // Initialize with empty data to test encryption
                const testData = {}
                encryptionService.encrypt(testData)

                return { success: true }
            } catch (error) {
                return { success: false, error: 'فشل في إعداد رقم PIN' }
            }
        },

        hasExistingData() {
            return localStorage.getItem('enfrag_mental_health_data') !== null
        }
    }
})
