<template>
    <div dir="rtl">
        <!-- Header -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h1 class="text-2xl font-bold text-gray-800 mb-2">المفكرة الشخصية</h1>
            <p class="text-gray-600">مكان آمن للتعبير عن مشاعرك وأفكارك</p>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <div class="flex border-b">
                <button @click="activeTab = 'write'"
                    class="px-4 py-2 mr-4 -mb-px font-medium text-lg transition-colors"
                    :class="activeTab === 'write' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-500'">
                    كتابة جديدة
                </button>
                <button @click="activeTab = 'entries'"
                    class="px-4 py-2 -mb-px font-medium text-lg transition-colors"
                    :class="activeTab === 'entries' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-500'">
                    المدخلات السابقة
                </button>
            </div>
        </div>

        <!-- New Entry Form -->
        <div v-if="activeTab === 'write'" class="bg-white rounded-2xl shadow-lg p-6 mb-6">
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
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        المحتوى
                    </label>
                    <!-- Rich Text Editor -->
                    <div class="border border-gray-300 rounded-lg mb-2">
                        <!-- Editor Menu -->
                        <div v-if="editor" class="flex flex-wrap items-center bg-gray-50 p-2 border-b border-gray-300 gap-1">
                            <button @click.prevent="editor.chain().focus().toggleBold().run()"
                                :class="{ 'bg-blue-100 text-blue-600': editor && editor.isActive('bold') }"
                                class="p-1.5 rounded hover:bg-gray-100" title="عريض">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h8a4 4 0 004-4 4 4 0 00-4-4H6M6 12h8a4 4 0 010 8H6"></path>
                                </svg>
                            </button>
                            <button @click.prevent="editor.chain().focus().toggleItalic().run()"
                                :class="{ 'bg-blue-100 text-blue-600': editor && editor.isActive('italic') }"
                                class="p-1.5 rounded hover:bg-gray-100" title="مائل">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                            </button>
                            <span class="w-px h-6 mx-1 bg-gray-300"></span>
                            <button @click.prevent="editor.chain().focus().toggleBulletList().run()"
                                :class="{ 'bg-blue-100 text-blue-600': editor && editor.isActive('bulletList') }"
                                class="p-1.5 rounded hover:bg-gray-100" title="قائمة نقطية">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </button>
                            <button @click.prevent="editor.chain().focus().toggleOrderedList().run()"
                                :class="{ 'bg-blue-100 text-blue-600': editor && editor.isActive('orderedList') }"
                                class="p-1.5 rounded hover:bg-gray-100" title="قائمة رقمية">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h10M7 16h10M3 8h.01M3 12h.01M3 16h.01"></path>
                                </svg>
                            </button>
                            <span class="w-px h-6 mx-1 bg-gray-300"></span>
                            <button @click.prevent="editor.chain().focus().setTextAlign('right').run()"
                                :class="{ 'bg-blue-100 text-blue-600': editor && editor.isActive({ textAlign: 'right' }) }"
                                class="p-1.5 rounded hover:bg-gray-100" title="محاذاة لليمين">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h16"></path>
                                </svg>
                            </button>
                            <button @click.prevent="editor.chain().focus().setTextAlign('center').run()"
                                :class="{ 'bg-blue-100 text-blue-600': editor && editor.isActive({ textAlign: 'center' }) }"
                                class="p-1.5 rounded hover:bg-gray-100" title="توسيط">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M8 12h8M4 18h16"></path>
                                </svg>
                            </button>
                            <button @click.prevent="editor.chain().focus().setHighlight().run()"
                                :class="{ 'bg-blue-100 text-blue-600': editor && editor.isActive('highlight') }"
                                class="p-1.5 rounded hover:bg-gray-100" title="تمييز النص">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                </svg>
                            </button>
                        </div>
                        <!-- Editor Content -->
                        <div class="p-4">
                            <editor-content v-if="editor" :editor="editor" class="min-h-[200px] prose max-w-none" />
                            <div v-else class="min-h-[200px] flex items-center justify-center text-gray-500">
                                جاري تحميل المحرر...
                            </div>
                        </div>
                    </div>
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

                <button type="submit" :disabled="!editor || !editor.getText().trim()"
                    class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                    حفظ في المفكرة
                </button>
            </form>
        </div>

        <!-- Journal Entries -->
        <div v-if="activeTab === 'entries'" class="space-y-6">
            <!-- Search and Filter -->
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div class="flex flex-wrap gap-4">
                    <div class="flex-1">
                        <input v-model="searchQuery" type="text" placeholder="بحث في المدخلات..."
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                        <select v-model="filterEmotion" 
                            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">كل المشاعر</option>
                            <option v-for="emotion in emotionOptions" :key="emotion" :value="emotion">
                                {{ emotion }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <select v-model="sortOrder" 
                            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="newest">الأحدث أولاً</option>
                            <option value="oldest">الأقدم أولاً</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Entries List -->
            <div v-if="filteredEntries.length > 0" class="space-y-6">
                <div v-for="entry in filteredEntries" :key="entry.id" 
                    class="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <!-- Entry header with expand/collapse -->
                    <div @click="toggleEntryExpansion(entry.id)"
                        class="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                        :class="{'border-b border-gray-200': expandedEntries.includes(entry.id)}">
                        <div class="flex items-center space-x-3 space-x-reverse">
                            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                    </path>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-800">{{ entry.title || 'بدون عنوان' }}</h3>
                                <p class="text-xs text-gray-500">{{ formatDate(entry.date) }}</p>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2 space-x-reverse">
                            <button class="text-gray-600 p-2" title="عرض/إخفاء">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    :class="{'transform rotate-180': expandedEntries.includes(entry.id)}">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                        d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Expanded content -->
                    <div v-if="expandedEntries.includes(entry.id)" class="p-6">
                        <!-- Content -->
                        <div class="prose max-w-none mb-6" v-html="entry.content"></div>
                        
                        <!-- Emotions tags -->
                        <div v-if="entry.emotions && entry.emotions.length > 0" class="flex flex-wrap gap-2 mb-4">
                            <span v-for="emotion in entry.emotions" :key="emotion"
                                class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {{ emotion }}
                            </span>
                        </div>
                        
                        <!-- Actions -->
                        <div class="flex justify-end border-t pt-4 space-x-2 space-x-reverse">
                            <button @click="editEntry(entry)"
                                class="px-3 py-1.5 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                                تعديل
                            </button>
                            <button @click="deleteJournalEntry(entry.id)"
                                class="px-3 py-1.5 bg-red-50 border border-red-300 text-red-600 rounded-md text-sm hover:bg-red-100">
                                حذف
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="bg-white rounded-2xl shadow-lg p-12 text-center">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                    </path>
                </svg>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">لا توجد مدخلات</h3>
                <p class="text-gray-600">ابدأ بكتابة مدخلات جديدة في المفكرة الشخصية</p>
                <button @click="activeTab = 'write'" 
                    class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    كتابة مدخل جديد
                </button>
            </div>
        </div>

        <!-- Edit Modal -->
        <div v-if="showEditModal" class="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-gray-800">تعديل المدخل</h2>
                    <button @click="showEditModal = false" class="text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                        <input v-model="editingEntry.title" type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">المحتوى</label>
                        <div class="border border-gray-300 rounded-lg p-4 min-h-[200px]">
                            <editor-content v-if="editingEditor" :editor="editingEditor" />
                            <div v-else class="min-h-[200px] flex items-center justify-center text-gray-500">
                                جاري تحميل المحرر...
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">المشاعر</label>
                        <div class="grid grid-cols-3 md:grid-cols-6 gap-2">
                            <button v-for="emotion in emotionOptions" :key="emotion" type="button"
                                @click="toggleEditEmotion(emotion)" class="p-2 rounded-lg border text-sm transition-all"
                                :class="editingEntry.emotions.includes(emotion) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300'">
                                {{ emotion }}
                            </button>
                        </div>
                    </div>
                    
                    <div class="flex justify-end space-x-3 space-x-reverse mt-6">
                        <button @click="showEditModal = false"
                            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                            إلغاء
                        </button>
                        <button @click="saveEditedEntry"
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            حفظ التغييرات
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import database from '../utils/database.js'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'

// Tab control
const activeTab = ref('write')

// Journal entries and filters
const journalEntries = ref([])
const expandedEntries = ref([])
const searchQuery = ref('')
const filterEmotion = ref('')
const sortOrder = ref('newest')

// New entry form
const newEntry = reactive({
    title: '',
    emotions: []
})

// Rich text editor
const editor = shallowRef(null)

// Edit modal
const showEditModal = ref(false)
const editingEntry = reactive({
    id: null,
    title: '',
    content: '',
    emotions: []
})
const editingEditor = shallowRef(null)

const emotionOptions = [
    'سعيد', 'حزين', 'قلق', 'متوتر', 'غاضب', 'محبط',
    'متفائل', 'يائس', 'متحمس', 'خائف', 'ممتن', 'وحيد'
]

// Entry filtering and sorting
const filteredEntries = computed(() => {
    let result = [...journalEntries.value]
    
    // Text search
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(entry => 
            (entry.title && entry.title.toLowerCase().includes(query)) || 
            entry.content.toLowerCase().includes(query)
        )
    }
    
    // Emotion filter
    if (filterEmotion.value) {
        result = result.filter(entry => 
            entry.emotions && entry.emotions.includes(filterEmotion.value)
        )
    }
    
    // Sort order
    if (sortOrder.value === 'oldest') {
        result.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else {
        result.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
    
    return result
})

// Toggle emotion selection
const toggleEmotion = (emotion) => {
    const index = newEntry.emotions.indexOf(emotion)
    if (index > -1) {
        newEntry.emotions.splice(index, 1)
    } else {
        newEntry.emotions.push(emotion)
    }
}

const toggleEditEmotion = (emotion) => {
    const index = editingEntry.emotions.indexOf(emotion)
    if (index > -1) {
        editingEntry.emotions.splice(index, 1)
    } else {
        editingEntry.emotions.push(emotion)
    }
}

// Save new journal entry
const saveJournalEntry = async () => {
    if (!editor.value) return

    const htmlContent = editor.value.getHTML()
    
    const entry = {
        id: Date.now(),
        title: newEntry.title || 'بدون عنوان',
        content: htmlContent,
        emotions: [...newEntry.emotions],
        date: new Date().toISOString()
    }

    journalEntries.value.unshift(entry)
    await database.saveData('journalEntries', journalEntries.value)

    // Reset form
    newEntry.title = ''
    newEntry.emotions = []
    editor.value.commands.clearContent()
    
    // Switch to entries tab
    activeTab.value = 'entries'
}

// Delete journal entry
const deleteJournalEntry = async (id) => {
    if (confirm('هل أنت متأكد من حذف هذا المدخل؟')) {
        journalEntries.value = journalEntries.value.filter(entry => entry.id !== id)
        await database.saveData('journalEntries', journalEntries.value)
    }
}

// Toggle entry expansion
const toggleEntryExpansion = (id) => {
    const index = expandedEntries.value.indexOf(id)
    if (index > -1) {
        expandedEntries.value.splice(index, 1)
    } else {
        expandedEntries.value.push(id)
    }
}

// Edit entry
const editEntry = (entry) => {
    editingEntry.id = entry.id
    editingEntry.title = entry.title || ''
    editingEntry.emotions = [...(entry.emotions || [])]
    
    // Initialize editor with content
    if (editingEditor.value) {
        editingEditor.value.destroy()
    }
    
    editingEditor.value = new Editor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Highlight,
            Placeholder.configure({
                placeholder: 'محتوى المدخل هنا...',
            }),
        ],
        content: entry.content,
        autofocus: true,
        editable: true
    })
    
    showEditModal.value = true
}

