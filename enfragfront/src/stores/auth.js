import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { deriveKeyFromPin, clearEncryptionKey, getSetting, saveSetting } from '@/utils/database'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const isDarkMode = ref(false)
  const pin = ref('')
  const showPinScreen = ref(true)
  const user = ref({
    name: '',
    hasPin: false
  })

  const isLoggedIn = computed(() => isAuthenticated.value)

  // Initialize store
  async function init() {
    // Load theme preference
    const savedTheme = await getSetting('theme')
    if (savedTheme) {
      isDarkMode.value = savedTheme === 'dark'
    } else {
      // Auto-detect system theme
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    // Apply theme to document
    updateTheme()
    
    // Check if user has set a PIN
    const hasPinSetting = await getSetting('hasPin')
    user.value.hasPin = hasPinSetting || false
    
    // If no PIN is set, skip PIN screen
    if (!user.value.hasPin) {
      showPinScreen.value = false
      isAuthenticated.value = true
    }
  }

  // Create new PIN
  async function createPin(newPin) {
    try {
      // Hash the PIN for storage
      const encoder = new TextEncoder()
      const data = encoder.encode(newPin)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      
      // Save PIN hash and mark as having PIN
      await saveSetting('pinHash', hashHex)
      await saveSetting('hasPin', true)
      
      // Derive encryption key
      await deriveKeyFromPin(newPin)
      
      pin.value = newPin
      user.value.hasPin = true
      isAuthenticated.value = true
      showPinScreen.value = false
      
      return true
    } catch (error) {
      console.error('Failed to create PIN:', error)
      return false
    }
  }

  // Verify PIN
  async function verifyPin(enteredPin) {
    try {
      // Hash the entered PIN
      const encoder = new TextEncoder()
      const data = encoder.encode(enteredPin)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      
      // Compare with stored hash
      const storedHash = await getSetting('pinHash')
      
      if (hashHex === storedHash) {
        // Derive encryption key
        await deriveKeyFromPin(enteredPin)
        pin.value = enteredPin
        isAuthenticated.value = true
        showPinScreen.value = false
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Failed to verify PIN:', error)
      return false
    }
  }

  async function login(userPin) {
    if (user.value.hasPin) {
      return await verifyPin(userPin)
    } else {
      return await createPin(userPin)
    }
  }

  // Skip PIN (for first-time users)
  function skipPin() {
    showPinScreen.value = false
    isAuthenticated.value = true
  }

  function logout() {
    clearEncryptionKey()
    pin.value = ''
    isAuthenticated.value = false
    showPinScreen.value = user.value.hasPin
  }

  async function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
    await saveSetting('theme', isDarkMode.value ? 'dark' : 'light')
    updateTheme()
  }

  // Update theme in document
  function updateTheme() {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Reset PIN (for development/testing)
  async function resetPin() {
    await saveSetting('hasPin', false)
    await saveSetting('pinHash', null)
    user.value.hasPin = false
    showPinScreen.value = false
    isAuthenticated.value = true
    clearEncryptionKey()
  }

  return {
    isAuthenticated,
    isDarkMode,
    pin,
    showPinScreen,
    user,
    isLoggedIn,
    init,
    createPin,
    verifyPin,
    login,
    logout,
    skipPin,
    toggleDarkMode,
    updateTheme,
    resetPin
  }
})
