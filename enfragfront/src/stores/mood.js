import { defineStore } from 'pinia'
import database from '../utils/database.js'

export const useMoodStore = defineStore('mood', {
    state: () => ({
        moodEntries: [],
        currentMood: null,
        anxietyLevel: null,
        depressionLevel: null
    }),

    getters: {
        recentMoods: (state) => {
            return state.moodEntries
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 7)
        },

        averageMood: (state) => {
            if (state.moodEntries.length === 0) return 0
            const sum = state.moodEntries.reduce((acc, entry) => acc + entry.mood, 0)
            return Math.round(sum / state.moodEntries.length)
        },

        averageAnxiety: (state) => {
            const anxietyEntries = state.moodEntries.filter(entry => entry.anxiety !== undefined)
            if (anxietyEntries.length === 0) return 0
            const sum = anxietyEntries.reduce((acc, entry) => acc + entry.anxiety, 0)
            return Math.round(sum / anxietyEntries.length)
        },

        averageDepression: (state) => {
            const depressionEntries = state.moodEntries.filter(entry => entry.depression !== undefined)
            if (depressionEntries.length === 0) return 0
            const sum = depressionEntries.reduce((acc, entry) => acc + entry.depression, 0)
            return Math.round(sum / depressionEntries.length)
        }
    },

    actions: {
        async loadMoodData() {
            try {
                const data = database.getData('moodEntries')
                this.moodEntries = data || []
            } catch (error) {
                console.error('Error loading mood data:', error)
                this.moodEntries = []
            }
        },

        async saveMoodEntry(entry) {
            const moodEntry = {
                id: Date.now(),
                date: new Date().toISOString(),
                mood: entry.mood,
                anxiety: entry.anxiety,
                depression: entry.depression,
                notes: entry.notes || '',
                activities: entry.activities || [],
                triggers: entry.triggers || []
            }

            this.moodEntries.push(moodEntry)
            await database.saveData('moodEntries', this.moodEntries)

            this.currentMood = moodEntry.mood
            this.anxietyLevel = moodEntry.anxiety
            this.depressionLevel = moodEntry.depression
        },

        async deleteMoodEntry(id) {
            this.moodEntries = this.moodEntries.filter(entry => entry.id !== id)
            await database.saveData('moodEntries', this.moodEntries)
        },

        getMoodText(level) {
            const moodTexts = {
                1: 'سيء جداً',
                2: 'سيء',
                3: 'متوسط',
                4: 'جيد',
                5: 'ممتاز'
            }
            return moodTexts[level] || 'غير محدد'
        },

        getMoodColor(level) {
            const colors = {
                1: 'bg-red-500',
                2: 'bg-orange-500',
                3: 'bg-yellow-500',
                4: 'bg-green-500',
                5: 'bg-emerald-500'
            }
            return colors[level] || 'bg-gray-500'
        }
    }
})