// Save edited entry
const saveEditedEntry = async () => {
    if (!editingEditor.value) return
    
    const entryIndex = journalEntries.value.findIndex(entry => entry.id === editingEntry.id)
    if (entryIndex !== -1) {
        journalEntries.value[entryIndex] = {
            ...journalEntries.value[entryIndex],
            title: editingEntry.title || 'بدون عنوان',
            content: editingEditor.value.getHTML(),
            emotions: [...editingEntry.emotions],
            modifiedDate: new Date().toISOString()
        }
        
        await database.saveData('journalEntries', journalEntries.value)
    }
    
    showEditModal.value = false
}

// Format date for display
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Load saved entries
const loadJournalEntries = async () => {
    const data = database.getData('journalEntries') || []
    journalEntries.value = data.map(entry => ({
        ...entry,
        // Ensure HTML content for older entries that might be plain text
        content: entry.content && entry.content.startsWith('<') ? entry.content : `<p>${entry.content || ''}</p>`
    }))
}

// Lifecycle hooks
onMounted(() => {
    // Initialize editor
    editor.value = new Editor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Highlight,
            Placeholder.configure({
                placeholder: 'اكتب مشاعرك وأفكارك هنا... هذا مكان آمن للتعبير عن نفسك',
            }),
        ],
        autofocus: true,
        editable: true
    })
    
    loadJournalEntries()
})

onBeforeUnmount(() => {
    if (editor.value) {
        editor.value.destroy()
    }
    if (editingEditor.value) {
        editingEditor.value.destroy()
    }
})
</script>

<style>
/* TipTap Editor Styling */
.ProseMirror {
    min-height: 150px;
    outline: none;
}

.ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: right;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
}

.ProseMirror p {
    margin: 0.5em 0;
}

.ProseMirror ul, .ProseMirror ol {
    padding: 0 1.2em;
    margin: 0.5em 0;
}

.ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
    margin: 1em 0 0.5em;
}

.ProseMirror mark {
    background-color: #fef3c7;
    border-radius: 0.125rem;
    padding: 0.1em 0.2em;
}
</style>
