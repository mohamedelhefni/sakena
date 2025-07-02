<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" dir="rtl">
        <div class="max-w-4xl mx-auto p-6">
            <!-- Header -->
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h1 class="text-2xl font-bold text-gray-800 mb-2">تتبع المزاج والحالة النفسية</h1>
                <p class="text-gray-600">سجل مزاجك ومستوى القلق والاكتئاب يومياً لفهم أنماط صحتك النفسية</p>
            </div>

            <!-- Mood Entry Form -->
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-4">تسجيل جديد</h2>

                <form @submit.prevent="saveMoodEntry" class="space-y-6">
                    <!-- Mood Rating -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">
                            كيف تشعر الآن؟ (المزاج العام)
                        </label>
                        <div class="grid grid-cols-5 gap-3">
                            <button v-for="mood in moodOptions" :key="mood.value" type="button"
                                @click="newEntry.mood = mood.value"
                                class="flex flex-col items-center p-4 rounded-xl border-2 transition-all"
                                :class="newEntry.mood === mood.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'">
                                <span class="text-2xl mb-2">{{ mood.emoji }}</span>
                                <span class="text-sm font-medium">{{ mood.label }}</span>
                                <span class="text-xs text-gray-500">{{ mood.value }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Anxiety Level -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">
                            مستوى القلق (1 = منخفض جداً، 5 = مرتفع جداً)
                        </label>
                        <div class="grid grid-cols-5 gap-3">
                            <button v-for="level in 5" :key="level" type="button" @click="newEntry.anxiety = level"
                                class="flex flex-col items-center p-3 rounded-lg border-2 transition-all"
                                :class="newEntry.anxiety === level ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'">
                                <div class="w-8 h-8 rounded-full mb-2" :class="getAnxietyColor(level)"></div>
                                <span class="text-sm font-medium">{{ level }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Depression Level -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">
                            مستوى الاكتئاب (1 = منخفض جداً، 5 = مرتفع جداً)
                        </label>
                        <div class="grid grid-cols-5 gap-3">
                            <button v-for="level in 5" :key="level" type="button" @click="newEntry.depression = level"
                                class="flex flex-col items-center p-3 rounded-lg border-2 transition-all"
                                :class="newEntry.depression === level ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'">
                                <div class="w-8 h-8 rounded-full mb-2" :class="getDepressionColor(level)"></div>
                                <span class="text-sm font-medium">{{ level }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Activities -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">
                            الأنشطة اليوم (اختياري)
                        </label>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <button v-for="activity in activityOptions" :key="activity" type="button"
                                @click="toggleActivity(activity)" class="p-3 rounded-lg border-2 text-sm transition-all"
                                :class="newEntry.activities.includes(activity) ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-300'">
                                {{ activity }}
                            </button>
                        </div>
                    </div>

                    <!-- Notes -->
                    <div>
                        <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
                            ملاحظات إضافية (اختياري)
                        </label>
                        <textarea id="notes" v-model="newEntry.notes" rows="3"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="اكتب أي ملاحظات إضافية عن مزاجك أو يومك..."></textarea>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" :disabled="!newEntry.mood || !newEntry.anxiety || !newEntry.depression"
                        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                        حفظ التسجيل
                    </button>
                </form>
            </div>

            <!-- Tabs -->
            <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
                <div class="flex border-b">
                    <button @click="activeTab = 'newEntry'"
                        class="px-4 py-2 mr-4 -mb-px font-medium text-lg transition-colors"
                        :class="activeTab === 'newEntry' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-500'">
                        تسجيل جديد
                    </button>
                    <button @click="activeTab = 'entries'"
                        class="px-4 py-2 -mb-px font-medium text-lg transition-colors"
                        :class="activeTab === 'entries' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-500'">
                        السجلات السابقة
                    </button>
                    <button @click="activeTab = 'analytics'"
                        class="px-4 py-2 -mb-px font-medium text-lg transition-colors"
                        :class="activeTab === 'analytics' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-500'">
                        التحليلات
                    </button>
                </div>
            </div>

            <!-- Recent Entries -->
            <div v-if="activeTab === 'entries'" class="bg-white rounded-2xl shadow-lg p-6">
                <!-- Search and Filter -->
                <div class="mb-6">
                    <div class="flex flex-wrap gap-4">
                        <div class="flex-1">
                            <input v-model="searchQuery" type="text" placeholder="بحث في السجلات..."
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                        <div>
                            <select v-model="filterActivity" 
                                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">كل الأنشطة</option>
                                <option v-for="activity in activityOptions" :key="activity" :value="activity">
                                    {{ activity }}
                                </option>
                            </select>
                        </div>
                        <div>
                            <select v-model="sortBy" 
                                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="date">الأحدث أولاً</option>
                                <option value="dateAsc">الأقدم أولاً</option>
                                <option value="mood">المزاج (تصاعدي)</option>
                                <option value="moodDesc">المزاج (تنازلي)</option>
                                <option value="anxiety">القلق (تصاعدي)</option>
                                <option value="depression">الاكتئاب (تصاعدي)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Mood Entries List -->
                <div v-if="filteredEntries.length > 0" class="space-y-4">
                    <div v-for="entry in filteredEntries" :key="entry.id"
                        class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        
                        <!-- Entry Header -->
                        <div @click="toggleEntryExpansion(entry.id)" 
                            class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                            <div class="flex items-center space-x-4 space-x-reverse">
                                <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                    :class="moodStore.getMoodColor(entry.mood)">
                                    {{ entry.mood }}
                                </div>
                                <div>
                                    <div class="font-medium">{{ moodStore.getMoodText(entry.mood) }}</div>
                                    <div class="text-xs text-gray-500">{{ formatDate(entry.date) }}</div>
                                </div>
                            </div>
                            <div class="flex items-center space-x-2 space-x-reverse">
                                <div class="flex space-x-1 space-x-reverse">
                                    <span class="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                                        قلق: {{ entry.anxiety }}/5
                                    </span>
                                    <span class="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                                        اكتئاب: {{ entry.depression }}/5
                                    </span>
                                </div>
                                <button class="text-gray-600">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        :class="{'transform rotate-180': expandedEntries.includes(entry.id)}">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                            d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Expanded Content -->
                        <div v-if="expandedEntries.includes(entry.id)" class="p-4 border-t border-gray-200 bg-gray-50">
                            <!-- Activities -->
                            <div v-if="entry.activities && entry.activities.length > 0" class="mb-4">
                                <h4 class="text-sm font-medium text-gray-700 mb-2">الأنشطة:</h4>
                                <div class="flex flex-wrap gap-2">
                                    <span v-for="activity in entry.activities" :key="activity"
                                        class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                        {{ activity }}
                                    </span>
                                </div>
                            </div>
                            
                            <!-- Notes -->
                            <div v-if="entry.notes" class="mb-4">
                                <h4 class="text-sm font-medium text-gray-700 mb-2">الملاحظات:</h4>
                                <div class="bg-white p-3 rounded border border-gray-200 text-sm text-gray-700">
                                    {{ entry.notes }}
                                </div>
                            </div>
                            
                            <!-- Actions -->
                            <div class="flex justify-end mt-3 space-x-2 space-x-reverse">
                                <button @click="editMoodEntry(entry)"
                                    class="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-100">
                                    تعديل
                                </button>
                                <button @click="deleteMoodEntry(entry.id)"
                                    class="px-3 py-1.5 bg-red-50 border border-red-300 text-red-600 rounded-md text-sm hover:bg-red-100">
                                    حذف
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- No Results Message -->
                <div v-else-if="searchQuery || filterActivity" class="p-12 text-center">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                        </path>
                    </svg>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">لا توجد نتائج</h3>
                    <p class="text-gray-600">جرب تغيير معايير البحث أو الفلترة</p>
                </div>

                <!-- No Entries Message -->
                <div v-else class="p-12 text-center">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                        </path>
                    </svg>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">لا توجد تسجيلات بعد</h3>
                    <p class="text-gray-600">ابدأ بتسجيل حالتك المزاجية اليومية</p>
                    <button @click="activeTab = 'newEntry'" 
                        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        تسجيل جديد
                    </button>
                </div>
            </div>

            <!-- Analytics View -->
            <div v-if="activeTab === 'analytics'" class="bg-white rounded-2xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-6">تحليلات الصحة النفسية</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div class="p-4 border border-gray-200 rounded-lg bg-blue-50">
                        <h3 class="text-lg font-semibold text-blue-800 mb-2">متوسط المزاج</h3>
                        <div class="text-3xl font-bold text-blue-600">{{ averageMood }}/5</div>
                        <div class="text-sm text-blue-700 mt-1">في آخر 30 يوم</div>
                    </div>
                    
                    <div class="p-4 border border-gray-200 rounded-lg bg-orange-50">
                        <h3 class="text-lg font-semibold text-orange-800 mb-2">متوسط القلق</h3>
                        <div class="text-3xl font-bold text-orange-600">{{ averageAnxiety }}/5</div>
                        <div class="text-sm text-orange-700 mt-1">في آخر 30 يوم</div>
                    </div>
                    
                    <div class="p-4 border border-gray-200 rounded-lg bg-purple-50">
                        <h3 class="text-lg font-semibold text-purple-800 mb-2">متوسط الاكتئاب</h3>
                        <div class="text-3xl font-bold text-purple-600">{{ averageDepression }}/5</div>
                        <div class="text-sm text-purple-700 mt-1">في آخر 30 يوم</div>
                    </div>
                </div>
                
                <h3 class="text-lg font-semibold text-gray-800 mb-4">الأنشطة الأكثر فعالية</h3>
                <div class="space-y-3 mb-6">
                    <div v-for="(activity, index) in topActivities" :key="activity.name"
                        class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div class="flex items-center space-x-3 space-x-reverse">
                            <span class="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">
                                {{ index + 1 }}
                            </span>
                            <span class="font-medium">{{ activity.name }}</span>
                        </div>
                        <div class="flex items-center">
                            <span class="text-sm text-gray-500 mr-2">مستوى المزاج:</span>
                            <span class="font-medium text-green-600">{{ activity.avgMood.toFixed(1) }}</span>
                        </div>
                    </div>
                </div>
                
                <div class="text-center mt-10 text-gray-500 text-sm">
                    <p>يتم تحديث التحليلات بشكل تلقائي مع إضافة المزيد من التسجيلات</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useMoodStore } from '../stores/mood.js'

const moodStore = useMoodStore()

// Tab control
const activeTab = ref('newEntry')

// Entry form
const newEntry = reactive({
    mood: null,
    anxiety: null,
    depression: null,
    activities: [],
    notes: ''
})

// Entry listing
const expandedEntries = ref([])
const searchQuery = ref('')
const filterActivity = ref('')
const sortBy = ref('date')

// Editing mode
const isEditing = ref(false)
const editingEntryId = ref(null)

// Options
const moodOptions = [
    { value: 1, emoji: '😢', label: 'سيء جداً' },
    { value: 2, emoji: '😔', label: 'سيء' },
    { value: 3, emoji: '😐', label: 'متوسط' },
    { value: 4, emoji: '😊', label: 'جيد' },
    { value: 5, emoji: '😄', label: 'ممتاز' }
]

const activityOptions = [
    'تمارين رياضية',
    'قراءة',
    'مشاهدة التلفاز',
    'الطبخ',
    'الخروج مع الأصدقاء',
    'العمل',
    'الدراسة',
    'التأمل',
    'الموسيقى',
    'الرسم',
    'النوم الجيد',
    'تناول طعام صحي'
]

// Filtered entries
const filteredEntries = computed(() => {
    let entries = [...moodStore.moodEntries]
    
    // Apply search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        entries = entries.filter(entry => {
            // Search in notes
            if (entry.notes && entry.notes.toLowerCase().includes(query)) {
                return true
            }
            
            // Search in activities
            if (entry.activities && entry.activities.some(activity => activity.toLowerCase().includes(query))) {
                return true
            }
            
            // Search in mood text
            if (moodStore.getMoodText(entry.mood).toLowerCase().includes(query)) {
                return true
            }
            
            return false
        })
    }
    
    // Apply activity filter
    if (filterActivity.value) {
        entries = entries.filter(entry => 
            entry.activities && entry.activities.includes(filterActivity.value)
        )
    }
    
    // Apply sorting
    switch (sortBy.value) {
        case 'date':
            entries.sort((a, b) => new Date(b.date) - new Date(a.date))
            break
        case 'dateAsc':
            entries.sort((a, b) => new Date(a.date) - new Date(b.date))
            break
        case 'mood':
            entries.sort((a, b) => a.mood - b.mood)
            break
        case 'moodDesc':
            entries.sort((a, b) => b.mood - a.mood)
            break
        case 'anxiety':
            entries.sort((a, b) => a.anxiety - b.anxiety)
            break
        case 'depression':
            entries.sort((a, b) => a.depression - b.depression)
            break
    }
    
    return entries
})

