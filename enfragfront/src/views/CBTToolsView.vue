<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
    <!-- Header -->
    <header class="mb-6 pt-4">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">أدوات العلاج المعرفي السلوكي</h1>
      <p class="text-gray-600 dark:text-gray-300">تقنيات لفهم وتغيير الأفكار والمشاعر</p>
    </header>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <button
        @click="startThoughtRecord"
        class="bg-purple-500 text-white p-6 rounded-2xl shadow-lg hover:bg-purple-600 transition-colors text-right"
      >
        <div class="flex items-center">
          <div class="ml-4">
            <div class="text-3xl mb-2">🧠</div>
          </div>
          <div>
            <h3 class="font-semibold mb-1">سجل الأفكار</h3>
            <p class="text-sm opacity-90">تحليل الأفكار التلقائية</p>
          </div>
        </div>
      </button>

      <button
        @click="viewThoughtRecords"
        class="bg-indigo-500 text-white p-6 rounded-2xl shadow-lg hover:bg-indigo-600 transition-colors text-right"
      >
        <div class="flex items-center">
          <div class="ml-4">
            <div class="text-3xl mb-2">📊</div>
          </div>
          <div>
            <h3 class="font-semibold mb-1">سجلاتي السابقة</h3>
            <p class="text-sm opacity-90">مراجعة التقدم</p>
          </div>
        </div>
      </button>
    </div>

    <!-- Thought Record Form -->
    <div v-if="showThoughtRecord" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">سجل فكرة جديدة</h2>
        <button
          @click="closeThoughtRecord"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <form @submit.prevent="saveThoughtRecord" class="space-y-6">
        <!-- Step 1: Situation -->
        <div class="p-4 border-2 border-purple-200 dark:border-purple-700 rounded-lg">
          <h3 class="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">
            1. الموقف
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
            صف الموقف الذي أثار هذه الأفكار والمشاعر
          </p>
          <textarea
            v-model="thoughtRecord.situation"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            placeholder="مثال: كنت أجلس في العمل وتذكرت خطأً ارتكبته أمس..."
          ></textarea>
        </div>

        <!-- Step 2: Automatic Thought -->
        <div class="p-4 border-2 border-red-200 dark:border-red-700 rounded-lg">
          <h3 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-3">
            2. الفكرة التلقائية
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
            ما هي الفكرة الأولى التي خطرت ببالك؟
          </p>
          <textarea
            v-model="thoughtRecord.automaticThought"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            placeholder="مثال: الجميع يعتقد أنني فاشل..."
          ></textarea>
        </div>

        <!-- Step 3: Emotion and Intensity -->
        <div class="p-4 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg">
          <h3 class="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
            3. المشاعر
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ما المشاعر التي شعرت بها؟
              </label>
              <select
                v-model="thoughtRecord.emotion"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">اختر المشاعر</option>
                <option value="حزن">حزن</option>
                <option value="قلق">قلق</option>
                <option value="غضب">غضب</option>
                <option value="خوف">خوف</option>
                <option value="خجل">خجل</option>
                <option value="إحراج">إحراج</option>
                <option value="يأس">يأس</option>
                <option value="إحباط">إحباط</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                شدة المشاعر (1-10)
              </label>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">ضعيف</span>
                <div class="flex space-x-2 space-x-reverse">
                  <button
                    v-for="n in 10"
                    :key="n"
                    type="button"
                    @click="thoughtRecord.emotionIntensity = n"
                    class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors"
                    :class="thoughtRecord.emotionIntensity === n
                      ? 'border-yellow-500 bg-yellow-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-yellow-300'"
                  >
                    {{ n }}
                  </button>
                </div>
                <span class="text-xs text-gray-500">شديد</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Evidence -->
        <div class="p-4 border-2 border-blue-200 dark:border-blue-700 rounded-lg">
          <h3 class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
            4. تحليل الأدلة
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
            ما الأدلة التي تدعم أو تعارض هذه الفكرة؟
          </p>
          <textarea
            v-model="thoughtRecord.evidence"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            placeholder="أدلة مؤيدة: ... أدلة معارضة: ..."
          ></textarea>
        </div>

        <!-- Step 5: Balanced Thought -->
        <div class="p-4 border-2 border-green-200 dark:border-green-700 rounded-lg">
          <h3 class="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
            5. الفكرة المتوازنة
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
            بناءً على الأدلة، ما هي طريقة أكثر واقعية للنظر لهذا الموقف؟
          </p>
          <textarea
            v-model="thoughtRecord.balancedThought"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            placeholder="مثال: لقد ارتكبت خطأً ولكن هذا لا يعني أنني فاشل..."
          ></textarea>
        </div>

        <!-- Step 6: New Emotion -->
        <div class="p-4 border-2 border-indigo-200 dark:border-indigo-700 rounded-lg">
          <h3 class="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-3">
            6. المشاعر الجديدة
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                كيف تشعر الآن بعد التفكير المتوازن؟
              </label>
              <select
                v-model="thoughtRecord.newEmotion"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">اختر المشاعر الجديدة</option>
                <option value="راحة">راحة</option>
                <option value="هدوء">هدوء</option>
                <option value="أمل">أمل</option>
                <option value="قبول">قبول</option>
                <option value="ثقة">ثقة</option>
                <option value="تفاؤل">تفاؤل</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                شدة المشاعر الجديدة (1-10)
              </label>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">ضعيف</span>
                <div class="flex space-x-2 space-x-reverse">
                  <button
                    v-for="n in 10"
                    :key="n"
                    type="button"
                    @click="thoughtRecord.newEmotionIntensity = n"
                    class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors"
                    :class="thoughtRecord.newEmotionIntensity === n
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-indigo-300'"
                  >
                    {{ n }}
                  </button>
                </div>
                <span class="text-xs text-gray-500">شديد</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end space-x-4 space-x-reverse">
          <button
            type="button"
            @click="resetForm"
            class="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
          >
            إعادة تعيين
          </button>
          <button
            type="submit"
            :disabled="!isFormValid || moodStore.isLoading"
            class="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="moodStore.isLoading">جاري الحفظ...</span>
            <span v-else>حفظ السجل</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Thought Records History -->
    <div v-if="showRecords" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">سجلات الأفكار السابقة</h2>
        <button
          @click="closeRecords"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div v-if="moodStore.thoughtRecords.length === 0" class="text-center py-8">
        <svg class="mx-auto w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p class="text-gray-500 dark:text-gray-400">لا توجد سجلات بعد</p>
        <p class="text-sm text-gray-400 dark:text-gray-500">ابدأ بإنشاء سجل فكرة جديدة</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="record in sortedRecords"
          :key="record.id"
          class="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          @click="selectedRecord = record"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-gray-800 dark:text-white">
              {{ formatDate(record.date) }}
            </span>
            <div class="flex items-center space-x-2 space-x-reverse">
              <span class="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                {{ record.emotion }}
              </span>
              <span class="text-xs text-gray-500">
                {{ record.emotionIntensity }}/10 → {{ record.newEmotionIntensity || 0 }}/10
              </span>
            </div>
          </div>
          
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
            <strong>الموقف:</strong> {{ record.situation.substring(0, 100) }}{{ record.situation.length > 100 ? '...' : '' }}
          </p>
          
          <p class="text-sm text-gray-600 dark:text-gray-300">
            <strong>الفكرة:</strong> {{ record.automaticThought.substring(0, 100) }}{{ record.automaticThought.length > 100 ? '...' : '' }}
          </p>
        </div>
      </div>
    </div>

    <!-- CBT Education -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">تعلم المزيد عن العلاج المعرفي السلوكي</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="topic in cbtTopics"
          :key="topic.id"
          @click="learnTopic(topic)"
          class="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-purple-300 dark:hover:border-purple-500 transition-colors"
        >
          <div class="flex items-center mb-2">
            <span class="text-2xl ml-3">{{ topic.icon }}</span>
            <h3 class="font-semibold text-gray-800 dark:text-white">{{ topic.title }}</h3>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300">{{ topic.description }}</p>
        </div>
      </div>
    </div>

    <!-- Record Detail Modal -->
    <div
      v-if="selectedRecord"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="selectedRecord = null"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
              سجل الفكرة - {{ formatDate(selectedRecord.date) }}
            </h3>
            <button
              @click="selectedRecord = null"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div class="space-y-6">
            <div>
              <h4 class="font-semibold text-purple-800 dark:text-purple-200 mb-2">الموقف</h4>
              <p class="text-gray-700 dark:text-gray-300">{{ selectedRecord.situation }}</p>
            </div>
            
            <div>
              <h4 class="font-semibold text-red-800 dark:text-red-200 mb-2">الفكرة التلقائية</h4>
              <p class="text-gray-700 dark:text-gray-300">{{ selectedRecord.automaticThought }}</p>
            </div>
            
            <div>
              <h4 class="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">المشاعر</h4>
              <p class="text-gray-700 dark:text-gray-300">
                {{ selectedRecord.emotion }} ({{ selectedRecord.emotionIntensity }}/10)
              </p>
            </div>
            
            <div v-if="selectedRecord.evidence">
              <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">تحليل الأدلة</h4>
              <p class="text-gray-700 dark:text-gray-300">{{ selectedRecord.evidence }}</p>
            </div>
            
            <div v-if="selectedRecord.balancedThought">
              <h4 class="font-semibold text-green-800 dark:text-green-200 mb-2">الفكرة المتوازنة</h4>
              <p class="text-gray-700 dark:text-gray-300">{{ selectedRecord.balancedThought }}</p>
            </div>
            
            <div v-if="selectedRecord.newEmotion">
              <h4 class="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">المشاعر الجديدة</h4>
              <p class="text-gray-700 dark:text-gray-300">
                {{ selectedRecord.newEmotion }} ({{ selectedRecord.newEmotionIntensity }}/10)
              </p>
            </div>
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

