<template>
  <div class="min-h-screen bg-gradient-to-br from-soft-mint to-soft-peach dark:from-gray-900 dark:to-gray-800 p-4">
    <!-- Header -->
    <header class="mb-8 pt-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">مرحباً بك في انفراج</h1>
          <p class="text-gray-600 dark:text-gray-300">{{ currentTimeGreeting }}</p>
        </div>
        <div class="flex space-x-2 space-x-reverse">
          <button
            @click="authStore.toggleDarkMode"
            class="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md"
          >
            <svg v-if="!authStore.isDarkMode" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
            </svg>
          </button>
          <RouterLink
            to="/settings"
            class="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
            </svg>
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- Quick Mood Check -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">كيف تشعر اليوم؟</h2>
      <div class="flex justify-between items-center">
        <div class="flex space-x-4 space-x-reverse">
          <button
            v-for="mood in quickMoods"
            :key="mood.value"
            @click="setQuickMood(mood.value)"
            class="flex flex-col items-center p-3 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
            :class="selectedMood === mood.value ? 'bg-primary-50 dark:bg-primary-900' : ''"
          >
            <span class="text-2xl mb-1">{{ mood.emoji }}</span>
            <span class="text-xs text-gray-600 dark:text-gray-300">{{ mood.label }}</span>
          </button>
        </div>
        <RouterLink
          to="/mood"
          class="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          تسجيل مفصل ←
        </RouterLink>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div
        @click="router.push('/journal')"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
      >
        <div class="flex items-center mb-3">
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 3a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <h3 class="font-semibold text-gray-800 dark:text-white mb-1">يومياتي</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300">اكتب مشاعرك وأفكارك</p>
      </div>

      <div
        @click="router.push('/coping')"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
      >
        <div class="flex items-center mb-3">
          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
        </div>
        <h3 class="font-semibold text-gray-800 dark:text-white mb-1">التأقلم</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300">تمارين التنفس والاسترخاء</p>
      </div>

      <div
        @click="router.push('/cbt')"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
      >
        <div class="flex items-center mb-3">
          <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <h3 class="font-semibold text-gray-800 dark:text-white mb-1">العلاج المعرفي</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300">تحليل الأفكار والمشاعر</p>
      </div>

      <div
        @click="router.push('/analytics')"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
      >
        <div class="flex items-center mb-3">
          <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <svg class="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
            </svg>
          </div>
        </div>
        <h3 class="font-semibold text-gray-800 dark:text-white mb-1">التحليلات</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300">تقارير وإحصائيات</p>
      </div>
    </div>

    <!-- Emergency Button -->
    <div class="bg-red-50 dark:bg-red-900/30 rounded-2xl shadow-lg p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-1">هل تحتاج مساعدة عاجلة؟</h3>
          <p class="text-sm text-red-600 dark:text-red-300">نحن هنا لمساعدتك</p>
        </div>
        <RouterLink
          to="/emergency"
          class="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          مساعدة فورية
        </RouterLink>
      </div>
    </div>

    <!-- Daily Tip -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">💡 نصيحة اليوم</h3>
      <p class="text-gray-600 dark:text-gray-300">{{ dailyTip }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMoodStore } from '@/stores/mood'

const router = useRouter()
const authStore = useAuthStore()
const moodStore = useMoodStore()

const selectedMood = ref(null)
const dailyTip = ref('')

const quickMoods = [
  { value: 1, emoji: '😔', label: 'حزين' },
  { value: 2, emoji: '😐', label: 'عادي' },
  { value: 3, emoji: '😊', label: 'جيد' },
  { value: 4, emoji: '😄', label: 'سعيد' },
  { value: 5, emoji: '🥰', label: 'رائع' }
]

const dailyTips = [
  'تذكر أن طلب المساعدة علامة على القوة وليس الضعف',
  'خذ نفساً عميقاً... الآن زفير ببطء. كرر هذا 5 مرات',
  'اكتب 3 أشياء تشعر بالامتنان لها اليوم',
  'تذكر أن المشاعر السلبية مؤقتة وستمر',
  'امشِ لمدة 10 دقائق في الهواء الطلق إذا أمكن',
  'تواصل مع صديق أو أحد أفراد العائلة اليوم',
  'مارس تمرين التأمل لمدة 5 دقائق',
  'اشرب كوباً من الماء واحرص على الترطيب'
]

const currentTimeGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'صباح الخير 🌅'
  if (hour < 17) return 'مساء الخير ☀️'
  return 'مساء الخير 🌙'
})

function setQuickMood(mood) {
  selectedMood.value = mood
  moodStore.logMood({
    mood,
    energy: 3,
    anxiety: 3,
    notes: 'تسجيل سريع من الصفحة الرئيسية'
  })
}

onMounted(() => {
  // Set random daily tip
  dailyTip.value = dailyTips[Math.floor(Math.random() * dailyTips.length)]
  
  // Load mood history
  moodStore.loadMoodHistory()
})
</script>
