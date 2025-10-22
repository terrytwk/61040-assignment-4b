import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  email: string
  role: string
  name: string
}

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref<User | null>(null)
  const loading = ref(false)

  // Initialize auth state from localStorage
  const initAuth = () => {
    const authToken = localStorage.getItem('latte_auth')
    const userData = localStorage.getItem('latte_user')

    if (authToken === 'true' && userData) {
      try {
        user.value = JSON.parse(userData)
        isAuthenticated.value = true
      } catch (e) {
        console.warn('Failed to parse user data:', e)
        logout()
      }
    }
  }

  // Login function
  const login = async (email: string, password: string) => {
    loading.value = true

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (email === 'barista@latte.com' && password === 'password') {
        const userData: User = {
          email,
          role: 'barista',
          name: 'Barista User',
        }

        user.value = userData
        isAuthenticated.value = true

        // Save to localStorage
        localStorage.setItem('latte_auth', 'true')
        localStorage.setItem('latte_user', JSON.stringify(userData))

        return { success: true }
      } else {
        return { success: false, error: 'Invalid email or password' }
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' }
    } finally {
      loading.value = false
    }
  }

  // Logout function
  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('latte_auth')
    localStorage.removeItem('latte_user')
  }

  // Computed properties
  const isBarista = computed(() => user.value?.role === 'barista')
  const userName = computed(() => user.value?.name || '')
  const userEmail = computed(() => user.value?.email || '')

  // Initialize on store creation
  initAuth()

  return {
    isAuthenticated,
    user,
    loading,
    isBarista,
    userName,
    userEmail,
    initAuth,
    login,
    logout,
  }
})
