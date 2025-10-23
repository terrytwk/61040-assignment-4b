import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/services/api'
import { useToast } from '@/composables/useToast'

export interface User {
  id: string
  username: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const currentUser = computed(() => user.value)

  // Initialize auth state from localStorage
  const initializeAuth = () => {
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('authUser')

    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      } catch (err) {
        console.error('Failed to parse stored user data:', err)
        clearAuth()
      }
    }
  }

  // Store auth data in localStorage
  const storeAuth = (userData: User, authToken: string) => {
    localStorage.setItem('authToken', authToken)
    localStorage.setItem('authUser', JSON.stringify(userData))
    token.value = authToken
    user.value = userData
  }

  // Clear auth data from localStorage and state
  const clearAuth = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    token.value = null
    user.value = null
    error.value = null
  }

  // Login function
  const login = async (username: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authApi.login(username, password)

      if (response.data && 'user' in response.data) {
        const userId = response.data.user

        // Create user object
        const userData: User = {
          id: userId,
          username: username,
        }

        // Generate a simple token (for demo purposes)
        const authToken = btoa(`${username}:${Date.now()}`)

        // Store authentication data
        storeAuth(userData, authToken)

        return { success: true, user: userData }
      } else if (response.data && 'error' in response.data) {
        error.value = response.data.error
        return { success: false, error: response.data.error }
      } else {
        error.value = 'Invalid response from server'
        return { success: false, error: 'Invalid response from server' }
      }
    } catch (err: any) {
      console.error('Login error:', err)
      error.value = err.response?.data?.error || err.message || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Register function
  const register = async (username: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authApi.register(username, password)

      if (response.data && 'user' in response.data) {
        const userId = response.data.user

        // Create user object
        const userData: User = {
          id: userId,
          username: username,
        }

        // Generate a simple token (for demo purposes)
        const authToken = btoa(`${username}:${Date.now()}`)

        // Store authentication data
        storeAuth(userData, authToken)

        return { success: true, user: userData }
      } else if (response.data && 'error' in response.data) {
        error.value = response.data.error
        return { success: false, error: response.data.error }
      } else {
        error.value = 'Invalid response from server'
        return { success: false, error: 'Invalid response from server' }
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      error.value = err.response?.data?.error || err.message || 'Registration failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Logout function
  const logout = () => {
    clearAuth()
  }

  // Change password function
  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!user.value) {
      return { success: false, error: 'No user logged in' }
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await authApi.changePassword(user.value.id, oldPassword, newPassword)

      if (response.data && Object.keys(response.data).length === 0) {
        // Empty response means success
        return { success: true }
      } else if (response.data && 'error' in response.data) {
        error.value = response.data.error
        return { success: false, error: response.data.error }
      } else {
        error.value = 'Invalid response from server'
        return { success: false, error: 'Invalid response from server' }
      }
    } catch (err: any) {
      console.error('Change password error:', err)
      error.value = err.response?.data?.error || err.message || 'Password change failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Get user by username (for lookup)
  const getUserByUsername = async (username: string) => {
    try {
      const response = await authApi.getUserByUsername(username)

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return { success: true, user: response.data[0].user }
      } else {
        return { success: false, error: 'User not found' }
      }
    } catch (err: any) {
      console.error('Get user by username error:', err)
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'User lookup failed',
      }
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    currentUser,

    // Actions
    initializeAuth,
    login,
    register,
    logout,
    changePassword,
    getUserByUsername,
    clearAuth,
  }
})
