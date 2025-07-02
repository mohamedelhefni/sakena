import { defineStore } from 'pinia'
import encryptionService from '../utils/encryption.js'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: localStorage.getItem('enfrag_isAuthenticated') === 'true',
        userPin: localStorage.getItem('enfrag_userPin') || null
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
                
                // Save authentication state in localStorage
                localStorage.setItem('enfrag_isAuthenticated', 'true')
                localStorage.setItem('enfrag_userPin', pin)
                
                return { success: true }
            } catch (error) {
                this.isAuthenticated = false
                this.userPin = null
                
                // Clear authentication state in localStorage
                localStorage.removeItem('enfrag_isAuthenticated')
                localStorage.removeItem('enfrag_userPin')
                
                return { success: false, error: 'رقم PIN غير صحيح' }
            }
        },

        logout() {
            this.isAuthenticated = false
            this.userPin = null
            encryptionService.setSecretKey(null)
            
            // Clear authentication state in localStorage
            localStorage.removeItem('enfrag_isAuthenticated')
            localStorage.removeItem('enfrag_userPin')
        },

        async setupPin(pin) {
            try {
                encryptionService.setSecretKey(pin)
                this.isAuthenticated = true
                this.userPin = pin

                // Save authentication state in localStorage
                localStorage.setItem('enfrag_isAuthenticated', 'true')
                localStorage.setItem('enfrag_userPin', pin)

                // Initialize with empty data to test encryption
                const testData = {}
                encryptionService.encrypt(testData)

                return { success: true }
            } catch (error) {
                // Clear authentication state in localStorage
                localStorage.removeItem('enfrag_isAuthenticated')
                localStorage.removeItem('enfrag_userPin')
                
                return { success: false, error: 'فشل في إعداد رقم PIN' }
            }
        },

        hasExistingData() {
            return localStorage.getItem('enfrag_mental_health_data') !== null
        }
    }
})
