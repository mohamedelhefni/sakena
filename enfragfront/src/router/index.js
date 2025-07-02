import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import MoodTrackerView from '@/views/MoodTrackerView.vue'
import JournalView from '@/views/JournalView.vue'
import CopingStrategiesView from '@/views/CopingStrategiesView.vue'
import CBTToolsView from '@/views/CBTToolsView.vue'
import EmergencyView from '@/views/EmergencyView.vue'
import AnalyticsView from '@/views/AnalyticsView.vue'
import SettingsView from '@/views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/mood',
      name: 'mood',
      component: MoodTrackerView,
      meta: { requiresAuth: true }
    },
    {
      path: '/journal',
      name: 'journal',
      component: JournalView,
      meta: { requiresAuth: true }
    },
    {
      path: '/coping',
      name: 'coping',
      component: CopingStrategiesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/cbt',
      name: 'cbt',
      component: CBTToolsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/emergency',
      name: 'emergency',
      component: EmergencyView,
      meta: { requiresAuth: true }
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: AnalyticsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: { requiresAuth: true }
    }
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
