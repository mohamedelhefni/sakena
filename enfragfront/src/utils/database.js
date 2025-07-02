// Database utilities with encryption
import { openDB } from 'idb'

const DB_NAME = 'enfrag-db'
const DB_VERSION = 1

let encryptionKey = null

// Generate encryption key from PIN using PBKDF2
async function deriveKeyFromPin(pin) {
    const encoder = new TextEncoder()
    const pinData = encoder.encode(pin)
    const salt = encoder.encode('enfrag-salt-2024') // In production, use random salt per user

    const baseKey = await crypto.subtle.importKey(
        'raw',
        pinData,
        'PBKDF2',
        false,
        ['deriveKey']
    )

    const key = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    )

    encryptionKey = key
    return key
}

// Encrypt data using AES-GCM
async function encryptData(data) {
    if (!encryptionKey) {
        throw new Error('Encryption key not set')
    }

    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(JSON.stringify(data))
    const iv = crypto.getRandomValues(new Uint8Array(12))

    const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        encryptionKey,
        dataBuffer
    )

    return {
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encryptedData))
    }
}

// Decrypt data using AES-GCM
async function decryptData(encryptedObj) {
    if (!encryptionKey) {
        throw new Error('Encryption key not set')
    }

    const iv = new Uint8Array(encryptedObj.iv)
    const data = new Uint8Array(encryptedObj.data)

    const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        encryptionKey,
        data
    )

    const decoder = new TextDecoder()
    return JSON.parse(decoder.decode(decryptedData))
}

// Initialize database
async function initDB() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Mood logs store
            if (!db.objectStoreNames.contains('moods')) {
                const moodStore = db.createObjectStore('moods', { keyPath: 'id', autoIncrement: true })
                moodStore.createIndex('date', 'date')
            }

            // Journal entries store
            if (!db.objectStoreNames.contains('journal')) {
                const journalStore = db.createObjectStore('journal', { keyPath: 'id', autoIncrement: true })
                journalStore.createIndex('date', 'date')
            }

            // CBT thought records store
            if (!db.objectStoreNames.contains('thoughts')) {
                const thoughtStore = db.createObjectStore('thoughts', { keyPath: 'id', autoIncrement: true })
                thoughtStore.createIndex('date', 'date')
            }

            // User settings store
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings', { keyPath: 'key' })
            }

            // Emergency contacts store
            if (!db.objectStoreNames.contains('contacts')) {
                const contactStore = db.createObjectStore('contacts', { keyPath: 'id', autoIncrement: true })
            }
        }
    })
}

// Mood tracking functions
async function saveMoodLog(moodData) {
    const db = await initDB()
    const encryptedData = await encryptData(moodData)
    return db.add('moods', {
        date: moodData.date,
        encryptedData
    })
}

async function getMoodLogs(startDate, endDate) {
    const db = await initDB()
    const tx = db.transaction('moods', 'readonly')
    const index = tx.store.index('date')
    const range = IDBKeyRange.bound(startDate, endDate)
    const logs = await index.getAll(range)

    const decryptedLogs = []
    for (const log of logs) {
        try {
            const decryptedData = await decryptData(log.encryptedData)
            decryptedLogs.push({ id: log.id, ...decryptedData })
        } catch (error) {
            console.error('Failed to decrypt mood log:', error)
        }
    }

    return decryptedLogs
}

// Journal functions
async function saveJournalEntry(journalData) {
    const db = await initDB()
    const encryptedData = await encryptData(journalData)
    return db.add('journal', {
        date: journalData.date,
        encryptedData
    })
}

async function getJournalEntries(startDate, endDate) {
    const db = await initDB()
    const tx = db.transaction('journal', 'readonly')
    const index = tx.store.index('date')
    const range = IDBKeyRange.bound(startDate, endDate)
    const entries = await index.getAll(range)

    const decryptedEntries = []
    for (const entry of entries) {
        try {
            const decryptedData = await decryptData(entry.encryptedData)
            decryptedEntries.push({ id: entry.id, ...decryptedData })
        } catch (error) {
            console.error('Failed to decrypt journal entry:', error)
        }
    }

    return decryptedEntries
}

// CBT thought record functions
async function saveThoughtRecord(thoughtData) {
    const db = await initDB()
    const encryptedData = await encryptData(thoughtData)
    return db.add('thoughts', {
        date: thoughtData.date,
        encryptedData
    })
}

