<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import BottomNav from '@/components/layout/BottomNav.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const shouldShowBottomNav = computed(() => {
  // Show bottom nav only for authenticated users and not on login page
  return isAuthenticated.value && route.path !== '/login'
})
</script>

<template>
  <RouterView />
  <BottomNav v-if="shouldShowBottomNav" />
</template>
