<template>
  <div class="min-h-screen bg-gradient-to-br from-soft-mint to-soft-peach dark:from-gray-900 dark:to-gray-800 p-4">
    <!-- Header -->
    <header class="flex items-center justify-between mb-6 pt-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">التحليلات والإحصائيات</h1>
        <p class="text-gray-600 dark:text-gray-300">تقارير عن تقدمك ونشاطك</p>
      </div>
      <RouterLink 
        to="/"
        class="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
      </RouterLink>
    </header>

    <!-- Date Range Selector -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-gray-800 dark:text-white">الفترة الزمنية</h3>
        <div class="flex space-x-2 space-x-reverse">
          <button
            v-for="period in timePeriods"
            :key="period.value"
            @click="selectedPeriod = period.value"
            class="px-3 py-1 rounded-lg text-sm transition-colors"
            :class="selectedPeriod === period.value 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'"
          >
            {{ period.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="mr-3">
            <p class="text-sm text-gray-600 dark:text-gray-300">مدخلات المزاج</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ stats.moodEntries }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 3a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="mr-3">
            <p class="text-sm text-gray-600 dark:text-gray-300">مدخلات اليوميات</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ stats.journalEntries }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="mr-3">
            <p class="text-sm text-gray-600 dark:text-gray-300">جلسات العلاج المعرفي</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ stats.cbtSessions }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
        <div class="flex items-center">
          <div class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <svg class="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <div class="mr-3">
            <p class="text-sm text-gray-600 dark:text-gray-300">أيام النشاط</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ stats.activeDays }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mood Chart -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">اتجاه المزاج</h3>
      <div class="h-64">
        <Line
          v-if="moodChartData.datasets[0].data.length > 0"
          :data="moodChartData"
          :options="chartOptions"
        />
        <div v-else class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          لا توجد بيانات كافية لعرض الرسم البياني
        </div>
      </div>
    </div>

    <!-- Activity Heatmap -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">خريطة النشاط</h3>
      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="day in activityHeatmap"
          :key="day.date"
          :title="`${day.date}: ${day.activities} نشاطات`"
          class="w-8 h-8 rounded border"
          :class="getHeatmapColor(day.activities)"
        ></div>
      </div>
      <div class="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-300">
        <span>أقل</span>
        <div class="flex space-x-1">
          <div class="w-3 h-3 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="w-3 h-3 rounded bg-primary-200 dark:bg-primary-800"></div>
          <div class="w-3 h-3 rounded bg-primary-400 dark:bg-primary-600"></div>
          <div class="w-3 h-3 rounded bg-primary-600 dark:bg-primary-400"></div>
          <div class="w-3 h-3 rounded bg-primary-800 dark:bg-primary-200"></div>
        </div>
        <span>أكثر</span>
      </div>
    </div>

    <!-- Insights -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">💡 ملاحظات</h3>
      <div class="space-y-3">
        <div v-for="insight in insights" :key="insight.id" class="flex items-start space-x-3 space-x-reverse">
          <div class="p-2 rounded-lg" :class="insight.color">
            <component :is="insight.icon" class="w-5 h-5" />
          </div>
          <div>
            <p class="font-medium text-gray-800 dark:text-white">{{ insight.title }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">{{ insight.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { useMoodStore } from '@/stores/mood'
import { database } from '@/utils/database'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const moodStore = useMoodStore()

const selectedPeriod = ref('week')
const stats = ref({
  moodEntries: 0,
  journalEntries: 0,
  cbtSessions: 0,
  activeDays: 0
})

const timePeriods = [
  { value: 'week', label: 'أسبوع' },
  { value: 'month', label: 'شهر' },
  { value: '3months', label: '3 أشهر' },
  { value: 'year', label: 'سنة' }
]

const moodChartData = computed(() => {
  const filteredData = getFilteredMoodData()
  return {
    labels: filteredData.map(item => item.date),
    datasets: [
      {
        label: 'المزاج',
        data: filteredData.map(item => item.mood),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      display: true,
      grid: {
        display: false
      }
    },
    y: {
      display: true,
      min: 1,
      max: 5,
      ticks: {
        stepSize: 1,
        callback: function(value) {
          const labels = ['', 'حزين', 'عادي', 'جيد', 'سعيد', 'رائع']
          return labels[value]
        }
      }
    }
  }
}

const activityHeatmap = computed(() => {
  const days = []
  const today = new Date()
  
  for (let i = 90; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const dateStr = date.toISOString().split('T')[0]
    const activities = Math.floor(Math.random() * 5) // Mock data
    
    days.push({
      date: dateStr,
      activities
    })
  }
  
  return days
})

const insights = computed(() => {
  const insights = []
  
  if (stats.value.moodEntries >= 7) {
    insights.push({
      id: 1,
      title: 'نشاط ممتاز في تتبع المزاج',
      description: 'حافظت على تسجيل مزاجك بانتظام هذا الأسبوع',
      color: 'bg-green-100 dark:bg-green-900 text-green-600',
      icon: 'CheckIcon'
    })
  }
  
  if (stats.value.journalEntries < 3) {
    insights.push({
      id: 2,
      title: 'جرب كتابة اليوميات أكثر',
      description: 'الكتابة يمكن أن تساعد في تحسين المزاج والوضوح الذهني',
      color: 'bg-blue-100 dark:bg-blue-900 text-blue-600',
      icon: 'LightBulbIcon'
    })
  }
  
  return insights
})

function getFilteredMoodData() {
  const now = new Date()
  let startDate = new Date()
  
  switch (selectedPeriod.value) {
    case 'week':
      startDate.setDate(now.getDate() - 7)
      break
    case 'month':
      startDate.setMonth(now.getMonth() - 1)
      break
    case '3months':
      startDate.setMonth(now.getMonth() - 3)
      break
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1)
      break
  }
  
  return moodStore.moodHistory
    .filter(entry => new Date(entry.date) >= startDate)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

function getHeatmapColor(activities) {
  if (activities === 0) return 'bg-gray-200 dark:bg-gray-700'
  if (activities === 1) return 'bg-primary-200 dark:bg-primary-800'
  if (activities === 2) return 'bg-primary-400 dark:bg-primary-600'
  if (activities === 3) return 'bg-primary-600 dark:bg-primary-400'
  return 'bg-primary-800 dark:bg-primary-200'
}

async function loadStats() {
  try {
    // Load mood entries
    const moodEntries = await database.getMoodLogs()
    stats.value.moodEntries = moodEntries.length
    
    // Load journal entries
    const journalEntries = await database.getJournalEntries()
    stats.value.journalEntries = journalEntries.length
    
    // Load CBT sessions
    const cbtSessions = await database.getCBTRecords()
    stats.value.cbtSessions = cbtSessions.length
    
    // Calculate active days
    const allDates = new Set([
      ...moodEntries.map(e => e.date),
      ...journalEntries.map(e => e.date),
      ...cbtSessions.map(e => e.date)
    ])
    stats.value.activeDays = allDates.size
    
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

onMounted(() => {
  moodStore.loadMoodHistory()
  loadStats()
})
</script>
