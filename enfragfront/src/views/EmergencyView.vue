<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-red-900 p-4">
    <!-- Header -->
    <header class="flex items-center justify-between mb-6 pt-4">
      <div>
        <h1 class="text-2xl font-bold text-red-800 dark:text-red-200">المساعدة الطارئة</h1>
        <p class="text-red-600 dark:text-red-300">نحن هنا لمساعدتك</p>
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

    <!-- Crisis Alert -->
    <div class="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 p-6 mb-6 rounded-lg">
      <div class="flex items-center">
        <svg class="w-8 h-8 text-red-500 ml-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <div>
          <h3 class="text-lg font-semibold text-red-800 dark:text-red-200">إذا كنت تواجه أزمة فورية</h3>
          <p class="text-red-700 dark:text-red-300">لا تتردد في طلب المساعدة المهنية الفورية</p>
        </div>
      </div>
    </div>

    <!-- Quick Calm Button -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
      <div class="text-center">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">هل تشعر بالذعر أو القلق الشديد؟</h2>
        <button
          @click="startEmergencyBreathing"
          class="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors mb-4"
        >
          🫁 تمرين تنفس فوري
        </button>
        <p class="text-gray-600 dark:text-gray-300 text-sm">تمرين تنفس سريع للتهدئة الفورية</p>
      </div>
    </div>

    <!-- Emergency Contacts -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">خطوط المساعدة الطارئة</h2>
      <div class="space-y-3">
        <div
          v-for="hotline in emergencyHotlines"
          :key="hotline.id"
          class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div>
            <h4 class="font-semibold text-gray-800 dark:text-white">{{ hotline.name }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">{{ hotline.description }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ hotline.hours }}</p>
          </div>
          <a
            :href="`tel:${hotline.phone}`"
            class="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            اتصل
          </a>
        </div>
      </div>
    </div>

    <!-- Personal Emergency Contacts -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">جهات الاتصال الشخصية</h2>
        <button
          @click="showAddContact = true"
          class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          إضافة جهة اتصال
        </button>
      </div>

      <!-- Personal Contacts List -->
      <div v-if="personalContacts.length === 0" class="text-center py-8">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
        </svg>
        <p class="text-gray-500 dark:text-gray-400">لا توجد جهات اتصال طارئة</p>
        <p class="text-sm text-gray-400 dark:text-gray-500">أضف أشخاصاً يمكنك الاتصال بهم في الأوقات الصعبة</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="contact in personalContacts"
          :key="contact.id"
          class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div>
            <h4 class="font-semibold text-gray-800 dark:text-white">{{ contact.name }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">{{ contact.relationship }}</p>
          </div>
          <div class="flex space-x-2 space-x-reverse">
            <a
              :href="`tel:${contact.phone}`"
              class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
            >
              اتصال
            </a>
            <button
              @click="deleteContact(contact.id)"
              class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
            >
              حذف
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Safety Plan -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">خطة الأمان الشخصية</h2>
      <div class="space-y-4">
        <div v-for="step in safetyPlan" :key="step.id" class="border-r-4 border-primary-500 pr-4">
          <h4 class="font-semibold text-gray-800 dark:text-white mb-2">{{ step.title }}</h4>
          <p class="text-gray-600 dark:text-gray-300 text-sm">{{ step.description }}</p>
        </div>
      </div>
    </div>

    <!-- Resources -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4">موارد إضافية</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div
          v-for="resource in mentalHealthResources"
          :key="resource.id"
          class="p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
        >
          <h4 class="font-semibold text-gray-800 dark:text-white mb-2">{{ resource.title }}</h4>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">{{ resource.description }}</p>
          <a
            :href="resource.link"
            target="_blank"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            زيارة الموقع ←
          </a>
        </div>
      </div>
    </div>

    <!-- Add Contact Modal -->
    <div
      v-if="showAddContact"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">إضافة جهة اتصال طارئة</h3>
        
        <form @submit.prevent="addContact" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الاسم
            </label>
            <input
              v-model="newContact.name"
              type="text"
              required
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="اسم جهة الاتصال"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              العلاقة
            </label>
            <input
              v-model="newContact.relationship"
              type="text"
              required
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="مثل: صديق، أخ، طبيب"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              رقم الهاتف
            </label>
            <input
              v-model="newContact.phone"
              type="tel"
              required
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="+966 50 123 4567"
            >
          </div>
          
          <div class="flex space-x-3 space-x-reverse">
            <button
              type="submit"
              class="flex-1 bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              حفظ
            </button>
            <button
              type="button"
              @click="showAddContact = false"
              class="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Emergency Breathing Modal -->
    <div
      v-if="showBreathingModal"
      class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md text-center">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">تنفس معي</h2>
        
        <!-- Breathing Circle -->
        <div class="relative mx-auto mb-8" style="width: 200px; height: 200px;">
          <div
            class="absolute inset-0 rounded-full border-4 border-blue-200 flex items-center justify-center transition-all duration-1000"
            :class="breathingState === 'inhale' ? 'scale-125 bg-blue-100' : 'scale-100 bg-blue-50'"
          >
            <div class="text-center">
              <div class="text-4xl text-blue-500 mb-2">
                {{ breathingState === 'inhale' ? '📈' : '📉' }}
              </div>
              <div class="text-lg font-semibold text-gray-800">
                {{ breathingInstruction }}
              </div>
              <div class="text-3xl font-bold text-blue-600">
                {{ countdown }}
              </div>
            </div>
          </div>
        </div>

        <div class="text-gray-600 dark:text-gray-300 mb-6">
          الجولة {{ currentBreathingCycle }} من {{ totalBreathingCycles }}
        </div>

        <div class="flex space-x-3 space-x-reverse">
          <button
            v-if="!isBreathingActive"
            @click="startBreathing"
            class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            ابدأ
          </button>
          <button
            @click="stopEmergencyBreathing"
            class="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { database } from '@/utils/database'

const showAddContact = ref(false)
const showBreathingModal = ref(false)
const personalContacts = ref([])

// Emergency breathing state
const isBreathingActive = ref(false)
const breathingState = ref('inhale')
const breathingInstruction = ref('استنشق')
const countdown = ref(4)
const currentBreathingCycle = ref(0)
const totalBreathingCycles = ref(5)
let breathingInterval = null

const newContact = ref({
  name: '',
  relationship: '',
  phone: ''
})

const emergencyHotlines = [
  {
    id: 1,
    name: 'الخط الساخن للصحة النفسية - السعودية',
    description: 'خدمة استشارات نفسية مجانية',
    phone: '920033360',
    hours: '24/7'
  },
  {
    id: 2,
    name: 'مركز الأزمات النفسية',
    description: 'دعم فوري للأزمات النفسية',
    phone: '966112345678',
    hours: '24 ساعة'
  },
  {
    id: 3,
    name: 'خط منع الانتحار الدولي',
    description: 'دعم للأشخاص الذين يفكرون في إيذاء النفس',
    phone: '988',
    hours: '24/7'
  },
  {
    id: 4,
    name: 'الطوارئ العامة',
    description: 'للحالات الطبية الطارئة',
    phone: '997',
    hours: '24/7'
  }
]

const safetyPlan = [
  {
    id: 1,
    title: '1. تعرف على علامات الإنذار المبكر',
    description: 'الأفكار أو المشاعر أو السلوكيات التي تدل على بداية الأزمة'
  },
  {
    id: 2,
    title: '2. استراتيجيات التأقلم الداخلية',
    description: 'الأشياء التي يمكنك فعلها بمفردك للتهدئة (تنفس، موسيقى، مشي)'
  },
  {
    id: 3,
    title: '3. الأشخاص والأماكن الآمنة',
    description: 'جهات الاتصال الموثوقة والأماكن التي تشعرك بالأمان'
  },
  {
    id: 4,
    title: '4. اتصل بالأشخاص المقربين',
    description: 'العائلة والأصدقاء الذين يمكنهم تقديم الدعم'
  },
  {
    id: 5,
    title: '5. المساعدة المهنية',
    description: 'الأطباء والمستشارين وخطوط المساعدة'
  },
  {
    id: 6,
    title: '6. اجعل البيئة آمنة',
    description: 'إزالة وسائل الإيذاء المحتملة من المنطقة المحيطة'
  }
]

const mentalHealthResources = [
  {
    id: 1,
    title: 'منصة لبيه',
    description: 'منصة للاستشارات النفسية باللغة العربية',
    link: 'https://labayh.net'
  },
  {
    id: 2,
    title: 'موقع الصحة النفسية - وزارة الصحة',
    description: 'معلومات وموارد حول الصحة النفسية',
    link: 'https://www.moh.gov.sa'
  },
  {
    id: 3,
    title: 'مؤسسة حياة للصحة النفسية',
    description: 'برامج التوعية والدعم النفسي',
    link: 'https://hayat.org.sa'
  },
  {
    id: 4,
    title: 'خط مساندة الطفل',
    description: 'دعم خاص للأطفال والمراهقين',
    link: 'https://116111.org.sa'
  }
]

async function addContact() {
  try {
    const contact = {
      ...newContact.value,
      id: Date.now()
    }
    
    await database.saveEmergencyContact(contact)
    personalContacts.value.push(contact)
    
    // Reset form
    newContact.value = {
      name: '',
      relationship: '',
      phone: ''
    }
    
    showAddContact.value = false
  } catch (error) {
    console.error('Failed to add contact:', error)
    alert('حدث خطأ في إضافة جهة الاتصال')
  }
}

async function deleteContact(contactId) {
  if (confirm('هل أنت متأكد من حذف جهة الاتصال هذه؟')) {
    try {
      await database.delete('contacts', contactId)
      personalContacts.value = personalContacts.value.filter(c => c.id !== contactId)
    } catch (error) {
      console.error('Failed to delete contact:', error)
      alert('حدث خطأ في حذف جهة الاتصال')
    }
  }
}

function startEmergencyBreathing() {
  showBreathingModal.value = true
  setTimeout(() => {
    startBreathing()
  }, 1000)
}

function startBreathing() {
  isBreathingActive.value = true
  currentBreathingCycle.value = 1
  
  const pattern = [
    { instruction: 'استنشق', duration: 4, state: 'inhale' },
    { instruction: 'احبس', duration: 4, state: 'hold' },
    { instruction: 'ازفر', duration: 4, state: 'exhale' },
    { instruction: 'توقف', duration: 4, state: 'pause' }
  ]
  
  let stepIndex = 0
  
  function runStep() {
    if (!isBreathingActive.value) return
    
    const step = pattern[stepIndex]
    breathingInstruction.value = step.instruction
    breathingState.value = step.state
    countdown.value = step.duration
    
    const countdownInterval = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownInterval)
        stepIndex = (stepIndex + 1) % pattern.length
        
        if (stepIndex === 0) {
          currentBreathingCycle.value++
          if (currentBreathingCycle.value > totalBreathingCycles.value) {
            completeBreathing()
            return
          }
        }
        
        runStep()
      }
    }, 1000)
  }
  
  runStep()
}

function completeBreathing() {
  isBreathingActive.value = false
  breathingInstruction.value = 'مكتمل!'
  countdown.value = 0
  
  setTimeout(() => {
    showBreathingModal.value = false
    alert('أحسنت! هل تشعر بتحسن؟')
  }, 2000)
}

function stopEmergencyBreathing() {
  isBreathingActive.value = false
  showBreathingModal.value = false
  if (breathingInterval) {
    clearInterval(breathingInterval)
  }
}

async function loadPersonalContacts() {
  try {
    const contacts = await database.getEmergencyContacts()
    personalContacts.value = contacts
  } catch (error) {
    console.error('Failed to load emergency contacts:', error)
  }
}

onMounted(() => {
  loadPersonalContacts()
})

onUnmounted(() => {
  stopEmergencyBreathing()
})
</script>
