<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { LogOut } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    title?: string
    showLogout?: boolean
  }>(),
  {
    title: 'Latte Lab',
    showLogout: false,
  },
)

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
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
        v-if="showLogout"
        @click="handleLogout"
        class="flex items-center gap-2 px-3 py-2 text-sm text-latte-text-muted hover:text-latte-fg transition-colors"
      >
        <LogOut class="w-4 h-4" />
        Logout
      </button>
    </div>
  </header>
</template>
