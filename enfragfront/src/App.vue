<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth.js'
import { useMoodStore } from './stores/mood.js'
import { useEmergencyStore } from './stores/emergency.js'
import { onMounted } from 'vue'
import PinEntry from './components/PinEntry.vue'
import NavigationBar from './components/NavigationBar.vue'
import encryptionService from './utils/encryption.js'

const authStore = useAuthStore()
const moodStore = useMoodStore()
const emergencyStore = useEmergencyStore()

onMounted(async () => {
  if (authStore.isAuthenticated && authStore.userPin) {
    // Restore encryption key when page loads
    try {
      // Set the encryption key with the stored PIN
      encryptionService.setSecretKey(authStore.userPin)
      
      await moodStore.loadMoodData()
      await emergencyStore.loadEmergencyData()
    } catch (error) {
      // If there was an error restoring the encryption key, log out the user
      console.error('Failed to restore encryption key', error)
      authStore.logout()
    }
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <PinEntry v-if="!authStore.isAuthenticated" />
    <div v-else class="h-screen flex flex-col">
      <NavigationBar>
        <RouterView />
      </NavigationBar>
    </div>
  </div>
</template>
