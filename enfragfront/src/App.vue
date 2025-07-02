<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { database } from '@/utils/database'
import NavigationBar from '@/components/NavigationBar.vue'
import PinEntry from '@/components/PinEntry.vue'

const authStore = useAuthStore()

onMounted(async () => {
  try {
    // Initialize database
    await database.init()
    
    // Initialize auth store
    await authStore.init()
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
  } catch (error) {
    console.error('Failed to initialize app:', error)
  }
})
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- PIN Entry Screen -->
    <PinEntry v-if="authStore.showPinScreen" />
    
    <!-- Main App Content -->
    <div v-else-if="authStore.isAuthenticated" class="pb-16">
      <RouterView />
      <NavigationBar />
    </div>
    
    <!-- Unauthenticated Views -->
    <div v-else>
      <RouterView />
    </div>
  </div>
</template>

<style>
* {
  direction: rtl;
}

body {
  font-family: 'Noto Sans Arabic', Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
