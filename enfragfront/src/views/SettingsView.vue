<template>
  <div class="min-h-screen bg-gradient-to-br from-soft-mint to-soft-peach dark:from-gray-900 dark:to-gray-800 p-4">
    <!-- Header -->
    <header class="flex items-center justify-between mb-6 pt-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">الإعدادات</h1>
        <p class="text-gray-600 dark:text-gray-300">تخصيص تجربتك في انفراج</p>
      </div>
      <RouterLink 
        to="/"
        class="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md"
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>
      </RouterLink>
    </header>

    <!-- User Profile -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">الملف الشخصي</h2>
      <div class="flex items-center space-x-4 space-x-reverse">
        <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="flex-1">
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              الاسم المفضل
            </label>
            <input
              v-model="userSettings.displayName"
              @blur="saveSettings"
              type="text"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="كيف تحب أن نناديك؟"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- App Preferences -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">تفضيلات التطبيق</h2>
      
      <!-- Theme Setting -->
      <div class="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-600">
        <div>
          <h4 class="font-medium text-gray-800 dark:text-white">المظهر</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">اختر بين المظهر الفاتح والداكن</p>
        </div>
        <div class="flex items-center space-x-2 space-x-reverse">
          <button
            @click="setTheme('light')"
            class="p-2 rounded-lg transition-colors"
            :class="!authStore.isDarkMode 
              ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
            </svg>
          </button>
          <button
            @click="setTheme('dark')"
            class="p-2 rounded-lg transition-colors"
            :class="authStore.isDarkMode 
              ? 'bg-primary-100 dark:bg-primary-900 text-primary-600' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Notifications -->
      <div class="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-600">
        <div>
          <h4 class="font-medium text-gray-800 dark:text-white">التذكيرات</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">تذكيرات يومية لتسجيل المزاج</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input
            v-model="userSettings.notifications"
            @change="saveSettings"
            type="checkbox"
            class="sr-only peer"
          >
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
        </label>
      </div>

      <!-- Reminder Time -->
      <div class="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-600">
        <div>
          <h4 class="font-medium text-gray-800 dark:text-white">وقت التذكير</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">الوقت المفضل للتذكيرات اليومية</p>
        </div>
        <input
          v-model="userSettings.reminderTime"
          @change="saveSettings"
          type="time"
          class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        >
      </div>

      <!-- Auto Backup -->
      <div class="flex items-center justify-between py-4">
        <div>
          <h4 class="font-medium text-gray-800 dark:text-white">النسخ الاحتياطي التلقائي</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">حفظ البيانات تلقائياً (مشفرة)</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input
            v-model="userSettings.autoBackup"
            @change="saveSettings"
            type="checkbox"
            class="sr-only peer"
          >
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
        </label>
      </div>
    </div>

    <!-- Security & Privacy -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">الأمان والخصوصية</h2>
      
      <!-- PIN Management -->
      <div class="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-600">
        <div>
          <h4 class="font-medium text-gray-800 dark:text-white">الرقم السري</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {{ authStore.user.hasPin ? 'تم تعيين رقم سري' : 'لم يتم تعيين رقم سري' }}
          </p>
        </div>
        <button
          @click="showPinModal = true"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          {{ authStore.user.hasPin ? 'تغيير' : 'إعداد' }}
        </button>
      </div>

      <!-- Session Timeout -->
      <div class="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-600">
        <div>
          <h4 class="font-medium text-gray-800 dark:text-white">انتهاء الجلسة</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">إقفال التطبيق تلقائياً بعد فترة عدم نشاط</p>
        </div>
        <select
          v-model="userSettings.sessionTimeout"
          @change="saveSettings"
          class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          <option value="5">5 دقائق</option>
          <option value="15">15 دقيقة</option>
          <option value="30">30 دقيقة</option>
          <option value="60">ساعة واحدة</option>
          <option value="0">أبداً</option>
        </select>
      </div>

      <!-- Data Encryption Status -->
      <div class="flex items-center justify-between py-4">
        <div>
          <h4 class="font-medium text-gray-800 dark:text-white">تشفير البيانات</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">جميع بياناتك الشخصية مشفرة</p>
        </div>
        <div class="flex items-center text-green-600">
          <svg class="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
          </svg>
          <span class="text-sm font-medium">نشط</span>
        </div>
      </div>
    </div>

    <!-- Data Management -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">إدارة البيانات</h2>
      
      <!-- Export Data -->
      <div class="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-600">
        <div>
          <h4 class="font-medium text-gray-800 dark:text-white">تصدير البيانات</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">تحميل نسخة من بياناتك</p>
        </div>
        <button
          @click="exportData"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          تصدير
        </button>
      </div>

      <!-- Storage Usage -->
      <div class="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-600">
        <div>
          <h4 class="font-medium text-gray-800 dark:text-white">استخدام التخزين</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">{{ storageUsage }} من البيانات المحفوظة</p>
        </div>
        <button
          @click="calculateStorageUsage"
          class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          تحديث
        </button>
      </div>

      <!-- Clear Data -->
      <div class="flex items-center justify-between py-4">
        <div>
          <h4 class="font-medium text-red-600 dark:text-red-400">مسح جميع البيانات</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300">حذف جميع البيانات نهائياً</p>
        </div>
        <button
          @click="showClearDataModal = true"
          class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          مسح
        </button>
      </div>
    </div>

    <!-- About -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">حول انفراج</h2>
      <div class="space-y-3 text-gray-600 dark:text-gray-300">
        <p>
          <span class="font-medium">الإصدار:</span> 1.0.0
        </p>
        <p>
          <span class="font-medium">تم التطوير بواسطة:</span> فريق انفراج
        </p>
        <p class="text-sm">
          انفراج هو تطبيق مفتوح المصدر مخصص لدعم الصحة النفسية. 
          جميع بياناتك محفوظة محلياً ومشفرة لضمان خصوصيتك التامة.
        </p>
        <div class="flex space-x-4 space-x-reverse">
          <a
            href="https://github.com/enfrag/enfrag"
            target="_blank"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            الكود المصدري
          </a>
          <a
            href="/privacy"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            سياسة الخصوصية
          </a>
          <a
            href="/terms"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            شروط الاستخدام
          </a>
        </div>
      </div>
    </div>

    <!-- PIN Setup Modal -->
    <div
      v-if="showPinModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {{ authStore.user.hasPin ? 'تغيير الرقم السري' : 'إعداد رقم سري جديد' }}
        </h3>
        
        <div class="space-y-4">
          <div v-if="authStore.user.hasPin">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الرقم السري الحالي
            </label>
            <input
              v-model="pinForm.currentPin"
              type="password"
              maxlength="6"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-center text-xl tracking-widest"
              placeholder="••••••"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الرقم السري الجديد (6 أرقام)
            </label>
            <input
              v-model="pinForm.newPin"
              type="password"
              maxlength="6"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-center text-xl tracking-widest"
              placeholder="••••••"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              تأكيد الرقم السري
            </label>
            <input
              v-model="pinForm.confirmPin"
              type="password"
              maxlength="6"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-center text-xl tracking-widest"
              placeholder="••••••"
            >
          </div>
          
          <div v-if="pinError" class="text-red-500 text-sm">
            {{ pinError }}
          </div>
          
          <div class="flex space-x-3 space-x-reverse">
            <button
              @click="updatePin"
              :disabled="!canUpdatePin"
              class="flex-1 bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ authStore.user.hasPin ? 'تحديث' : 'إعداد' }}
            </button>
            <button
              @click="closePinModal"
              class="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Clear Data Confirmation Modal -->
    <div
      v-if="showClearDataModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">تأكيد مسح البيانات</h3>
        
        <div class="space-y-4">
          <p class="text-gray-600 dark:text-gray-300">
            هذا الإجراء سيحذف جميع بياناتك نهائياً ولا يمكن التراجع عنه:
          </p>
          
          <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>• جميع مدخلات المزاج</li>
            <li>• مدخلات اليوميات</li>
            <li>• سجلات العلاج المعرفي</li>
            <li>• جهات الاتصال الطارئة</li>
            <li>• جميع الإعدادات</li>
          </ul>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              اكتب "مسح" للتأكيد
            </label>
            <input
              v-model="clearDataConfirmation"
              type="text"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="مسح"
            >
          </div>
          
          <div class="flex space-x-3 space-x-reverse">
            <button
              @click="clearAllData"
              :disabled="clearDataConfirmation !== 'مسح'"
              class="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              مسح نهائياً
            </button>
            <button
              @click="showClearDataModal = false"
              class="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { database, saveSetting, getSetting } from '@/utils/database'

