<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50" dir="rtl">
        <div class="max-w-4xl mx-auto p-6">
            <!-- Header -->
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h1 class="text-2xl font-bold text-gray-800 mb-2">استراتيجيات التكيف</h1>
                <p class="text-gray-600">تقنيات وأساليب لمساعدتك في التعامل مع القلق والاكتئاب</p>
            </div>

            <!-- Quick Access Strategies -->
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-4">استراتيجيات سريعة</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="strategy in quickStrategies" :key="strategy.id"
                        class="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                        @click="selectStrategy(strategy)">
                        <h3 class="font-semibold text-gray-800 mb-2">{{ strategy.title }}</h3>
                        <p class="text-sm text-gray-600">{{ strategy.description }}</p>
                        <div class="mt-3 flex items-center justify-between">
                            <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                {{ getCategoryName(strategy.category) }}
                            </span>
                            <div class="flex items-center space-x-1 space-x-reverse">
                                <span class="text-xs text-gray-500">الفعالية:</span>
                                <div class="flex">
                                    <span v-for="i in 5" :key="i" class="w-3 h-3 rounded-full mr-1"
                                        :class="i <= strategy.effectiveness ? 'bg-yellow-400' : 'bg-gray-200'"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Breathing Exercise -->
            <div v-if="showBreathingExercise" class="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div class="text-center">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">تمرين التنفس العميق</h2>
                    <div class="relative w-32 h-32 mx-auto mb-6">
                        <div class="w-32 h-32 rounded-full border-4 border-blue-500 flex items-center justify-center transition-all duration-1000"
                            :class="breathingPhase === 'in' ? 'scale-110 bg-blue-100' : breathingPhase === 'hold' ? 'scale-110 bg-blue-200' : 'scale-90 bg-blue-50'">
                            <span class="text-2xl font-bold text-blue-600">{{ breathingCount }}</span>
                        </div>
                    </div>
                    <p class="text-lg font-medium mb-4">
                        {{ breathingText }}
                    </p>
                    <div class="space-x-4 space-x-reverse">
                        <button @click="startBreathingExercise" :disabled="breathingActive"
                            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg">
                            {{ breathingActive ? 'جاري التمرين...' : 'بدء التمرين' }}
                        </button>
                        <button @click="stopBreathingExercise"
                            class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg">
                            إيقاف
                        </button>
                    </div>
                </div>
            </div>

            <!-- Add New Strategy -->
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-4">إضافة استراتيجية جديدة</h2>

                <form @submit.prevent="addStrategy" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                                العنوان
                            </label>
                            <input id="title" v-model="newStrategy.title" type="text"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="عنوان الاستراتيجية" required />
                        </div>

                        <div>
                            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                                الفئة
                            </label>
                            <select id="category" v-model="newStrategy.category"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required>
                                <option value="">اختر الفئة</option>
                                <option value="relaxation">استرخاء</option>
                                <option value="physical">نشاط بدني</option>
                                <option value="emotional">تنظيم عاطفي</option>
                                <option value="social">تواصل اجتماعي</option>
                                <option value="cognitive">معرفي</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                            الوصف
                        </label>
                        <textarea id="description" v-model="newStrategy.description" rows="3"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="وصف تفصيلي للاستراتيجية وكيفية تطبيقها" required></textarea>
                    </div>

                    <button type="submit"
                        class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                        إضافة الاستراتيجية
                    </button>
                </form>
            </div>

            <!-- Personal Strategies -->
            <div v-if="personalStrategies.length > 0" class="bg-white rounded-2xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-4">استراتيجياتي الشخصية</h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="strategy in personalStrategies" :key="strategy.id"
                        class="p-4 border border-gray-200 rounded-lg">
                        <div class="flex items-center justify-between mb-2">
                            <h3 class="font-semibold text-gray-800">{{ strategy.title }}</h3>
                            <button @click="removeStrategy(strategy.id)" class="text-red-600 hover:text-red-700">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                    </path>
                                </svg>
                            </button>
                        </div>
                        <p class="text-sm text-gray-600 mb-3">{{ strategy.description }}</p>
                        <div class="flex items-center justify-between">
                            <span class="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                                {{ getCategoryName(strategy.category) }}
                            </span>
                            <div class="flex items-center space-x-1 space-x-reverse">
                                <span class="text-xs text-gray-500">الفعالية:</span>
                                <div class="flex">
                                    <button v-for="i in 5" :key="i" @click="updateEffectiveness(strategy.id, i)"
                                        class="w-3 h-3 rounded-full mr-1 cursor-pointer"
                                        :class="i <= (strategy.effectiveness || 3) ? 'bg-yellow-400' : 'bg-gray-200'"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useEmergencyStore } from '../stores/emergency.js'

