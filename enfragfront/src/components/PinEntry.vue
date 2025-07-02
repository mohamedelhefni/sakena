<template>
  <div class="fixed inset-0 bg-gradient-to-br from-primary-400 to-primary-600 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-md">
      <!-- Logo/Header -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clip-rule="evenodd"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ title }}</h1>
        <p class="text-gray-600 dark:text-gray-300">{{ subtitle }}</p>
      </div>

      <!-- PIN Input -->
      <div class="mb-6">
        <div class="flex justify-center space-x-3 mb-4">
          <div
            v-for="(digit, index) in 6"
            :key="index"
            class="w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl font-bold transition-colors"
            :class="[
              pin.length > index 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-400'
            ]"
          >
            {{ pin.length > index ? '●' : '' }}
          </div>
        </div>
        
        <!-- Error Message -->
        <div v-if="errorMessage" class="text-red-500 text-sm text-center mb-4">
          {{ errorMessage }}
        </div>
      </div>

      <!-- Number Pad -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <button
          v-for="number in 9"
          :key="number"
          @click="addDigit(number)"
          class="h-14 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-xl font-semibold transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95"
        >
          {{ number }}
        </button>
        
        <!-- Skip button (only for first-time setup) -->
        <button
          v-if="!userStore.user.hasPin"
          @click="skipSetup"
          class="h-14 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          تخطي
        </button>
        <div v-else></div>
        
        <!-- Zero -->
        <button
          @click="addDigit(0)"
          class="h-14 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white text-xl font-semibold transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95"
        >
          0
        </button>
        
        <!-- Backspace -->
        <button
          @click="removeDigit"
          class="h-14 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <svg class="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6.707 4.879A3 3 0 018.828 4H15a3 3 0 013 3v6a3 3 0 01-3 3H8.828a3 3 0 01-2.12-.879l-4.415-4.414a1 1 0 010-1.414l4.414-4.414zm4 6.414L9.293 10l1.414-1.293a1 1 0 10-1.414-1.414L8 8.586 6.707 7.293a1 1 0 10-1.414 1.414L6.586 10l-1.293 1.293a1 1 0 101.414 1.414L8 11.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>

      <!-- Submit Button -->
      <button
        v-if="pin.length === 6"
        @click="submitPin"
        :disabled="isLoading"
        class="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold transition-colors hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="!isLoading">{{ submitButtonText }}</span>
        <div v-else class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          جاري التحقق...
        </div>
      </button>

      <!-- Info Text -->
      <div class="text-center mt-6">
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          {{ infoText }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const userStore = useAuthStore()

const pin = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const title = computed(() => {
  return userStore.user.hasPin ? 'أدخل رقمك السري' : 'إنشاء رقم سري'
})

const subtitle = computed(() => {
  return userStore.user.hasPin 
    ? 'للوصول إلى بياناتك المشفرة' 
    : 'لحماية بياناتك الشخصية (6 أرقام)'
})

const submitButtonText = computed(() => {
  return userStore.user.hasPin ? 'دخول' : 'إنشاء'
})

const infoText = computed(() => {
  return userStore.user.hasPin 
    ? 'رقمك السري يحمي بياناتك الشخصية' 
    : 'ستحتاج هذا الرقم لفتح التطبيق'
})

function addDigit(digit) {
  if (pin.value.length < 6) {
    pin.value += digit.toString()
    errorMessage.value = ''
  }
}

function removeDigit() {
  pin.value = pin.value.slice(0, -1)
  errorMessage.value = ''
}

async function submitPin() {
  if (pin.value.length !== 6) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const success = await userStore.login(pin.value)
    
    if (!success) {
      errorMessage.value = 'الرقم السري غير صحيح'
      pin.value = ''
    }
  } catch (error) {
    errorMessage.value = 'حدث خطأ، حاول مرة أخرى'
    pin.value = ''
  } finally {
    isLoading.value = false
  }
}

function skipSetup() {
  userStore.skipPin()
}
</script>