const authStore = useAuthStore()

const showPinModal = ref(false)
const showClearDataModal = ref(false)
const storageUsage = ref('جاري الحساب...')
const clearDataConfirmation = ref('')

const userSettings = ref({
  displayName: '',
  notifications: true,
  reminderTime: '20:00',
  autoBackup: true,
  sessionTimeout: 30
})

const pinForm = ref({
  currentPin: '',
  newPin: '',
  confirmPin: ''
})

const pinError = ref('')

const canUpdatePin = computed(() => {
  if (authStore.user.hasPin && !pinForm.value.currentPin) return false
  if (!pinForm.value.newPin || pinForm.value.newPin.length !== 6) return false
  if (pinForm.value.newPin !== pinForm.value.confirmPin) return false
  return true
})

async function loadSettings() {
  try {
    userSettings.value.displayName = await getSetting('displayName') || ''
    userSettings.value.notifications = await getSetting('notifications') ?? true
    userSettings.value.reminderTime = await getSetting('reminderTime') || '20:00'
    userSettings.value.autoBackup = await getSetting('autoBackup') ?? true
    userSettings.value.sessionTimeout = await getSetting('sessionTimeout') || 30
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
}

async function saveSettings() {
  try {
    await saveSetting('displayName', userSettings.value.displayName)
    await saveSetting('notifications', userSettings.value.notifications)
    await saveSetting('reminderTime', userSettings.value.reminderTime)
    await saveSetting('autoBackup', userSettings.value.autoBackup)
    await saveSetting('sessionTimeout', userSettings.value.sessionTimeout)
  } catch (error) {
    console.error('Failed to save settings:', error)
  }
}

function setTheme(theme) {
  if (theme === 'dark' && !authStore.isDarkMode) {
    authStore.toggleDarkMode()
  } else if (theme === 'light' && authStore.isDarkMode) {
    authStore.toggleDarkMode()
  }
}

async function updatePin() {
  pinError.value = ''
  
  try {
    if (authStore.user.hasPin) {
      // Verify current PIN first
      const isValid = await authStore.verifyPin(pinForm.value.currentPin)
      if (!isValid) {
        pinError.value = 'الرقم السري الحالي غير صحيح'
        return
      }
    }
    
    if (pinForm.value.newPin.length !== 6) {
      pinError.value = 'الرقم السري يجب أن يكون 6 أرقام'
      return
    }
    
    if (pinForm.value.newPin !== pinForm.value.confirmPin) {
      pinError.value = 'الرقم السري غير متطابق'
      return
    }
    
    const success = await authStore.createPin(pinForm.value.newPin)
    if (success) {
      closePinModal()
      alert('تم تحديث الرقم السري بنجاح')
    } else {
      pinError.value = 'حدث خطأ في تحديث الرقم السري'
    }
  } catch (error) {
    console.error('Failed to update PIN:', error)
    pinError.value = 'حدث خطأ، حاول مرة أخرى'
  }
}

function closePinModal() {
  showPinModal.value = false
  pinForm.value = {
    currentPin: '',
    newPin: '',
    confirmPin: ''
  }
  pinError.value = ''
}

async function exportData() {
  try {
    const data = {
      moods: await database.getMoodLogs(),
      journal: await database.getJournalEntries(),
      cbt: await database.getCBTRecords(),
      coping: await database.getCopingSessions(),
      contacts: await database.getEmergencyContacts(),
      settings: userSettings.value,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `enfrag-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    URL.revokeObjectURL(url)
    
    alert('تم تصدير البيانات بنجاح')
  } catch (error) {
    console.error('Failed to export data:', error)
    alert('حدث خطأ في تصدير البيانات')
  }
}

async function calculateStorageUsage() {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      const usedMB = (estimate.usage / (1024 * 1024)).toFixed(2)
      storageUsage.value = `${usedMB} ميجابايت`
    } else {
      storageUsage.value = 'غير متاح'
    }
  } catch (error) {
    console.error('Failed to calculate storage usage:', error)
    storageUsage.value = 'خطأ في الحساب'
  }
}

async function clearAllData() {
  if (clearDataConfirmation.value !== 'مسح') return
  
  try {
    await database.clearEncryptedData()
    await authStore.resetPin()
    
    showClearDataModal.value = false
    clearDataConfirmation.value = ''
    
    alert('تم مسح جميع البيانات. سيتم إعادة تشغيل التطبيق.')
    
    // Reload the app
    window.location.reload()
  } catch (error) {
    console.error('Failed to clear data:', error)
    alert('حدث خطأ في مسح البيانات')
  }
}

onMounted(() => {
  loadSettings()
  calculateStorageUsage()
})
</script>