const showThoughtRecord = ref(false)
const showRecords = ref(false)
const selectedRecord = ref(null)

const thoughtRecord = ref({
  situation: '',
  automaticThought: '',
  emotion: '',
  emotionIntensity: 5,
  evidence: '',
  balancedThought: '',
  newEmotion: '',
  newEmotionIntensity: 5
})

const cbtTopics = [
  {
    id: 1,
    title: 'الأفكار التلقائية',
    description: 'فهم الأفكار السريعة التي تطرأ على الذهن',
    icon: '⚡',
    content: 'الأفكار التلقائية هي...'
  },
  {
    id: 2,
    title: 'التشويهات المعرفية',
    description: 'أنماط التفكير غير المفيدة',
    icon: '🌀',
    content: 'التشويهات المعرفية تشمل...'
  },
  {
    id: 3,
    title: 'إعادة التأطير المعرفي',
    description: 'تقنيات لتغيير طريقة التفكير',
    icon: '🔄',
    content: 'إعادة التأطير المعرفي يساعد في...'
  },
  {
    id: 4,
    title: 'العلاقة بين الأفكار والمشاعر',
    description: 'كيف تؤثر الأفكار على مشاعرنا',
    icon: '🔗',
    content: 'الأفكار والمشاعر مترابطة...'
  }
]

