<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
    <!-- Header -->
    <header class="mb-6 pt-4">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">استراتيجيات التأقلم</h1>
      <p class="text-gray-600 dark:text-gray-300">تمارين وتقنيات لإدارة التوتر والقلق</p>
    </header>

    <!-- Quick Access -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <button
        @click="startBreathingExercise"
        class="bg-blue-500 text-white p-6 rounded-2xl shadow-lg hover:bg-blue-600 transition-colors"
      >
        <div class="text-center">
          <div class="text-3xl mb-2">🫁</div>
          <h3 class="font-semibold mb-1">تمرين التنفس</h3>
          <p class="text-sm opacity-90">هدئ نفسك بالتنفس</p>
        </div>
      </button>

      <button
        @click="startGroundingExercise"
        class="bg-green-500 text-white p-6 rounded-2xl shadow-lg hover:bg-green-600 transition-colors"
      >
        <div class="text-center">
          <div class="text-3xl mb-2">🌱</div>
          <h3 class="font-semibold mb-1">تقنية التأريض</h3>
          <p class="text-sm opacity-90">5-4-3-2-1</p>
        </div>
      </button>
    </div>

    <!-- Breathing Exercise Modal -->
    <div
      v-if="showBreathingModal"
      class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-8 text-center">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">تمرين التنفس العميق</h2>
        
        <!-- Breathing Circle -->
        <div class="relative mx-auto mb-8" style="width: 200px; height: 200px;">
          <div
            class="absolute inset-0 rounded-full border-4 border-blue-200 flex items-center justify-center"
            :class="breathingPhase === 'inhale' ? 'animate-breathe bg-blue-100' : 'bg-blue-50'"
          >
            <div class="text-center">
              <div class="text-6xl text-blue-500 mb-2">
                {{ breathingPhase === 'inhale' ? '↑' : '↓' }}
              </div>
              <p class="text-lg font-semibold text-gray-700">
                {{ breathingPhase === 'inhale' ? 'شهيق' : 'زفير' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <div class="mb-6">
          <p class="text-lg text-gray-700 dark:text-gray-300 mb-2">
            {{ breathingInstructions }}
          </p>
          <div class="text-3xl font-bold text-blue-600">{{ breathingCounter }}</div>
        </div>

        <!-- Controls -->
        <div class="flex justify-center space-x-4 space-x-reverse">
          <button
            v-if="!breathingActive"
            @click="startBreathing"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            ابدأ التمرين
          </button>
          <button
            v-else
            @click="stopBreathing"
            class="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
          >
            إيقاف
          </button>
          <button
            @click="closeBreathingModal"
            class="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>

    <!-- Grounding Exercise Modal -->
    <div
      v-if="showGroundingModal"
      class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-8">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">تقنية التأريض 5-4-3-2-1</h2>
        
        <div class="space-y-6">
          <div v-for="(step, index) in groundingSteps" :key="index" class="p-4 rounded-lg"
               :class="groundingCurrentStep === index ? 'bg-green-100 dark:bg-green-900 border-2 border-green-500' : 'bg-gray-50 dark:bg-gray-700'">
            <div class="flex items-center mb-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                   :class="groundingCurrentStep === index ? 'bg-green-500' : 'bg-gray-400'">
                {{ step.number }}
              </div>
              <h3 class="mr-3 font-semibold text-gray-800 dark:text-white">{{ step.title }}</h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-3">{{ step.instruction }}</p>
            
            <div v-if="groundingCurrentStep === index" class="space-y-2">
              <div v-for="(item, itemIndex) in step.items" :key="itemIndex" class="flex items-center">
                <input
                  type="checkbox"
                  :id="`step-${index}-${itemIndex}`"
                  v-model="item.completed"
                  class="mr-2 h-4 w-4 text-green-600 rounded"
                >
                <label :for="`step-${index}-${itemIndex}`" class="text-sm text-gray-700 dark:text-gray-300">
                  {{ item.text }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center space-x-4 space-x-reverse mt-6">
          <button
            @click="nextGroundingStep"
            :disabled="!canProceedGrounding"
            class="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ groundingCurrentStep < groundingSteps.length - 1 ? 'التالي' : 'إنهاء' }}
          </button>
          <button
            @click="closeGroundingModal"
            class="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>

    <!-- Coping Strategies Grid -->
    <div class="space-y-6">
      <!-- Breathing Exercises -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">تمارين التنفس</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="exercise in breathingExercises"
            :key="exercise.id"
            @click="selectBreathingType(exercise.type)"
            class="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
          >
            <h3 class="font-semibold text-gray-800 dark:text-white mb-2">{{ exercise.name }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">{{ exercise.description }}</p>
            <p class="text-xs text-blue-600 dark:text-blue-400">{{ exercise.duration }}</p>
          </div>
        </div>
      </div>

      <!-- Mindfulness & Meditation -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">التأمل واليقظة الذهنية</h2>
        <div class="space-y-4">
          <div
            v-for="meditation in meditations"
            :key="meditation.id"
            @click="startMeditation(meditation)"
            class="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg ml-4">
              <span class="text-2xl">{{ meditation.icon }}</span>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-800 dark:text-white">{{ meditation.name }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ meditation.description }}</p>
              <p class="text-xs text-purple-600 dark:text-purple-400">{{ meditation.duration }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Relief Techniques -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">تقنيات الإغاثة السريعة</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="technique in quickTechniques"
            :key="technique.id"
            @click="useTechnique(technique)"
            class="p-4 text-center border-2 border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-green-300 dark:hover:border-green-500 transition-colors"
          >
            <div class="text-3xl mb-2">{{ technique.icon }}</div>
            <h3 class="font-semibold text-gray-800 dark:text-white mb-1">{{ technique.name }}</h3>
            <p class="text-xs text-gray-600 dark:text-gray-300">{{ technique.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Breathing exercise state
const showBreathingModal = ref(false)
const breathingActive = ref(false)
const breathingPhase = ref('inhale')
const breathingCounter = ref(4)
const breathingType = ref('box')
const breathingTimer = ref(null)

// Grounding exercise state
const showGroundingModal = ref(false)
const groundingCurrentStep = ref(0)

const breathingExercises = [
  {
    id: 1,
    name: 'تنفس الصندوق',
    type: 'box',
    description: 'شهيق 4 ثوان، حبس 4 ثوان، زفير 4 ثوان، حبس 4 ثوان',
    duration: '5-10 دقائق'
  },
  {
    id: 2,
    name: 'تنفس 4-7-8',
    type: '4-7-8',
    description: 'شهيق 4 ثوان، حبس 7 ثوان، زفير 8 ثوان',
    duration: '3-5 دقائق'
  },
  {
    id: 3,
    name: 'التنفس العميق',
    type: 'deep',
    description: 'تنفس عميق وبطيء من البطن',
    duration: '5-15 دقيقة'
  }
]

const meditations = [
  {
    id: 1,
    name: 'تأمل اليقظة الذهنية',
    description: 'ركز على اللحظة الحالية والتنفس',
    duration: '10 دقائق',
    icon: '🧘',
    instructions: 'اجلس بشكل مريح، أغمض عينيك، وركز على تنفسك الطبيعي...'
  },
  {
    id: 2,
    name: 'تأمل الجسم',
    description: 'مسح تدريجي لجميع أجزاء الجسم',
    duration: '15 دقيقة',
    icon: '🌸',
    instructions: 'ابدأ من أطراف أصابع قدميك وتحرك تدريجياً إلى أعلى...'
  },
  {
    id: 3,
    name: 'تأمل الامتنان',
    description: 'تركيز على الأشياء الإيجابية في حياتك',
    duration: '8 دقائق',
    icon: '🙏',
    instructions: 'فكر في ثلاثة أشياء تشعر بالامتنان لها اليوم...'
  }
]

const quickTechniques = [
  {
    id: 1,
    name: 'الماء البارد',
    description: 'اغسل وجهك بماء بارد',
    icon: '💧'
  },
  {
    id: 2,
    name: 'العد التنازلي',
    description: 'عد من 100 إلى 1',
    icon: '🔢'
  },
  {
    id: 3,
    name: 'الضغط والإفلات',
    description: 'شد واسترخي عضلاتك',
    icon: '💪'
  },
  {
    id: 4,
    name: 'الموسيقى الهادئة',
    description: 'استمع لموسيقى مريحة',
    icon: '🎵'
  },
  {
    id: 5,
    name: 'النظر للخارج',
    description: 'انظر خارج النافذة',
    icon: '🪟'
  },
  {
    id: 6,
    name: 'شرب الشاي',
    description: 'اشرب مشروباً دافئاً',
    icon: '🍵'
  }
]

const groundingSteps = ref([
  {
    number: 5,
    title: 'انظر إلى 5 أشياء',
    instruction: 'حدد 5 أشياء يمكنك رؤيتها من حولك',
    items: [
      { text: 'شيء أمامك مباشرة', completed: false },
      { text: 'شيء إلى يمينك', completed: false },
      { text: 'شيء إلى يسارك', completed: false },
      { text: 'شيء فوقك', completed: false },
      { text: 'شيء تحتك', completed: false }
    ]
  },
  {
    number: 4,
    title: 'المس 4 أشياء',
    instruction: 'المس 4 أشياء مختلفة وركز على ملمسها',
    items: [
      { text: 'شيء ناعم', completed: false },
      { text: 'شيء خشن', completed: false },
      { text: 'شيء بارد', completed: false },
      { text: 'شيء دافئ', completed: false }
    ]
  },
  {
    number: 3,
    title: 'استمع إلى 3 أصوات',
    instruction: 'ركز على 3 أصوات مختلفة حولك',
    items: [
      { text: 'صوت قريب منك', completed: false },
      { text: 'صوت بعيد', completed: false },
      { text: 'صوت في الخلفية', completed: false }
    ]
  },
  {
    number: 2,
    title: 'شم رائحتين',
    instruction: 'حاول تمييز رائحتين مختلفتين',
    items: [
      { text: 'رائحة في الهواء', completed: false },
      { text: 'رائحة أخرى حولك', completed: false }
    ]
  },
  {
    number: 1,
    title: 'تذوق شيئاً واحداً',
    instruction: 'ركز على طعم في فمك أو تناول شيئاً صغيراً',
    items: [
      { text: 'طعم في فمك الآن', completed: false }
    ]
  }
])

const breathingInstructions = computed(() => {
  switch (breathingType.value) {
    case 'box':
      return breathingPhase.value === 'inhale' ? 'تنفس ببطء من أنفك' : 'أخرج الهواء ببطء من فمك'
    case '4-7-8':
      return breathingPhase.value === 'inhale' ? 'شهيق من الأنف' : 'زفير من الفم'
    case 'deep':
      return breathingPhase.value === 'inhale' ? 'تنفس عميق من البطن' : 'زفير بطيء ومريح'
    default:
      return 'تنفس بشكل طبيعي'
  }
})

const canProceedGrounding = computed(() => {
  if (groundingCurrentStep.value >= groundingSteps.value.length) return true
  const currentItems = groundingSteps.value[groundingCurrentStep.value].items
  return currentItems.every(item => item.completed)
})

function startBreathingExercise() {
  showBreathingModal.value = true
  breathingType.value = 'box'
}

function selectBreathingType(type) {
  breathingType.value = type
  startBreathingExercise()
}

function startBreathing() {
  breathingActive.value = true
  breathingPhase.value = 'inhale'
  breathingCounter.value = 4
  runBreathingCycle()
}

function runBreathingCycle() {
  if (!breathingActive.value) return
  
  const intervals = {
    'box': [4, 4, 4, 4], // inhale, hold, exhale, hold
    '4-7-8': [4, 7, 8, 0],
    'deep': [6, 0, 8, 0]
  }
  
  const [inhale, hold1, exhale, hold2] = intervals[breathingType.value]
  
  // Inhale phase
  breathingPhase.value = 'inhale'
  breathingCounter.value = inhale
  
  const countdown = setInterval(() => {
    breathingCounter.value--
    if (breathingCounter.value <= 0) {
      clearInterval(countdown)
      
      // Hold phase 1 (if applicable)
      if (hold1 > 0) {
        setTimeout(() => {
          // Exhale phase
          breathingPhase.value = 'exhale'
          breathingCounter.value = exhale
          
          const exhaleCountdown = setInterval(() => {
            breathingCounter.value--
            if (breathingCounter.value <= 0) {
              clearInterval(exhaleCountdown)
              
              // Hold phase 2 (if applicable)
              if (hold2 > 0) {
                setTimeout(() => {
                  runBreathingCycle()
                }, hold2 * 1000)
              } else {
                setTimeout(() => {
                  runBreathingCycle()
                }, 1000)
              }
            }
          }, 1000)
        }, hold1 * 1000)
      } else {
        // Direct to exhale
        breathingPhase.value = 'exhale'
        breathingCounter.value = exhale
        
        const exhaleCountdown = setInterval(() => {
          breathingCounter.value--
          if (breathingCounter.value <= 0) {
            clearInterval(exhaleCountdown)
            setTimeout(() => {
              runBreathingCycle()
            }, 1000)
          }
        }, 1000)
      }
    }
  }, 1000)
}

function stopBreathing() {
  breathingActive.value = false
  if (breathingTimer.value) {
    clearInterval(breathingTimer.value)
  }
}

function closeBreathingModal() {
  stopBreathing()
  showBreathingModal.value = false
}

function startGroundingExercise() {
  showGroundingModal.value = true
  groundingCurrentStep.value = 0
  // Reset all completed states
  groundingSteps.value.forEach(step => {
    step.items.forEach(item => {
      item.completed = false
    })
  })
}

function nextGroundingStep() {
  if (groundingCurrentStep.value < groundingSteps.value.length - 1) {
    groundingCurrentStep.value++
  } else {
    closeGroundingModal()
  }
}

function closeGroundingModal() {
  showGroundingModal.value = false
  groundingCurrentStep.value = 0
}

function startMeditation(meditation) {
  // In a real app, this would start a guided meditation
  alert(`بدء تأمل: ${meditation.name}\n\n${meditation.instructions}`)
}

function useTechnique(technique) {
  // In a real app, this would provide guided instructions
  alert(`تقنية: ${technique.name}\n\n${technique.description}`)
}
</script>