async function getThoughtRecords(startDate, endDate) {
    const db = await initDB()
    const tx = db.transaction('thoughts', 'readonly')
    const index = tx.store.index('date')
    const range = IDBKeyRange.bound(startDate, endDate)
    const records = await index.getAll(range)

    const decryptedRecords = []
    for (const record of records) {
        try {
            const decryptedData = await decryptData(record.encryptedData)
            decryptedRecords.push({ id: record.id, ...decryptedData })
        } catch (error) {
            console.error('Failed to decrypt thought record:', error)
        }
    }

    return decryptedRecords
}

// Settings functions
async function saveSetting(key, value) {
    const db = await initDB()
    return db.put('settings', { key, value })
}

async function getSetting(key) {
    const db = await initDB()
    const result = await db.get('settings', key)
    return result?.value
}

// Emergency contacts functions
async function saveEmergencyContact(contactData) {
    const db = await initDB()
    const encryptedData = await encryptData(contactData)
    return db.add('contacts', { encryptedData })
}

async function getEmergencyContacts() {
    const db = await initDB()
    const contacts = await db.getAll('contacts')

    const decryptedContacts = []
    for (const contact of contacts) {
        try {
            const decryptedData = await decryptData(contact.encryptedData)
            decryptedContacts.push({ id: contact.id, ...decryptedData })
        } catch (error) {
            console.error('Failed to decrypt emergency contact:', error)
        }
    }

    return decryptedContacts
}

async function deleteEmergencyContact(id) {
    const db = await initDB()
    return db.delete('contacts', id)
}

// Clear encryption key on logout
function clearEncryptionKey() {
    encryptionKey = null
}

// Database class for easier use
class Database {
    async init() {
        return await initDB()
    }

    async saveMoodLog(moodData) {
        return await saveMoodLog(moodData)
    }

    async getMoodLogs() {
        const endDate = new Date().toISOString().split('T')[0]
        const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        return await getMoodLogs(startDate, endDate)
    }

    async saveJournalEntry(entryData) {
        return await saveJournalEntry(entryData)
    }

    async getJournalEntries() {
        const endDate = new Date().toISOString().split('T')[0]
        const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        return await getJournalEntries(startDate, endDate)
    }

    async saveCBTRecord(recordData) {
        return await saveThoughtRecord(recordData)
    }

    async getCBTRecords() {
        const endDate = new Date().toISOString().split('T')[0]
        const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        return await getThoughtRecords(startDate, endDate)
    }

    async saveEmergencyContact(contactData) {
        return await saveEmergencyContact(contactData)
    }

    async getEmergencyContacts() {
        return await getEmergencyContacts()
    }

    async delete(storeName, id) {
        if (storeName === 'contacts') {
            return await deleteEmergencyContact(id)
        }
        // Add other store deletions as needed
        const db = await initDB()
        return db.delete(storeName, id)
    }

    async saveSetting(key, value) {
        return await saveSetting(key, value)
    }

    async getSetting(key) {
        return await getSetting(key)
    }

    // Add methods for coping sessions and meditation sessions
    async saveCopingSession(sessionData) {
        // For now, save as a mood log with type 'coping'
        return await saveMoodLog({
            ...sessionData,
            type: 'coping',
            date: new Date().toISOString().split('T')[0]
        })
    }

    async getCopingSessions() {
        // Return empty array for now - can be implemented later
        return []
    }

    async saveMeditationSession(sessionData) {
        // For now, save as a mood log with type 'meditation'
        return await saveMoodLog({
            ...sessionData,
            type: 'meditation',
            date: new Date().toISOString().split('T')[0]
        })
    }

    async getMeditationSessions() {
        // Return empty array for now - can be implemented later
        return []
    }

    async clearEncryptedData() {
        // Clear all encrypted data
        const db = await initDB()
        const stores = ['moods', 'journal', 'thoughts', 'contacts']

        for (const store of stores) {
            const tx = db.transaction(store, 'readwrite')
            await tx.objectStore(store).clear()
            await tx.done
        }
    }
}

// Export database instance
export const database = new Database()

// Also export individual functions for direct import
export {
    deriveKeyFromPin,
    clearEncryptionKey,
    saveSetting,
    getSetting,
    initDB,
    saveMoodLog,
    getMoodLogs,
    saveJournalEntry,
    getJournalEntries,
    saveThoughtRecord,
    getThoughtRecords,
    saveEmergencyContact,
    getEmergencyContacts,
    deleteEmergencyContact
}
