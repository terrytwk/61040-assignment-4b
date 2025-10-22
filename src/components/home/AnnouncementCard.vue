<script setup lang="ts">
const props = defineProps<{
  title: string
  body: string
}>()

const emit = defineEmits<{
  dismiss: []
}>()
</script>

<template>
  <Card class="p-4">
    <div class="space-y-3">
      <h3 class="text-lg font-semibold text-latte-fg">{{ title }}</h3>
      <p class="text-latte-text-muted">{{ body }}</p>
      <button
        @click="emit('dismiss')"
        class="text-sm text-latte-text-muted hover:text-latte-fg transition-colors"
      >
        Dismiss
      </button>
    </div>
  </Card>
</template>
