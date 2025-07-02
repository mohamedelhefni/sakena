<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
    <div class="flex justify-around items-center py-2">
      <RouterLink
        to="/"
        class="flex flex-col items-center p-2 text-xs"
        :class="$route.name === 'home' ? 'text-primary-600' : 'text-gray-600 dark:text-gray-400'"
      >
        <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
        </svg>
        الرئيسية
      </RouterLink>

      <RouterLink
        to="/mood"
        class="flex flex-col items-center p-2 text-xs"
        :class="$route.name === 'mood' ? 'text-primary-600' : 'text-gray-600 dark:text-gray-400'"
      >
        <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clip-rule="evenodd"/>
        </svg>
        المزاج
      </RouterLink>

      <RouterLink
        to="/journal"
        class="flex flex-col items-center p-2 text-xs"
        :class="$route.name === 'journal' ? 'text-primary-600' : 'text-gray-600 dark:text-gray-400'"
      >
        <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
          <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 3a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
        </svg>
        يومياتي
      </RouterLink>

      <RouterLink
        to="/coping"
        class="flex flex-col items-center p-2 text-xs"
        :class="$route.name === 'coping' ? 'text-primary-600' : 'text-gray-600 dark:text-gray-400'"
      >
        <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        التأقلم
      </RouterLink>

      <RouterLink
        to="/emergency"
        class="flex flex-col items-center p-2 text-xs"
        :class="$route.name === 'emergency' ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'"
      >
        <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>
        طوارئ
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
