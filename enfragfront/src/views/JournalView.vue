<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
    <!-- Header -->
    <header class="mb-6 pt-4">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">يومياتي</h1>
      <p class="text-gray-600 dark:text-gray-300">مساحة آمنة لكتابة مشاعرك وأفكارك</p>
    </header>

    <!-- Daily Prompts -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">موضوع اليوم</h2>
      <div class="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-4 mb-4">
        <p class="text-primary-800 dark:text-primary-200">{{ currentPrompt }}</p>
      </div>
      <button
        @click="getNewPrompt"
        class="text-primary-600 hover:text-primary-700 text-sm font-medium"
      >
        موضوع آخر ←
      </button>
    </div>

    <!-- Writing Area -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
      <form @submit.prevent="saveEntry" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            اكتب هنا...
          </label>
          <textarea
            v-model="currentEntry"
            rows="10"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            placeholder="اكتب مشاعرك وأفكارك هنا... كل ما تكتبه محمي ومشفر"
          ></textarea>
        </div>

        <!-- Word Count -->
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500">عدد الكلمات: {{ wordCount }}</span>
          <div class="flex items-center space-x-2 space-x-reverse">
            <button
              type="button"
              @click="clearEntry"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              مسح
            </button>
            <button
              type="submit"
              :disabled="!currentEntry.trim() || moodStore.isLoading"
              class="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="moodStore.isLoading">جاري الحفظ...</span>
              <span v-else>حفظ</span>
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Previous Entries -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">الكتابات السابقة</h2>
        <div class="flex items-center space-x-2 space-x-reverse">
          <button
            @click="viewMode = 'grid'"
            class="p-2 rounded"
            :class="viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' : 'text-gray-600 dark:text-gray-400'"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
          </button>
          <button
            @click="viewMode = 'list'"
            class="p-2 rounded"
            :class="viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' : 'text-gray-600 dark:text-gray-400'"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>

      <div v-if="moodStore.journalEntries.length === 0" class="text-center py-8">
        <svg class="mx-auto w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
        </svg>
        <p class="text-gray-500 dark:text-gray-400">لا توجد كتابات بعد</p>
        <p class="text-sm text-gray-400 dark:text-gray-500">ابدأ بكتابة أول مشاعرك أعلاه</p>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="entry in sortedEntries"
          :key="entry.id"
          class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          @click="selectedEntry = entry"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-800 dark:text-white">
              {{ formatDate(entry.date) }}
            </span>
            <span class="text-xs text-gray-500">{{ entry.wordCount }} كلمة</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
            {{ entry.content.substring(0, 150) }}{{ entry.content.length > 150 ? '...' : '' }}
          </p>
          <p v-if="entry.prompt" class="text-xs text-primary-600 dark:text-primary-400 mt-2">
            الموضوع: {{ entry.prompt.substring(0, 50) }}...
          </p>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="space-y-3">
        <div
          v-for="entry in sortedEntries"
          :key="entry.id"
          class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          @click="selectedEntry = entry"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-800 dark:text-white">
              {{ formatDate(entry.date) }}
            </span>
            <span class="text-xs text-gray-500">{{ entry.wordCount }} كلمة</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {{ entry.content.substring(0, 200) }}{{ entry.content.length > 200 ? '...' : '' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Entry Modal -->
    <div
      v-if="selectedEntry"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="selectedEntry = null"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
              {{ formatDate(selectedEntry.date) }}
            </h3>
            <button
              @click="selectedEntry = null"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div v-if="selectedEntry.prompt" class="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-3 mb-4">
            <p class="text-sm text-primary-800 dark:text-primary-200">
              الموضوع: {{ selectedEntry.prompt }}
            </p>
          </div>
          
          <div class="prose dark:prose-invert max-w-none">
            <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{{ selectedEntry.content }}</p>
          </div>
          
          <div class="mt-4 text-xs text-gray-500">
            عدد الكلمات: {{ selectedEntry.wordCount }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMoodStore } from '@/stores/mood'

const moodStore = useMoodStore()

const currentEntry = ref('')
const currentPrompt = ref('')
const selectedEntry = ref(null)
const viewMode = ref('grid')

const journalPrompts = [
  'ما الشيء الذي أشعر بالامتنان له اليوم؟',
  'صف موقفاً جعلك تشعر بالفخر مؤخراً',
  'ما هي أكبر تحدياتك الحالية وكيف تتعامل معها؟',
  'اكتب عن شخص يعني لك الكثير ولماذا',
  'ما هي أحلامك وأهدافك للمستقبل؟',
  'صف يوماً مثالياً في حياتك',
  'ما الذي تعلمته عن نفسك مؤخراً؟',
  'اكتب رسالة لنفسك في الماضي',
  'ما هي نقاط قوتك وكيف تستخدمها؟',
  'صف مكاناً يجعلك تشعر بالسلام والراحة',
  'ما هي العادات الإيجابية التي تريد تطويرها؟',
  'اكتب عن تجربة صعبة وما تعلمته منها',
  'ما الذي يجعلك تشعر بالسعادة حقاً؟',
  'صف العلاقات المهمة في حياتك',
  'ما هي أكبر مخاوفك وكيف تواجهها؟'
]

const wordCount = computed(() => {
  return currentEntry.value.trim().split(/\s+/).filter(word => word.length > 0).length
})

const sortedEntries = computed(() => {
  return moodStore.journalEntries
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

function getNewPrompt() {
  const randomIndex = Math.floor(Math.random() * journalPrompts.length)
  currentPrompt.value = journalPrompts[randomIndex]
}

function clearEntry() {
  currentEntry.value = ''
}

async function saveEntry() {
  if (!currentEntry.value.trim()) return
  
  const success = await moodStore.saveJournal(currentEntry.value, currentPrompt.value)
  if (success) {
    currentEntry.value = ''
    getNewPrompt()
  }
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
  getNewPrompt()
  moodStore.loadJournalHistory()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
