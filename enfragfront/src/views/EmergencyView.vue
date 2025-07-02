<template>
    <div class="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50" dir="rtl">
        <div class="max-w-4xl mx-auto p-6">
            <!-- Emergency Header -->
            <div class="bg-red-600 text-white rounded-2xl shadow-lg p-6 mb-6">
                <div class="flex items-center space-x-3 space-x-reverse mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                        </path>
                    </svg>
                    <h1 class="text-2xl font-bold">المساعدة الطارئة</h1>
                </div>
                <p class="text-red-100">
                    إذا كنت تمر بأزمة أو تفكر في إيذاء نفسك، يرجى الاتصال بخدمات الطوارئ فوراً
                </p>
            </div>

            <!-- Crisis Hotlines -->
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-red-500">
                <h2 class="text-xl font-bold text-gray-800 mb-4">أرقام الطوارئ</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 bg-red-50 rounded-lg">
                        <h3 class="font-semibold text-red-800 mb-2">الطوارئ العامة</h3>
                        <p class="text-lg font-bold text-red-600">999</p>
                        <p class="text-sm text-red-700">متاح 24/7</p>
                    </div>
                    <div class="p-4 bg-blue-50 rounded-lg">
                        <h3 class="font-semibold text-blue-800 mb-2">خط المساعدة النفسية</h3>
                        <p class="text-lg font-bold text-blue-600">8002470</p>
                        <p class="text-sm text-blue-700">متاح 24/7</p>
                    </div>
                </div>
            </div>

            <!-- Quick Coping Strategies -->
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-4">استراتيجيات فورية للتكيف</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="strategy in quickCopingStrategies" :key="strategy.id"
                        class="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                        @click="useStrategy(strategy)">
                        <h3 class="font-semibold text-blue-800 mb-2">{{ strategy.title }}</h3>
                        <p class="text-sm text-blue-600">{{ strategy.description }}</p>
                    </div>
                </div>
            </div>

            <!-- 5-4-3-2-1 Grounding Technique -->
            <div v-if="showGroundingTechnique" class="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-4">تقنية التأريض 5-4-3-2-1</h2>
                <div class="space-y-4">
                    <div v-for="(step, index) in groundingSteps" :key="index"
                        class="p-4 border border-gray-200 rounded-lg">
                        <h3 class="font-semibold text-gray-800 mb-2">{{ step.title }}</h3>
                        <p class="text-gray-600 mb-3">{{ step.description }}</p>
                        <textarea v-model="groundingResponses[index]" :placeholder="step.placeholder" rows="2"
                            class="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                    </div>
                </div>
            </div>

            <!-- Emergency Contacts -->
            <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 class="text-xl font-bold text-gray-800 mb-4">جهات الاتصال الطارئة</h2>

                <!-- Add Contact Form -->
                <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 class="font-semibold text-gray-800 mb-3">إضافة جهة اتصال جديدة</h3>
                    <form @submit.prevent="addEmergencyContact" class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input v-model="newContact.name" type="text" placeholder="الاسم"
                            class="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required />
                        <input v-model="newContact.phone" type="tel" placeholder="رقم الهاتف"
                            class="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required />
                        <input v-model="newContact.relationship" type="text"
                            placeholder="العلاقة (صديق، عائلة، طبيب...)"
                            class="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required />
                        <button type="submit"
                            class="md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
                            إضافة جهة الاتصال
                        </button>
                    </form>
                </div>

                <!-- Emergency Contacts List -->
                <div v-if="emergencyStore.emergencyContacts.length > 0" class="space-y-3">
                    <div v-for="contact in emergencyStore.emergencyContacts" :key="contact.id"
                        class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                            <h3 class="font-semibold text-gray-800">{{ contact.name }}</h3>
                            <p class="text-sm text-gray-600">{{ contact.relationship }}</p>
                        </div>
                        <div class="flex items-center space-x-3 space-x-reverse">
                            <a :href="`tel:${contact.phone}`"
                                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                                اتصال
                            </a>
                            <button @click="removeEmergencyContact(contact.id)" class="text-red-600 hover:text-red-700">
                                حذف
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else class="text-center py-8">
                    <p class="text-gray-600">لم يتم إضافة أي جهات اتصال طارئة بعد</p>
                </div>
            </div>

            <!-- Safety Reminders -->
            <div class="bg-white rounded-2xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-800 mb-4">تذكيرات مهمة</h2>
                <div class="space-y-4">
                    <div class="flex items-start space-x-3 space-x-reverse p-4 bg-green-50 rounded-lg">
                        <svg class="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                            <h3 class="font-semibold text-green-800">هذه مشاعر مؤقتة</h3>
                            <p class="text-green-700 text-sm">المشاعر الصعبة تمر، وستشعر بتحسن مرة أخرى</p>
                        </div>
                    </div>

                    <div class="flex items-start space-x-3 space-x-reverse p-4 bg-blue-50 rounded-lg">
                        <svg class="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                            </path>
                        </svg>
                        <div>
                            <h3 class="font-semibold text-blue-800">لست وحدك</h3>
                            <p class="text-blue-700 text-sm">هناك أشخاص يهتمون بك ويريدون مساعدتك</p>
                        </div>
                    </div>

                    <div class="flex items-start space-x-3 space-x-reverse p-4 bg-purple-50 rounded-lg">
                        <svg class="w-6 h-6 text-purple-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                            </path>
                        </svg>
                        <div>
                            <h3 class="font-semibold text-purple-800">طلب المساعدة قوة</h3>
                            <p class="text-purple-700 text-sm">الاعتراف بالحاجة للمساعدة يُظهر الشجاعة والحكمة</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useEmergencyStore } from '../stores/emergency.js'

