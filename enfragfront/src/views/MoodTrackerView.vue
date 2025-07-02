<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
    <!-- Header -->
    <header class="mb-6 pt-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">تتبع المزاج</h1>
          <p class="text-gray-600 dark:text-gray-300">سجل مشاعرك اليومية</p>
        </div>
        <RouterLink
          to="/analytics"
          class="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          عرض التحليلات ←
        </RouterLink>
      </div>
    </header>

    <!-- Current Mood Entry -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">كيف تشعر الآن؟</h2>
      
      <form @submit.prevent="saveMoodEntry" class="space-y-6">
        <!-- Mood Scale -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            المزاج العام (1-10)
          </label>
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">حزين جداً</span>
            <div class="flex space-x-2 space-x-reverse">
              <button
                v-for="n in 10"
                :key="n"
                type="button"
                @click="currentEntry.mood = n"
                class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors"
                :class="currentEntry.mood === n
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary-300'"
              >
                {{ n }}
              </button>
            </div>
            <span class="text-xs text-gray-500">سعيد جداً</span>
          </div>
        </div>

        <!-- Energy Level -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            مستوى الطاقة (1-10)
          </label>
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">مرهق</span>
            <div class="flex space-x-2 space-x-reverse">
              <button
                v-for="n in 10"
                :key="n"
                type="button"
                @click="currentEntry.energy = n"
                class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors"
                :class="currentEntry.energy === n
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-green-300'"
              >
                {{ n }}
              </button>
            </div>
            <span class="text-xs text-gray-500">نشيط</span>
          </div>
        </div>

        <!-- Anxiety Level -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            مستوى القلق (1-10)
          </label>
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">هادئ</span>
            <div class="flex space-x-2 space-x-reverse">
              <button
                v-for="n in 10"
                :key="n"
                type="button"
                @click="currentEntry.anxiety = n"
                class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors"
                :class="currentEntry.anxiety === n
                  ? 'border-red-500 bg-red-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-red-300'"
              >
                {{ n }}
              </button>
            </div>
            <span class="text-xs text-gray-500">قلق جداً</span>
          </div>
        </div>

        <!-- Activities -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            الأنشطة اليوم
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="activity in availableActivities"
              :key="activity"
              type="button"
              @click="toggleActivity(activity)"
              class="p-3 rounded-lg border-2 text-sm font-medium transition-colors"
              :class="currentEntry.activities.includes(activity)
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary-300'"
            >
              {{ activity }}
            </button>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ملاحظات (اختياري)
          </label>
          <textarea
            v-model="currentEntry.notes"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            placeholder="اكتب ما تشعر به أو أي ملاحظات أخرى..."
          ></textarea>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="!isFormValid || moodStore.isLoading"
          class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="moodStore.isLoading">جاري الحفظ...</span>
          <span v-else>حفظ التسجيل</span>
        </button>
      </form>
    </div>

    <!-- Recent Entries -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">التسجيلات الأخيرة</h2>
      
      <div v-if="moodStore.moodHistory.length === 0" class="text-center py-8">
        <svg class="mx-auto w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        <p class="text-gray-500 dark:text-gray-400">لا توجد تسجيلات بعد</p>
        <p class="text-sm text-gray-400 dark:text-gray-500">ابدأ بتسجيل مزاجك أعلاه</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="entry in recentEntries"
          :key="entry.id"
          class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div class="flex-1">
            <div class="flex items-center space-x-3 space-x-reverse mb-2">
              <span class="text-2xl">{{ getMoodEmoji(entry.mood) }}</span>
              <div>
                <p class="text-sm font-medium text-gray-800 dark:text-white">
                  {{ formatDate(entry.date) }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  المزاج: {{ entry.mood }}/10 | الطاقة: {{ entry.energy }}/10 | القلق: {{ entry.anxiety }}/10
                </p>
              </div>
            </div>
            <div v-if="entry.activities.length > 0" class="flex flex-wrap gap-1">
              <span
                v-for="activity in entry.activities"
                :key="activity"
                class="inline-block px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded"
              >
                {{ activity }}
              </span>
            </div>
            <p v-if="entry.notes" class="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {{ entry.notes }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useMoodStore } from '@/stores/mood'

const moodStore = useMoodStore()

const currentEntry = ref({
  mood: 5,
  energy: 5,
  anxiety: 5,
  activities: [],
  notes: ''
})

const availableActivities = [
  'عمل', 'رياضة', 'قراءة', 'موسيقى',
  'أصدقاء', 'عائلة', 'طبيعة', 'طبخ',
  'تأمل', 'فيلم', 'نوم', 'تسوق'
]

const isFormValid = computed(() => {
  return currentEntry.value.mood > 0 && 
         currentEntry.value.energy > 0 && 
         currentEntry.value.anxiety > 0
})

const recentEntries = computed(() => {
  return moodStore.moodHistory
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
})

function toggleActivity(activity) {
  const index = currentEntry.value.activities.indexOf(activity)
  if (index > -1) {
    currentEntry.value.activities.splice(index, 1)
  } else {
    currentEntry.value.activities.push(activity)
  }
}

async function saveMoodEntry() {
  const success = await moodStore.logMood(currentEntry.value)
  if (success) {
    // Reset form
    currentEntry.value = {
      mood: 5,
      energy: 5,
      anxiety: 5,
      activities: [],
      notes: ''
    }
  }
}

function getMoodEmoji(mood) {
  if (mood <= 2) return '😔'
  if (mood <= 4) return '😐'
  if (mood <= 6) return '🙂'
  if (mood <= 8) return '😊'
  return '😄'
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'اليوم'
  if (diffInDays === 1) return 'أمس'
  if (diffInDays < 7) return `منذ ${diffInDays} أيام`
  
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  moodStore.loadMoodHistory()
})
</script>
