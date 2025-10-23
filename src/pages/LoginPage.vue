<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import Card from '@/components/ui/Card.vue'
import Toast from '@/components/ui/Toast.vue'
import { Coffee, Eye, EyeOff, ArrowLeft } from 'lucide-vue-next'
import logo from '@/assets/logo.JPEG'

const router = useRouter()
const authStore = useAuthStore()
const { success, error } = useToast()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const localError = ref('')

const handleLogin = async () => {
  if (!username.value || !password.value) {
    localError.value = 'Please fill in all fields'
    return
  }

  localError.value = ''

  const result = await authStore.login(username.value, password.value)

  if (result.success) {
    success('Login successful!', `Welcome back, ${username.value}`)
    router.push('/')
  } else {
    localError.value = result.error || 'Login failed'
    error('Login failed', result.error || 'Please check your credentials')
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-latte-bg">
    <!-- Back Button - Fixed at top -->
    <div class="absolute top-4 left-4 z-10">
      <button
        @click="goBack"
        class="flex items-center gap-2 px-4 py-2 text-latte-text-muted hover:text-latte-fg transition-colors bg-latte-card/80 backdrop-blur-sm rounded-lg border border-latte-border/50"
      >
        <ArrowLeft class="w-4 h-4" />
        <span class="text-sm font-medium">Back to Home</span>
      </button>
    </div>

    <!-- Main Content - Centered -->
    <div class="flex items-center justify-center px-4 h-screen">
      <div class="w-full max-w-sm">
        <!-- Logo -->
        <div class="text-center mb-8">
          <img
            :src="logo"
            alt="Latte Lab Logo"
            class="w-36 h-36 rounded-xl mx-auto mb-3 object-cover"
          />
        </div>

        <!-- Login Form -->
        <Card class="p-6">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <!-- Username Field -->
            <div>
              <input
                id="username"
                v-model="username"
                type="text"
                placeholder="Username"
                class="h-11 w-full rounded-lg border-latte-border focus:ring-2 focus:ring-latte-accent px-3"
                :class="{ 'border-red-500': localError }"
              />
            </div>

            <!-- Password Field -->
            <div>
              <div class="relative">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Password"
                  class="h-11 w-full rounded-lg border-latte-border focus:ring-2 focus:ring-latte-accent px-3 pr-10"
                  :class="{ 'border-red-500': localError }"
                />
                <button
                  type="button"
                  @click="togglePasswordVisibility"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-latte-text-muted hover:text-latte-fg transition-colors"
                >
                  <Eye v-if="!showPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="localError" class="text-sm text-red-600">
              {{ localError }}
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="w-full h-11 rounded-lg font-medium transition-colors"
              :class="[
                authStore.isLoading
                  ? 'bg-latte-muted text-latte-text-muted cursor-not-allowed'
                  : 'bg-latte-accent text-white hover:bg-latte-accent/90',
              ]"
            >
              <span v-if="authStore.isLoading">Signing in...</span>
              <span v-else>Sign In</span>
            </button>
          </form>
        </Card>
      </div>
    </div>

    <!-- Toast notifications -->
    <Toast />
  </div>
</template>
