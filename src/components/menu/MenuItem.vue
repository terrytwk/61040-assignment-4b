<script setup lang="ts">
import type { MenuItemWithOptions } from '@/types/menu'

const props = defineProps<{
  item: MenuItemWithOptions
}>()
</script>

<template>
  <div class="py-3 border-b border-latte-border/30 last:border-b-0">
    <!-- Header -->
    <div class="mb-2">
      <h3 class="text-base font-semibold text-latte-fg">{{ item.name }}</h3>
      <p class="text-sm text-latte-text-muted">{{ item.description }}</p>
    </div>

    <!-- Options -->
    <div class="flex flex-col gap-1">
      <span
        v-for="option in item.options"
        :key="option.id"
        class="text-xs text-latte-text-muted block"
      >
        {{ option.name }}: {{ option.choices.map((c) => c.name).join(', ') }}
      </span>
    </div>
  </div>
</template>
