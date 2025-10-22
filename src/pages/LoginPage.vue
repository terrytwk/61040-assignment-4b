<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Card from '@/components/ui/Card.vue'
import { Coffee, Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  error.value = ''

  const result = await authStore.login(email.value, password.value)

  if (result.success) {
    router.push('/order')
  } else {
    error.value = result.error || 'Login failed'
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="min-h-screen bg-latte-bg flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div
          class="w-12 h-12 bg-latte-accent rounded-xl flex items-center justify-center mx-auto mb-3"
        >
          <Coffee class="w-6 h-6 text-white" />
        </div>
        <h1 class="text-2xl font-display font-semibold text-latte-fg">Latte Lab</h1>
      </div>

      <!-- Login Form -->
      <Card class="p-6">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email Field -->
          <div>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Email"
              class="h-11 w-full rounded-lg border-latte-border focus:ring-2 focus:ring-latte-accent px-3"
              :class="{ 'border-red-500': error }"
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
                :class="{ 'border-red-500': error }"
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
          <div v-if="error" class="text-sm text-red-600">
            {{ error }}
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full h-11 rounded-lg font-medium transition-colors"
            :class="[
              authStore.loading
                ? 'bg-latte-muted text-latte-text-muted cursor-not-allowed'
                : 'bg-latte-accent text-white hover:bg-latte-accent/90',
            ]"
          >
            <span v-if="authStore.loading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </form>
      </Card>
    </div>
  </div>
</template>
