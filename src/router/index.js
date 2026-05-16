import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue') },
  { path: '/quran', name: 'quran', component: () => import('@/views/QuranView.vue') },
  { path: '/adhkar', name: 'adhkar', component: () => import('@/views/AdhkarView.vue') },
  { path: '/hadith', name: 'hadith', component: () => import('@/views/HadithView.vue') },
  { path: '/login', redirect: '/dashboard' },
  { path: '/register', redirect: '/dashboard' },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
