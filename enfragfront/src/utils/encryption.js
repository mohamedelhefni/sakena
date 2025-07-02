import CryptoJS from 'crypto-js'

class EncryptionService {
    constructor() {
        this.secretKey = null
    }

    setSecretKey(key) {
        this.secretKey = key
    }

    encrypt(data) {
        if (!this.secretKey) {
            throw new Error('Secret key not set')
        }
        const jsonString = JSON.stringify(data)
        return CryptoJS.AES.encrypt(jsonString, this.secretKey).toString()
    }

    decrypt(encryptedData) {
        if (!this.secretKey) {
            throw new Error('Secret key not set')
        }
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey)
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
            return JSON.parse(decryptedString)
        } catch (error) {
            throw new Error('Failed to decrypt data - invalid key or corrupted data')
        }
    }

    isKeySet() {
        return this.secretKey !== null
    }
}

export default new EncryptionService()