const isFormValid = computed(() => {
  return thoughtRecord.value.situation.trim() &&
         thoughtRecord.value.automaticThought.trim() &&
         thoughtRecord.value.emotion &&
         thoughtRecord.value.emotionIntensity > 0
})

const sortedRecords = computed(() => {
  return moodStore.thoughtRecords
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

function startThoughtRecord() {
  showThoughtRecord.value = true
  showRecords.value = false
}

function closeThoughtRecord() {
  showThoughtRecord.value = false
  resetForm()
}

function viewThoughtRecords() {
  showRecords.value = true
  showThoughtRecord.value = false
  moodStore.loadThoughtRecords()
}

function closeRecords() {
  showRecords.value = false
}

function resetForm() {
  thoughtRecord.value = {
    situation: '',
    automaticThought: '',
    emotion: '',
    emotionIntensity: 5,
    evidence: '',
    balancedThought: '',
    newEmotion: '',
    newEmotionIntensity: 5
  }
}

async function saveThoughtRecord() {
  const success = await moodStore.saveThought(thoughtRecord.value)
  if (success) {
    resetForm()
    showThoughtRecord.value = false
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

function learnTopic(topic) {
  // In a real app, this would open educational content
  alert(`موضوع: ${topic.title}\n\n${topic.description}\n\n${topic.content}`)
}

onMounted(() => {
  moodStore.loadThoughtRecords()
})
</script>
