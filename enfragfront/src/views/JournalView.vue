<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" dir="rtl">
        <div class="max-w-4xl mx-auto p-6">
            <!-- Header -->
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h1 class="text-2xl font-bold text-gray-800 mb-2">المفكرة الشخصية</h1>
                <p class="text-gray-600">مكان آمن للتعبير عن مشاعرك وأفكارك</p>
            </div>

            <!-- New Entry Form -->
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-4">كتابة جديدة</h2>

                <form @submit.prevent="saveJournalEntry" class="space-y-4">
                    <div>
                        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                            العنوان (اختياري)
                        </label>
                        <input id="title" v-model="newEntry.title" type="text"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="عنوان لمدخل المفكرة..." />
                    </div>

                    <div>
                        <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
                            المحتوى
                        </label>
                        <textarea id="content" v-model="newEntry.content" rows="8"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="اكتب مشاعرك وأفكارك هنا... هذا مكان آمن للتعبير عن نفسك" required></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-3">
                            المشاعر (اختياري)
                        </label>
                        <div class="grid grid-cols-3 md:grid-cols-6 gap-2">
                            <button v-for="emotion in emotionOptions" :key="emotion" type="button"
                                @click="toggleEmotion(emotion)" class="p-2 rounded-lg border text-sm transition-all"
                                :class="newEntry.emotions.includes(emotion) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300'">
                                {{ emotion }}
                            </button>
                        </div>
                    </div>

                    <button type="submit" :disabled="!newEntry.content.trim()"
                        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                        حفظ في المفكرة
                    </button>
                </form>
            </div>

            <!-- Journal Entries -->
            <div v-if="journalEntries.length > 0" class="space-y-6">
                <div v-for="entry in journalEntries" :key="entry.id" class="bg-white rounded-2xl shadow-lg p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <h3 v-if="entry.title" class="text-lg font-semibold text-gray-800">{{ entry.title }}</h3>
                            <p class="text-sm text-gray-500">{{ formatDate(entry.date) }}</p>
                        </div>
                        <button @click="deleteJournalEntry(entry.id)" class="text-red-600 hover:text-red-700 p-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                </path>
                            </svg>
                        </button>
                    </div>

                    <div class="prose prose-sm max-w-none mb-4">
                        <p class="text-gray-700 whitespace-pre-wrap">{{ entry.content }}</p>
                    </div>

                    <div v-if="entry.emotions && entry.emotions.length > 0" class="flex flex-wrap gap-2">
                        <span v-for="emotion in entry.emotions" :key="emotion"
                            class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {{ emotion }}
                        </span>
                    </div>
                </div>
            </div>

            <div v-else class="bg-white rounded-2xl shadow-lg p-12 text-center">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                    </path>
                </svg>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">ابدأ بكتابة أول مدخل</h3>
                <p class="text-gray-600">المفكرة الشخصية مكان آمن للتعبير عن مشاعرك وأفكارك</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import database from '../utils/database.js'

const journalEntries = ref([])

const newEntry = reactive({
    title: '',
    content: '',
    emotions: []
})

const emotionOptions = [
    'سعيد', 'حزين', 'قلق', 'متوتر', 'غاضب', 'محبط',
    'متفائل', 'يائس', 'متحمس', 'خائف', 'ممتن', 'وحيد'
]

const toggleEmotion = (emotion) => {
    const index = newEntry.emotions.indexOf(emotion)
    if (index > -1) {
        newEntry.emotions.splice(index, 1)
    } else {
        newEntry.emotions.push(emotion)
    }
}

const saveJournalEntry = async () => {
    const entry = {
        id: Date.now(),
        title: newEntry.title || null,
        content: newEntry.content,
        emotions: [...newEntry.emotions],
        date: new Date().toISOString()
    }

    journalEntries.value.unshift(entry)
    await database.saveData('journalEntries', journalEntries.value)

    // Reset form
    newEntry.title = ''
    newEntry.content = ''
    newEntry.emotions = []
}

const deleteJournalEntry = async (id) => {
    if (confirm('هل أنت متأكد من حذف هذا المدخل؟')) {
        journalEntries.value = journalEntries.value.filter(entry => entry.id !== id)
        await database.saveData('journalEntries', journalEntries.value)
    }
}

const loadJournalEntries = async () => {
    const data = database.getData('journalEntries')
    journalEntries.value = data || []
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

onMounted(loadJournalEntries)
</script>