// Analytics
const averageMood = computed(() => {
    const entries = moodStore.moodEntries.filter(entry => {
        const entryDate = new Date(entry.date)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return entryDate >= thirtyDaysAgo
    })
    
    if (entries.length === 0) return 0
    
    const sum = entries.reduce((total, entry) => total + entry.mood, 0)
    return (sum / entries.length).toFixed(1)
})

const averageAnxiety = computed(() => {
    const entries = moodStore.moodEntries.filter(entry => {
        const entryDate = new Date(entry.date)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return entryDate >= thirtyDaysAgo
    })
    
    if (entries.length === 0) return 0
    
    const sum = entries.reduce((total, entry) => total + entry.anxiety, 0)
    return (sum / entries.length).toFixed(1)
})

const averageDepression = computed(() => {
    const entries = moodStore.moodEntries.filter(entry => {
        const entryDate = new Date(entry.date)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return entryDate >= thirtyDaysAgo
    })
    
    if (entries.length === 0) return 0
    
    const sum = entries.reduce((total, entry) => total + entry.depression, 0)
    return (sum / entries.length).toFixed(1)
})

const topActivities = computed(() => {
    // Group entries by activity and calculate average mood for each activity
    const activityStats = {}
    
    moodStore.moodEntries.forEach(entry => {
        if (entry.activities && entry.activities.length) {
            entry.activities.forEach(activity => {
                if (!activityStats[activity]) {
                    activityStats[activity] = {
                        count: 0,
                        totalMood: 0
                    }
                }
                
                activityStats[activity].count++
                activityStats[activity].totalMood += entry.mood
            })
        }
    })
    
    // Convert to array and sort by average mood
    const result = Object.keys(activityStats)
        .filter(activity => activityStats[activity].count >= 2) // At least 2 entries
        .map(activity => ({
            name: activity,
            count: activityStats[activity].count,
            avgMood: activityStats[activity].totalMood / activityStats[activity].count
        }))
        .sort((a, b) => b.avgMood - a.avgMood)
    
    return result.slice(0, 5) // Return top 5
})

