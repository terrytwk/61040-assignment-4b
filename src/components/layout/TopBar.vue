<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LogIn } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    title?: string
    showLogin?: boolean
  }>(),
  {
    title: 'Latte Lab',
    showLogin: false,
  },
)

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

const handleLogin = () => {
  router.push('/login')
}
</script>

<template>
  <header
    class="sticky top-0 z-20 bg-latte-bg/80 backdrop-blur border-b border-latte-border h-14 px-4 flex items-center justify-between"
  >
    <h1 class="text-xl font-semibold text-latte-fg">{{ title }}</h1>
    <div class="flex items-center gap-4">
      <slot name="right" />
      <button
        v-if="showLogin && !isAuthenticated"
        @click="handleLogin"
        class="flex items-center gap-2 px-3 py-2 text-sm text-latte-accent hover:text-latte-accent/80 transition-colors"
      >
        <LogIn class="w-4 h-4" />
        Login
      </button>
    </div>
  </header>
</template>
