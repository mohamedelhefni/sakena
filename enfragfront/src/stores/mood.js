import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  saveMoodLog, 
  getMoodLogs, 
  saveJournalEntry, 
  getJournalEntries,
  saveThoughtRecord,
  getThoughtRecords
} from '@/utils/database'

export const useMoodStore = defineStore('mood', () => {
  const currentMood = ref(null)
  const moodHistory = ref([])
  const journalEntries = ref([])
  const thoughtRecords = ref([])
  const isLoading = ref(false)

  // Mood tracking
  async function logMood(moodData) {
    isLoading.value = true
    try {
      const entry = {
        date: new Date().toISOString(),
        mood: moodData.mood,
        energy: moodData.energy,
        anxiety: moodData.anxiety,
        notes: moodData.notes || '',
        activities: moodData.activities || []
      }
      
      await saveMoodLog(entry)
      await loadMoodHistory()
      return true
    } catch (error) {
      console.error('Failed to save mood log:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function loadMoodHistory(days = 30) {
    isLoading.value = true
    try {
      const endDate = new Date().toISOString()
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
      
      moodHistory.value = await getMoodLogs(startDate, endDate)
    } catch (error) {
      console.error('Failed to load mood history:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Journal functionality
  async function saveJournal(content, prompt = '') {
    isLoading.value = true
    try {
      const entry = {
        date: new Date().toISOString(),
        content,
        prompt,
        wordCount: content.split(' ').length
      }
      
      await saveJournalEntry(entry)
      await loadJournalHistory()
      return true
    } catch (error) {
      console.error('Failed to save journal entry:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function loadJournalHistory(days = 30) {
    isLoading.value = true
    try {
      const endDate = new Date().toISOString()
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
      
      journalEntries.value = await getJournalEntries(startDate, endDate)
    } catch (error) {
      console.error('Failed to load journal entries:', error)
    } finally {
      isLoading.value = false
    }
  }

  // CBT Thought Records
  async function saveThought(thoughtData) {
    isLoading.value = true
    try {
      const record = {
        date: new Date().toISOString(),
        situation: thoughtData.situation,
        automaticThought: thoughtData.automaticThought,
        emotion: thoughtData.emotion,
        emotionIntensity: thoughtData.emotionIntensity,
        evidence: thoughtData.evidence || '',
        balancedThought: thoughtData.balancedThought || '',
        newEmotion: thoughtData.newEmotion || '',
        newEmotionIntensity: thoughtData.newEmotionIntensity || 0
      }
      
      await saveThoughtRecord(record)
      await loadThoughtRecords()
      return true
    } catch (error) {
      console.error('Failed to save thought record:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function loadThoughtRecords(days = 30) {
    isLoading.value = true
    try {
      const endDate = new Date().toISOString()
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
      
      thoughtRecords.value = await getThoughtRecords(startDate, endDate)
    } catch (error) {
      console.error('Failed to load thought records:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    currentMood,
    moodHistory,
    journalEntries,
    thoughtRecords,
    isLoading,
    logMood,
    loadMoodHistory,
    saveJournal,
    loadJournalHistory,
    saveThought,
    loadThoughtRecords
  }
})