// Color getters
const getAnxietyColor = (level) => {
    const colors = {
        1: 'bg-green-200',
        2: 'bg-yellow-200',
        3: 'bg-yellow-400',
        4: 'bg-orange-400',
        5: 'bg-red-400'
    }
    return colors[level] || 'bg-gray-200'
}

const getDepressionColor = (level) => {
    const colors = {
        1: 'bg-blue-200',
        2: 'bg-indigo-200',
        3: 'bg-purple-300',
        4: 'bg-purple-400',
        5: 'bg-purple-600'
    }
    return colors[level] || 'bg-gray-200'
}

// Actions
const toggleActivity = (activity) => {
    const index = newEntry.activities.indexOf(activity)
    if (index > -1) {
        newEntry.activities.splice(index, 1)
    } else {
        newEntry.activities.push(activity)
    }
}

const toggleEntryExpansion = (id) => {
    const index = expandedEntries.value.indexOf(id)
    if (index > -1) {
        expandedEntries.value.splice(index, 1)
    } else {
        expandedEntries.value.push(id)
    }
}

const saveMoodEntry = async () => {
    if (isEditing.value) {
        // Update existing entry
        const entryIndex = moodStore.moodEntries.findIndex(e => e.id === editingEntryId.value)
        if (entryIndex !== -1) {
            const updatedEntry = {
                ...moodStore.moodEntries[entryIndex],
                mood: newEntry.mood,
                anxiety: newEntry.anxiety,
                depression: newEntry.depression,
                activities: [...newEntry.activities],
                notes: newEntry.notes,
                modifiedDate: new Date().toISOString()
            }
            
            await moodStore.updateMoodEntry(updatedEntry)
            
            // Reset edit mode
            isEditing.value = false
            editingEntryId.value = null
        }
    } else {
        // Create new entry
        await moodStore.saveMoodEntry(newEntry)
    }

    // Reset form
    newEntry.mood = null
    newEntry.anxiety = null
    newEntry.depression = null
    newEntry.activities = []
    newEntry.notes = ''
    
    // Switch to entries tab
    activeTab.value = 'entries'
}

const editMoodEntry = (entry) => {
    // Set editing state
    isEditing.value = true
    editingEntryId.value = entry.id
    
    // Populate form with entry data
    newEntry.mood = entry.mood
    newEntry.anxiety = entry.anxiety
    newEntry.depression = entry.depression
    newEntry.activities = [...entry.activities]
    newEntry.notes = entry.notes
    
    // Switch to entry form tab
    activeTab.value = 'newEntry'
}

const deleteMoodEntry = async (id) => {
    if (confirm('هل أنت متأكد من حذف هذا التسجيل؟')) {
        await moodStore.deleteMoodEntry(id)
    }
}

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
