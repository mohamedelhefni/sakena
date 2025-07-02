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

            <!-- Recent Entries -->
            <div v-if="moodStore.moodEntries.length > 0" class="bg-white rounded-2xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-4">التسجيلات السابقة</h2>

                <div class="space-y-4">
                    <div v-for="entry in moodStore.recentMoods" :key="entry.id"
                        class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center space-x-3 space-x-reverse">
                                <span class="w-6 h-6 rounded-full" :class="moodStore.getMoodColor(entry.mood)"></span>
                                <span class="font-medium">{{ moodStore.getMoodText(entry.mood) }}</span>
                                <span class="text-sm text-gray-500">({{ entry.mood }}/5)</span>
                            </div>
                            <div class="text-sm text-gray-500">
                                {{ formatDate(entry.date) }}
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 mb-3 text-sm">
                            <div class="flex items-center space-x-2 space-x-reverse">
                                <span class="text-gray-600">القلق:</span>
                                <span class="font-medium text-orange-600">{{ entry.anxiety }}/5</span>
                            </div>
                            <div class="flex items-center space-x-2 space-x-reverse">
                                <span class="text-gray-600">الاكتئاب:</span>
                                <span class="font-medium text-purple-600">{{ entry.depression }}/5</span>
                            </div>
                        </div>

                        <div v-if="entry.activities && entry.activities.length > 0" class="mb-3">
                            <span class="text-sm text-gray-600">الأنشطة: </span>
                            <span class="text-sm">{{ entry.activities.join('، ') }}</span>
                        </div>

                        <div v-if="entry.notes" class="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                            {{ entry.notes }}
                        </div>

                        <button @click="deleteMoodEntry(entry.id)"
                            class="mt-3 text-red-600 hover:text-red-700 text-sm font-medium">
                            حذف
                        </button>
                    </div>
                </div>

                <div v-if="moodStore.moodEntries.length > 7" class="mt-6 text-center">
                    <p class="text-gray-600">يتم عرض آخر 7 تسجيلات فقط</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useMoodStore } from '../stores/mood.js'

const moodStore = useMoodStore()

const newEntry = reactive({
    mood: null,
    anxiety: null,
    depression: null,
    activities: [],
    notes: ''
})

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

const toggleActivity = (activity) => {
    const index = newEntry.activities.indexOf(activity)
    if (index > -1) {
        newEntry.activities.splice(index, 1)
    } else {
        newEntry.activities.push(activity)
    }
}

const saveMoodEntry = async () => {
    await moodStore.saveMoodEntry(newEntry)

    // Reset form
    newEntry.mood = null
    newEntry.anxiety = null
    newEntry.depression = null
    newEntry.activities = []
    newEntry.notes = ''
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
