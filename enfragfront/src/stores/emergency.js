import { defineStore } from 'pinia'
import database from '../utils/database.js'

export const useEmergencyStore = defineStore('emergency', {
    state: () => ({
        emergencyContacts: [],
        copingStrategies: [],
        safetyPlan: null
    }),

    actions: {
        async loadEmergencyData() {
            try {
                this.emergencyContacts = database.getData('emergencyContacts') || []
                this.copingStrategies = database.getData('copingStrategies') || []
                this.safetyPlan = database.getData('safetyPlan') || null
            } catch (error) {
                console.error('Error loading emergency data:', error)
            }
        },

        async addEmergencyContact(contact) {
            const newContact = {
                id: Date.now(),
                name: contact.name,
                phone: contact.phone,
                relationship: contact.relationship,
                notes: contact.notes || ''
            }

            this.emergencyContacts.push(newContact)
            await database.saveData('emergencyContacts', this.emergencyContacts)
        },

        async removeEmergencyContact(id) {
            this.emergencyContacts = this.emergencyContacts.filter(contact => contact.id !== id)
            await database.saveData('emergencyContacts', this.emergencyContacts)
        },

        async addCopingStrategy(strategy) {
            const newStrategy = {
                id: Date.now(),
                title: strategy.title,
                description: strategy.description,
                category: strategy.category,
                effectiveness: strategy.effectiveness || 3
            }

            this.copingStrategies.push(newStrategy)
            await database.saveData('copingStrategies', this.copingStrategies)
        },

        async removeCopingStrategy(id) {
            this.copingStrategies = this.copingStrategies.filter(strategy => strategy.id !== id)
            await database.saveData('copingStrategies', this.copingStrategies)
        },

        async updateSafetyPlan(plan) {
            this.safetyPlan = {
                warningSignals: plan.warningSignals || [],
                copingStrategies: plan.copingStrategies || [],
                distractions: plan.distractions || [],
                supportContacts: plan.supportContacts || [],
                environmentSafety: plan.environmentSafety || '',
                professionalContacts: plan.professionalContacts || []
            }

            await database.saveData('safetyPlan', this.safetyPlan)
        },

        getDefaultCopingStrategies() {
            return [
                {
                    id: 1,
                    title: 'تمارين التنفس العميق',
                    description: 'خذ نفساً عميقاً لمدة 4 ثوانٍ، احبسه لمدة 4 ثوانٍ، ثم أخرجه لمدة 6 ثوانٍ',
                    category: 'relaxation',
                    effectiveness: 4
                },
                {
                    id: 2,
                    title: 'المشي أو التمارين الخفيفة',
                    description: 'اذهب في نزهة قصيرة أو قم ببعض التمارين الخفيفة لتحسين مزاجك',
                    category: 'physical',
                    effectiveness: 4
                },
                {
                    id: 3,
                    title: 'الكتابة في المفكرة',
                    description: 'اكتب مشاعرك وأفكارك للتعبير عنها ومعالجتها',
                    category: 'emotional',
                    effectiveness: 3
                },
                {
                    id: 4,
                    title: 'التواصل مع صديق',
                    description: 'تحدث مع شخص تثق به حول ما تشعر به',
                    category: 'social',
                    effectiveness: 5
                }
            ]
        }
    }
})
