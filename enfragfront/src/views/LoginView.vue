<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-mint to-soft-lavender dark:from-gray-900 dark:to-gray-800 p-4">
    <div class="max-w-md w-full">
      <!-- Logo and App Name -->
      <div class="text-center mb-8">
        <div class="mx-auto w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mb-4 shadow-lg animate-float">
          <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">انفراج</h1>
        <p class="text-gray-600 dark:text-gray-300">رحلتك نحو الصحة النفسية</p>
      </div>

      <!-- PIN Entry Form -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
          {{ isFirstTime ? 'إنشاء رقم سري' : 'أدخل رقمك السري' }}
        </h2>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- PIN Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الرقم السري (4 أرقام)
            </label>
            <input
              v-model="pin"
              type="password"
              maxlength="4"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-center text-xl tracking-widest"
              placeholder="••••"
              @input="validatePin"
            />
          </div>

          <!-- Confirm PIN (only for first time) -->
          <div v-if="isFirstTime">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تأكيد الرقم السري
            </label>
            <input
              v-model="confirmPin"
              type="password"
              maxlength="4"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-center text-xl tracking-widest"
              placeholder="••••"
            />
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="text-red-600 text-sm text-center">
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري التحميل...
            </span>
            <span v-else>
              {{ isFirstTime ? 'إنشاء الحساب' : 'دخول' }}
            </span>
          </button>
        </form>

        <!-- First Time Info -->
        <div v-if="isFirstTime" class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <div class="flex">
            <svg class="flex-shrink-0 w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
            <div class="mr-3">
              <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">معلومة مهمة</h3>
              <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
                <p>الرقم السري يُستخدم لحماية بياناتك. جميع المعلومات مشفرة ومحفوظة محلياً على جهازك فقط.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skip PIN Option (for development) -->
      <div class="mt-4 text-center">
        <button
          @click="skipPin"
          class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          تخطي الرقم السري (للتطوير فقط)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getSetting, saveSetting } from '@/utils/database'

const router = useRouter()
const authStore = useAuthStore()

const pin = ref('')
const confirmPin = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const isFirstTime = ref(true)

const isFormValid = computed(() => {
  if (isFirstTime.value) {
    return pin.value.length === 4 && confirmPin.value.length === 4 && pin.value === confirmPin.value
  }
  return pin.value.length === 4
})

onMounted(async () => {
  // Check if user has set up PIN before
  const hasPin = await getSetting('hasPin')
  isFirstTime.value = !hasPin
})

function validatePin() {
  // Only allow numbers
  pin.value = pin.value.replace(/[^0-9]/g, '')
  
  if (pin.value.length > 4) {
    pin.value = pin.value.slice(0, 4)
  }
}

async function handleLogin() {
  if (!isFormValid.value) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    if (isFirstTime.value) {
      // First time setup
      await saveSetting('hasPin', true)
      const success = await authStore.login(pin.value)
      if (success) {
        router.push('/')
      } else {
        errorMessage.value = 'حدث خطأ في إنشاء الحساب'
      }
    } else {
      // Regular login
      const success = await authStore.login(pin.value)
      if (success) {
        router.push('/')
      } else {
        errorMessage.value = 'الرقم السري غير صحيح'
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = 'حدث خطأ، يرجى المحاولة مرة أخرى'
  } finally {
    isLoading.value = false
  }
}

// Development function to skip PIN
function skipPin() {
  authStore.login('1234')
  router.push('/')
}
</script>