const emergencyStore = useEmergencyStore()

const showBreathingExercise = ref(false)
const breathingActive = ref(false)
const breathingPhase = ref('ready') // 'in', 'hold', 'out'
const breathingCount = ref(4)
const breathingText = ref('اضغط لبدء التمرين')

const newStrategy = reactive({
    title: '',
    description: '',
    category: '',
    effectiveness: 3
})

const quickStrategies = computed(() => emergencyStore.getDefaultCopingStrategies())
const personalStrategies = computed(() => emergencyStore.copingStrategies)

const selectStrategy = (strategy) => {
    if (strategy.title.includes('التنفس')) {
        showBreathingExercise.value = true
    }
}

const startBreathingExercise = () => {
    breathingActive.value = true
    breathingPhase.value = 'in'
    breathingCount.value = 4
    breathingText.value = 'استنشق... 4'

    const breathingCycle = () => {
        if (!breathingActive.value) return

        if (breathingPhase.value === 'in') {
            breathingText.value = `استنشق... ${breathingCount.value}`
            if (breathingCount.value > 1) {
                breathingCount.value--
                setTimeout(breathingCycle, 1000)
            } else {
                breathingPhase.value = 'hold'
                breathingCount.value = 4
                setTimeout(breathingCycle, 1000)
            }
        } else if (breathingPhase.value === 'hold') {
            breathingText.value = `احبس النفس... ${breathingCount.value}`
            if (breathingCount.value > 1) {
                breathingCount.value--
                setTimeout(breathingCycle, 1000)
            } else {
                breathingPhase.value = 'out'
                breathingCount.value = 6
                setTimeout(breathingCycle, 1000)
            }
        } else if (breathingPhase.value === 'out') {
            breathingText.value = `أخرج النفس... ${breathingCount.value}`
            if (breathingCount.value > 1) {
                breathingCount.value--
                setTimeout(breathingCycle, 1000)
            } else {
                breathingPhase.value = 'in'
                breathingCount.value = 4
                setTimeout(breathingCycle, 1000)
            }
        }
    }

    breathingCycle()
}

const stopBreathingExercise = () => {
    breathingActive.value = false
    breathingPhase.value = 'ready'
    breathingCount.value = 4
    breathingText.value = 'اضغط لبدء التمرين'
    showBreathingExercise.value = false
}

const addStrategy = async () => {
    await emergencyStore.addCopingStrategy(newStrategy)

    // Reset form
    newStrategy.title = ''
    newStrategy.description = ''
    newStrategy.category = ''
    newStrategy.effectiveness = 3
}

const removeStrategy = async (id) => {
    if (confirm('هل أنت متأكد من حذف هذه الاستراتيجية؟')) {
        await emergencyStore.removeCopingStrategy(id)
    }
}

const updateEffectiveness = async (strategyId, effectiveness) => {
    const strategy = personalStrategies.value.find(s => s.id === strategyId)
    if (strategy) {
        strategy.effectiveness = effectiveness
        // Save updated strategies
        await emergencyStore.removeCopingStrategy(strategyId)
        await emergencyStore.addCopingStrategy(strategy)
    }
}

const getCategoryName = (category) => {
    const categories = {
        relaxation: 'استرخاء',
        physical: 'نشاط بدني',
        emotional: 'تنظيم عاطفي',
        social: 'تواصل اجتماعي',
        cognitive: 'معرفي'
    }
    return categories[category] || category
}

onMounted(async () => {
    await emergencyStore.loadEmergencyData()
})
</script>
