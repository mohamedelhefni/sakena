<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4"
        dir="rtl">
        <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <div class="text-center mb-8">
                <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
                        </path>
                    </svg>
                </div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">صحتي النفسية</h1>
                <p class="text-gray-600">{{ isNewUser ? 'قم بإنشاء رقم PIN جديد' : 'أدخل رقم PIN الخاص بك' }}</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        {{ isNewUser ? 'إنشاء رقم PIN (4-6 أرقام)' : 'رقم PIN' }}
                    </label>
                    <input v-model="pin" type="password" maxlength="6"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                        :placeholder="isNewUser ? 'إنشاء PIN جديد' : 'أدخل PIN'" required />
                </div>

                <div v-if="isNewUser">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        تأكيد رقم PIN
                    </label>
                    <input v-model="confirmPin" type="password" maxlength="6"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                        placeholder="تأكيد PIN" required />
                </div>

                <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p class="text-red-600 text-sm text-center">{{ error }}</p>
                </div>

                <button type="submit" :disabled="loading"
                    class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                    <span v-if="loading">جاري المعالجة...</span>
                    <span v-else>{{ isNewUser ? 'إنشاء حساب' : 'دخول' }}</span>
                </button>
            </form>

            <div class="mt-6 text-center">
                <p class="text-sm text-gray-500">
                    بياناتك محمية بتشفير قوي ومحفوظة محلياً على جهازك
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()

const pin = ref('')
const confirmPin = ref('')
const error = ref('')
const loading = ref(false)

const isNewUser = computed(() => !authStore.hasExistingData())

const handleSubmit = async () => {
    error.value = ''
    loading.value = true

    try {
        if (isNewUser.value) {
            // New user setup
            if (pin.value.length < 4 || pin.value.length > 6) {
                error.value = 'رقم PIN يجب أن يكون من 4 إلى 6 أرقام'
                return
            }

            if (pin.value !== confirmPin.value) {
                error.value = 'رقم PIN غير متطابق'
                return
            }

            const result = await authStore.setupPin(pin.value)
            if (!result.success) {
                error.value = result.error
            }
        } else {
            // Existing user login
            const result = await authStore.login(pin.value)
            if (!result.success) {
                error.value = result.error
            }
        }
    } catch (err) {
        error.value = 'حدث خطأ غير متوقع'
    } finally {
        loading.value = false
    }
}
</script>
