import { defineStore } from 'pinia'
import { ref } from 'vue'
import { saveEmergencyContact, getEmergencyContacts, deleteEmergencyContact } from '@/utils/database'

export const useEmergencyStore = defineStore('emergency', () => {
  const emergencyContacts = ref([])
  const isLoading = ref(false)

  // Static hotlines (Arabic countries + international)
  const staticHotlines = ref([
    {
      id: 'egypt',
      name: 'خط المساعدة النفسية - مصر',
      number: '16328',
      country: 'مصر',
      available: '24/7'
    },
    {
      id: 'saudi',
      name: 'مركز الدعم النفسي - السعودية',
      number: '920033360',
      country: 'السعودية',
      available: '24/7'
    },
    {
      id: 'uae',
      name: 'خط الأمان النفسي - الإمارات',
      number: '800988',
      country: 'الإمارات',
      available: '24/7'
    },
    {
      id: 'jordan',
      name: 'خط المساعدة النفسية - الأردن',
      number: '110',
      country: 'الأردن',
      available: '24/7'
    },
    {
      id: 'lebanon',
      name: 'الخط الساخن للصحة النفسية - لبنان',
      number: '1564',
      country: 'لبنان',
      available: '24/7'
    },
    {
      id: 'international',
      name: 'International Suicide Prevention',
      number: '1-800-273-8255',
      country: 'International',
      available: '24/7'
    }
  ])

  async function addEmergencyContact(contactData) {
    isLoading.value = true
    try {
      await saveEmergencyContact(contactData)
      await loadEmergencyContacts()
      return true
    } catch (error) {
      console.error('Failed to save emergency contact:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function loadEmergencyContacts() {
    isLoading.value = true
    try {
      emergencyContacts.value = await getEmergencyContacts()
    } catch (error) {
      console.error('Failed to load emergency contacts:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function removeEmergencyContact(id) {
    isLoading.value = true
    try {
      await deleteEmergencyContact(id)
      await loadEmergencyContacts()
      return true
    } catch (error) {
      console.error('Failed to delete emergency contact:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    emergencyContacts,
    staticHotlines,
    isLoading,
    addEmergencyContact,
    loadEmergencyContacts,
    removeEmergencyContact
  }
})