const emergencyStore = useEmergencyStore()

const showGroundingTechnique = ref(false)
const groundingResponses = ref(['', '', '', '', ''])

const newContact = reactive({
    name: '',
    phone: '',
    relationship: ''
})

const quickCopingStrategies = [
    {
        id: 1,
        title: 'تنفس عميق',
        description: 'خذ نفساً عميقاً لمدة 4 ثوانٍ، احبسه لمدة 4، ثم أخرجه لمدة 6'
    },
    {
        id: 2,
        title: 'تقنية 5-4-3-2-1',
        description: 'ركز على حواسك لتهدئة القلق والتوتر'
    },
    {
        id: 3,
        title: 'اتصل بصديق',
        description: 'تحدث مع شخص تثق به'
    },
    {
        id: 4,
        title: 'اشرب ماء بارد',
        description: 'الماء البارد يساعد على التهدئة'
    }
]

const groundingSteps = [
    {
        title: '5 أشياء يمكنك رؤيتها',
        description: 'انظر حولك واذكر 5 أشياء يمكنك رؤيتها',
        placeholder: 'مثال: الكرسي، النافذة، الهاتف...'
    },
    {
        title: '4 أشياء يمكنك لمسها',
        description: 'اذكر 4 أشياء يمكنك الشعور بها أو لمسها',
        placeholder: 'مثال: ملمس الطاولة، برودة الهواء...'
    },
    {
        title: '3 أشياء يمكنك سماعها',
        description: 'استمع واذكر 3 أصوات من حولك',
        placeholder: 'مثال: صوت السيارات، المروحة...'
    },
    {
        title: '2 أشياء يمكنك شمها',
        description: 'اذكر رائحتين تشمهما الآن',
        placeholder: 'مثال: رائحة القهوة، العطر...'
    },
    {
        title: 'شيء واحد يمكنك تذوقه',
        description: 'ركز على أي طعم في فمك',
        placeholder: 'مثال: طعم النعناع، الماء...'
    }
]

const useStrategy = (strategy) => {
    if (strategy.title.includes('5-4-3-2-1')) {
        showGroundingTechnique.value = true
    }
}

const addEmergencyContact = async () => {
    await emergencyStore.addEmergencyContact(newContact)

    // Reset form
    newContact.name = ''
    newContact.phone = ''
    newContact.relationship = ''
}

const removeEmergencyContact = async (id) => {
    if (confirm('هل أنت متأكد من حذف جهة الاتصال هذه؟')) {
        await emergencyStore.removeEmergencyContact(id)
    }
}

onMounted(async () => {
    await emergencyStore.loadEmergencyData()
})
</script>
