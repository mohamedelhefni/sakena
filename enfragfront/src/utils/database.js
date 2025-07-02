import encryptionService from './encryption.js'

class LocalDatabase {
    constructor() {
        this.storageKey = 'enfrag_mental_health_data'
    }

    async saveData(key, data) {
        try {
            let allData = this.getAllData()
            allData[key] = data

            const encryptedData = encryptionService.encrypt(allData)
            localStorage.setItem(this.storageKey, encryptedData)
            return true
        } catch (error) {
            console.error('Error saving data:', error)
            return false
        }
    }

    getData(key) {
        try {
            const allData = this.getAllData()
            return allData[key] || null
        } catch (error) {
            console.error('Error getting data:', error)
            return null
        }
    }

    getAllData() {
        try {
            const encryptedData = localStorage.getItem(this.storageKey)
            if (!encryptedData) return {}

            return encryptionService.decrypt(encryptedData)
        } catch (error) {
            console.error('Error decrypting data:', error)
            return {}
        }
    }

    async deleteData(key) {
        try {
            let allData = this.getAllData()
            delete allData[key]

            const encryptedData = encryptionService.encrypt(allData)
            localStorage.setItem(this.storageKey, encryptedData)
            return true
        } catch (error) {
            console.error('Error deleting data:', error)
            return false
        }
    }

    clearAllData() {
        localStorage.removeItem(this.storageKey)
    }
}

export default new LocalDatabase()
