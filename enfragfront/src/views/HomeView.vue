<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" dir="rtl">
    <div class="max-w-4xl mx-auto p-6">
      <!-- Welcome Header -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">مرحباً بك في رحلة الصحة النفسية</h1>
          <p class="text-gray-600">كيف تشعر اليوم؟ نحن هنا لمساعدتك في تتبع مزاجك وصحتك النفسية</p>
        </div>
      </div>

      <!-- Quick Mood Check -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">فحص سريع للمزاج</h2>
        <div class="grid grid-cols-5 gap-3">
          <button v-for="mood in moodOptions" :key="mood.value" @click="setQuickMood(mood.value)"
            class="flex flex-col items-center p-4 rounded-xl border-2 transition-all hover:border-blue-500 hover:bg-blue-50"
            :class="currentMood === mood.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'">
            <span class="text-2xl mb-2">{{ mood.emoji }}</span>
            <span class="text-sm font-medium">{{ mood.label }}</span>
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">متوسط المزاج</p>
              <p class="text-2xl font-bold text-blue-600">{{ averageMood }}/5</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">مستوى القلق</p>
              <p class="text-2xl font-bold text-orange-600">{{ averageAnxiety }}/5</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">عدد الإدخالات</p>
              <p class="text-2xl font-bold text-green-600">{{ totalEntries }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                </path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">إجراءات سريعة</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <router-link to="/mood"
            class="flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <span class="text-sm font-medium text-center">تسجيل المزاج</span>
          </router-link>

          <router-link to="/journal"
            class="flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                </path>
              </svg>
            </div>
            <span class="text-sm font-medium text-center">كتابة في المفكرة</span>
          </router-link>

          <router-link to="/coping"
            class="flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z">
                </path>
              </svg>
            </div>
            <span class="text-sm font-medium text-center">استراتيجيات التكيف</span>
          </router-link>

          <router-link to="/emergency"
            class="flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                </path>
              </svg>
            </div>
            <span class="text-sm font-medium text-center">مساعدة طارئة</span>
          </router-link>
        </div>
      </div>

      <!-- Recent Entries -->
      <div v-if="recentEntries.length > 0" class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">آخر الإدخالات</h2>
        <div class="space-y-3">
          <div v-for="entry in recentEntries.slice(0, 3)" :key="entry.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p class="font-medium">{{ getMoodText(entry.mood) }}</p>
              <p class="text-sm text-gray-600">{{ formatDate(entry.date) }}</p>
            </div>
            <div class="flex items-center space-x-2 space-x-reverse">
              <span class="w-4 h-4 rounded-full" :class="getMoodColor(entry.mood)"></span>
              <span class="text-sm font-medium">{{ entry.mood }}/5</span>
            </div>
          </div>
        </div>
        <router-link to="/mood" class="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
          عرض جميع الإدخالات ←
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useMoodStore } from '../stores/mood.js'

const moodStore = useMoodStore()
const currentMood = ref(null)

const moodOptions = [
  { value: 1, emoji: '😢', label: 'سيء جداً' },
  { value: 2, emoji: '😔', label: 'سيء' },
  { value: 3, emoji: '😐', label: 'متوسط' },
  { value: 4, emoji: '😊', label: 'جيد' },
  { value: 5, emoji: '😄', label: 'ممتاز' }
]

const averageMood = computed(() => moodStore.averageMood)
const averageAnxiety = computed(() => moodStore.averageAnxiety)
const totalEntries = computed(() => moodStore.moodEntries.length)
const recentEntries = computed(() => moodStore.recentMoods)

const setQuickMood = async (mood) => {
  currentMood.value = mood
  await moodStore.saveMoodEntry({
    mood,
    anxiety: 3,
    depression: 3,
    notes: 'تقييم سريع من الصفحة الرئيسية'
  })
}

const getMoodText = (level) => moodStore.getMoodText(level)
const getMoodColor = (level) => moodStore.getMoodColor(level)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  await moodStore.loadMoodData()
})
</script>
