<template>
    <div class="flex h-screen bg-gray-50" dir="rtl">
        <!-- Sidebar (Desktop) -->
        <aside class="hidden md:flex flex-col w-64 bg-white border-l shadow-lg">
            <!-- Logo and App Name -->
            <div class="flex items-center justify-center p-6 border-b">
                <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center ml-3">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                        </path>
                    </svg>
                </div>
                <h1 class="text-xl font-bold text-gray-800">صحتي النفسية</h1>
            </div>

            <!-- User Profile -->
            <div class="p-4 border-b">
                <div class="flex items-center space-x-3 space-x-reverse">
                    <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                        {{ userInitials }}
                    </div>
                    <div>
                        <h2 class="font-medium text-gray-800">{{ userName || 'زائر' }}</h2>
                        <p class="text-xs text-gray-500">آخر تسجيل دخول: {{ formatLastLogin }}</p>
                    </div>
                </div>
                <div class="mt-3" v-if="!userName">
                    <button @click="showNameModal = true" 
                        class="w-full px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 transition-colors">
                        إضافة اسمك
                    </button>
                </div>
            </div>

            <!-- Session Timer -->
            <div class="px-4 py-3 bg-blue-50 border-b">
                <div class="flex items-center justify-between">
                    <span class="text-sm text-blue-700">الجلسة تنتهي في:</span>
                    <span class="text-sm font-medium">{{ sessionTimeRemaining }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div class="bg-blue-600 h-1.5 rounded-full" :style="{ width: sessionTimePercentage + '%' }"></div>
                </div>
            </div>

            <!-- Navigation Links -->
            <nav class="flex-1 overflow-y-auto py-4">
                <div class="px-4 space-y-2">
                    <router-link v-for="item in navigation" :key="item.name" :to="item.to"
                        class="flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg transition-colors"
                        :class="$route.path === item.to ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'">
                        <component :is="item.icon" class="w-6 h-6" />
                        <span class="font-medium">{{ item.name }}</span>
                    </router-link>
                </div>
            </nav>

            <!-- Logout Button -->
            <div class="p-4 border-t">
                <button @click="logout"
                    class="flex items-center justify-center w-full space-x-2 space-x-reverse bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-lg font-medium transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                        </path>
                    </svg>
                    <span>تسجيل الخروج</span>
                </button>
            </div>
        </aside>

        <!-- Mobile Navigation Bar -->
        <div class="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t shadow-lg z-10">
            <div class="flex justify-around items-center p-2">
                <button @click="mobileSidebarOpen = true" class="p-2 text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>

                <router-link v-for="item in navigation.slice(0, 4)" :key="item.name" :to="item.to"
                    class="flex flex-col items-center p-2 rounded-md"
                    :class="$route.path === item.to ? 'text-blue-600' : 'text-gray-600'">
                    <component :is="item.icon" class="w-6 h-6" />
                    <span class="text-xs mt-1">{{ item.name }}</span>
                </router-link>
            </div>
        </div>

        <!-- Mobile Sidebar (drawer) -->
        <div v-if="mobileSidebarOpen" class="fixed inset-0 z-20 md:hidden">
            <!-- Overlay -->
            <div class="fixed inset-0 bg-black bg-opacity-50" @click="mobileSidebarOpen = false"></div>
            
            <!-- Sidebar content -->
            <div class="fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform">
                <div class="flex flex-col h-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between p-4 border-b">
                        <div class="flex items-center space-x-3 space-x-reverse">
                            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                                    </path>
                                </svg>
                            </div>
                            <h1 class="text-lg font-bold text-gray-800">صحتي النفسية</h1>
                        </div>
                        <button @click="mobileSidebarOpen = false" class="text-gray-500 hover:text-gray-700">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- User Profile -->
                    <div class="p-4 border-b">
                        <div class="flex items-center space-x-3 space-x-reverse">
                            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {{ userInitials }}
                            </div>
                            <div>
                                <h2 class="font-medium text-gray-800">{{ userName || 'زائر' }}</h2>
                                <p class="text-xs text-gray-500">الجلسة: {{ sessionTimeRemaining }}</p>
                            </div>
                        </div>
                        <div class="mt-3" v-if="!userName">
                            <button @click="showNameModal = true; mobileSidebarOpen = false" 
                                class="w-full px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100 transition-colors">
                                إضافة اسمك
                            </button>
                        </div>
                    </div>

                    <!-- Navigation Links -->
                    <nav class="flex-1 overflow-y-auto py-2">
                        <div class="px-2 space-y-1">
                            <router-link v-for="item in navigation" :key="item.name" :to="item.to"
                                @click="mobileSidebarOpen = false"
                                class="flex items-center space-x-3 space-x-reverse px-3 py-2 rounded-md text-sm transition-colors"
                                :class="$route.path === item.to ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'">
                                <component :is="item.icon" class="w-5 h-5" />
                                <span>{{ item.name }}</span>
                            </router-link>
                        </div>
                    </nav>

                    <!-- Logout Button -->
                    <div class="p-4 border-t">
                        <button @click="logout"
                            class="flex items-center justify-center w-full space-x-2 space-x-reverse bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                                </path>
                            </svg>
                            <span>تسجيل الخروج</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Name Input Modal -->
        <div v-if="showNameModal" class="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50" dir="rtl">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div class="p-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">أهلاً بك!</h2>
                    <p class="text-gray-600 mb-4">من فضلك أدخل اسمك لتخصيص التجربة</p>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
                        <input v-model="nameInput" type="text"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="أدخل اسمك هنا">
                    </div>
                    
                    <div class="flex justify-end space-x-3 space-x-reverse">
                        <button @click="showNameModal = false"
                            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                            لاحقاً
                        </button>
                        <button @click="saveName"
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            حفظ
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="flex-1 overflow-auto">
            <div class="py-4 px-6 md:py-6 md:px-8">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()
const mobileSidebarOpen = ref(false)
const showNameModal = ref(false)
const nameInput = ref('')

// User name handling
const userName = ref(localStorage.getItem('userName') || '')
const userInitials = computed(() => {
    if (!userName.value) return 'ز';
    return userName.value.trim().split(' ').map(name => name[0]).join('').substring(0, 2);
})

const saveName = () => {
    if (nameInput.value.trim()) {
        userName.value = nameInput.value.trim()
        localStorage.setItem('userName', userName.value)
    }
    showNameModal.value = false
}

// Session timeout functionality
const sessionDuration = 30 * 60 * 1000 // 30 minutes in milliseconds
// Use stored session start time or current time
const getStoredSessionTime = () => {
    const stored = localStorage.getItem('enfrag_sessionStartTime')
    // Only use stored value if it exists and is within the session duration
    if (stored) {
        const startTime = parseInt(stored)
        const elapsed = Date.now() - startTime
        if (elapsed < sessionDuration) {
            return startTime
        }
    }
    return Date.now()
}
const sessionStartTime = ref(getStoredSessionTime())
const sessionTimeRemaining = ref('30:00')
const sessionTimePercentage = ref(100)
let sessionTimer = null
let activityTimer = null

const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const updateSessionTimer = () => {
    const elapsed = Date.now() - sessionStartTime.value
    const remaining = Math.max(0, sessionDuration - elapsed)
    sessionTimeRemaining.value = formatTime(remaining)
    sessionTimePercentage.value = (remaining / sessionDuration) * 100
    
    // Save current timer state on each update to ensure consistent state across navigations
    localStorage.setItem('enfrag_sessionRemainingTime', remaining.toString())
    
    if (remaining <= 0) {
        logout()
    }
}

const resetSessionTimer = () => {
    const now = Date.now()
    sessionStartTime.value = now
    localStorage.setItem('enfrag_sessionStartTime', now.toString())
    // Remove any existing remaining time as we've reset the timer
    localStorage.removeItem('enfrag_sessionRemainingTime')
    updateSessionTimer()
}

const onUserActivity = () => {
    // Debounce the reset to avoid calling it too often
    clearTimeout(activityTimer)
    activityTimer = setTimeout(resetSessionTimer, 300)
}

// Navigation items
const navigation = [
    {
        name: 'الرئيسية',
        to: '/',
        icon: 'HomeIcon'
    },
    {
        name: 'تتبع المزاج',
        to: '/mood',
        icon: 'MoodIcon'
    },
    {
        name: 'المفكرة',
        to: '/journal',
        icon: 'JournalIcon'
    },
    {
        name: 'استراتيجيات التكيف',
        to: '/coping',
        icon: 'CopingIcon'
    },
    {
        name: 'الطوارئ',
        to: '/emergency',
        icon: 'EmergencyIcon'
    },
    {
        name: 'الإعدادات',
        to: '/settings',
        icon: 'SettingsIcon'
    }
]

const logout = () => {
    authStore.logout()
    mobileSidebarOpen.value = false
    clearInterval(sessionTimer)
    // Clear session data from localStorage
    localStorage.removeItem('enfrag_sessionStartTime')
    localStorage.removeItem('enfrag_sessionRemainingTime')
}

const formatLastLogin = computed(() => {
    const date = new Date()
    return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date)
})

