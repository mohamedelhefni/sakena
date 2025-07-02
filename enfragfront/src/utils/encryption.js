// Encryption utilities using Web Crypto API for AES-GCM encryption

class EncryptionManager {
  constructor() {
    this.key = null
    this.salt = null
  }

  // Generate a key from PIN using PBKDF2
  async generateKeyFromPin(pin, salt = null) {
    const encoder = new TextEncoder()
    const pinBuffer = encoder.encode(pin)
    
    // Use provided salt or generate new one
    this.salt = salt || crypto.getRandomValues(new Uint8Array(16))
    
    // Import the PIN as a key
    const baseKey = await crypto.subtle.importKey(
      'raw',
      pinBuffer,
      'PBKDF2',
      false,
      ['deriveKey']
    )
    
    // Derive the actual encryption key
    this.key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: this.salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      baseKey,
      {
        name: 'AES-GCM',
        length: 256
      },
      false,
      ['encrypt', 'decrypt']
    )
    
    return { key: this.key, salt: this.salt }
  }

  // Encrypt data
  async encrypt(plaintext) {
    if (!this.key) {
      throw new Error('Encryption key not set. Call generateKeyFromPin first.')
    }

    const encoder = new TextEncoder()
    const data = encoder.encode(JSON.stringify(plaintext))
    
    // Generate random IV for each encryption
    const iv = crypto.getRandomValues(new Uint8Array(12))
    
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      this.key,
      data
    )
    
    // Combine IV and encrypted data
    const result = new Uint8Array(iv.length + encrypted.byteLength)
    result.set(iv)
    result.set(new Uint8Array(encrypted), iv.length)
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode(...result))
  }

  // Decrypt data
  async decrypt(encryptedData) {
    if (!this.key) {
      throw new Error('Encryption key not set. Call generateKeyFromPin first.')
    }

    try {
      // Convert from base64
      const data = new Uint8Array(
        atob(encryptedData)
          .split('')
          .map(char => char.charCodeAt(0))
      )
      
      // Extract IV and encrypted data
      const iv = data.slice(0, 12)
      const encrypted = data.slice(12)
      
      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        this.key,
        encrypted
      )
      
      const decoder = new TextDecoder()
      const plaintext = decoder.decode(decrypted)
      
      return JSON.parse(plaintext)
    } catch (error) {
      throw new Error('Decryption failed: Invalid data or wrong key')
    }
  }

  // Clear the key from memory
  clearKey() {
    this.key = null
    this.salt = null
  }

  // Check if key is set
  hasKey() {
    return this.key !== null
  }

  // Get salt as base64 string for storage
  getSaltString() {
    return this.salt ? btoa(String.fromCharCode(...this.salt)) : null
  }

  // Set salt from base64 string
  setSaltFromString(saltString) {
    this.salt = new Uint8Array(
      atob(saltString)
        .split('')
        .map(char => char.charCodeAt(0))
    )
  }
}

// Global instance
export const encryptionManager = new EncryptionManager()

// Utility functions
export const generateSecurePin = () => {
  // Generate a 6-digit PIN
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const hashPin = async (pin) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(pin)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
