import type { Router } from 'vue-router'

export function setupAuthGuards(router: Router) {
  // Global before guard
  router.beforeEach(async (to, from, next) => {
    // Dynamically import store to ensure Pinia is initialized
    const { useAuthStore } = await import('@/stores/auth')
    const authStore = useAuthStore()

    const isAuthenticated = authStore.isAuthenticated
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    const isLoginPage = to.path === '/login'

    if (requiresAuth && !isAuthenticated) {
      // Redirect to login if trying to access protected route without auth
      next('/login')
    } else if (isLoginPage && isAuthenticated) {
      // Redirect to order page if already logged in and trying to access login
      next('/order')
    } else {
      // Allow navigation
      next()
    }
  })
}