// Setup event listeners for user activity to reset session timer
onMounted(() => {
    // Check if we need to restore an active session
    const sessionStartTimeStored = localStorage.getItem('enfrag_sessionStartTime')
    if (sessionStartTimeStored) {
        const startTime = parseInt(sessionStartTimeStored)
        const elapsed = Date.now() - startTime
        
        // If the stored session is still valid (not expired)
        if (elapsed < sessionDuration) {
            // Restore the session start time
            sessionStartTime.value = startTime
        } else {
            // If the session has expired, reset it
            resetSessionTimer()
        }
    } else {
        // If no session exists, create a new one
        resetSessionTimer()
    }
    
    // Start the session timer
    sessionTimer = setInterval(updateSessionTimer, 1000)
    
    // Add event listeners for user activity
    document.addEventListener('mousemove', onUserActivity)
    document.addEventListener('keydown', onUserActivity)
    document.addEventListener('click', onUserActivity)
    document.addEventListener('touchstart', onUserActivity)
    
    // Show the name modal if user hasn't set a name yet
    if (!userName.value) {
        setTimeout(() => {
            showNameModal.value = true
        }, 1000)
    }
})

onBeforeUnmount(() => {
    clearInterval(sessionTimer)
    clearTimeout(activityTimer)
    document.removeEventListener('mousemove', onUserActivity)
    document.removeEventListener('keydown', onUserActivity)
    document.removeEventListener('click', onUserActivity)
    document.removeEventListener('touchstart', onUserActivity)
})
</script>

<script>
// Icon components
const HomeIcon = {
    template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
    </svg>
  `
}

const MoodIcon = {
    template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `
}

const JournalIcon = {
    template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
    </svg>
  `
}

const CopingIcon = {
    template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
    </svg>
  `
}

const EmergencyIcon = {
    template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
    </svg>
  `
}

const SettingsIcon = {
    template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>
  `
}

export default {
    components: {
        HomeIcon,
        MoodIcon,
        JournalIcon,
        CopingIcon,
        EmergencyIcon,
        SettingsIcon
    }
}
</script>
