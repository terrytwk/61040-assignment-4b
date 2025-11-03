import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import OrderPage from '@/pages/OrderPage.vue'
import OrderDashboardPage from '@/pages/OrderDashboardPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import UsersPage from '@/pages/UsersPage.vue'
import FeedbackPage from '@/pages/FeedbackPage.vue'
import { setupAuthGuards } from './guards'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: false },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/order',
    name: 'Order',
    component: OrderPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/order-dashboard',
    name: 'OrderDashboard',
    component: OrderDashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'Users',
    component: UsersPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: FeedbackPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Set up authentication guards
setupAuthGuards(router)

export default router
