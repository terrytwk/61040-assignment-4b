<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Home, User, ShoppingCart } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Order', path: '/order', icon: ShoppingCart },
]

const isActive = (path: string) => computed(() => route.path === path)
</script>

<template>
  <nav
    class="fixed bottom-0 inset-x-0 bg-latte-card border-t border-latte-border h-16 flex justify-around"
  >
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      :aria-current="isActive(item.path).value ? 'page' : undefined"
      :data-active="isActive(item.path).value"
      class="flex flex-col items-center justify-center text-xs transition-colors relative"
      :class="[
        isActive(item.path).value ? 'text-latte-accent' : 'text-latte-fg/70 hover:text-latte-fg',
      ]"
    >
      <component
        :is="item.icon"
        class="w-5 h-5 mb-1 transition-colors"
        :class="[isActive(item.path).value ? 'text-latte-accent' : 'text-latte-fg/70']"
      />
      <span class="font-medium">{{ item.name }}</span>
    </router-link>
  </nav>
</template>
