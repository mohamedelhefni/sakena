<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth.js'
import { useMoodStore } from './stores/mood.js'
import { useEmergencyStore } from './stores/emergency.js'
import { onMounted } from 'vue'
import PinEntry from './components/PinEntry.vue'
import NavigationBar from './components/NavigationBar.vue'

const authStore = useAuthStore()
const moodStore = useMoodStore()
const emergencyStore = useEmergencyStore()

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await moodStore.loadMoodData()
    await emergencyStore.loadEmergencyData()
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <PinEntry v-if="!authStore.isAuthenticated" />
    <div v-else>
      <NavigationBar />
      <RouterView />
    </div>
  </div>
</template>
