<script setup lang="ts">
import { computed } from 'vue'
import QRCodeVue3 from 'qrcode.vue'

const props = withDefaults(
  defineProps<{
    value: string
    size?: number
  }>(),
  {
    size: 200,
  },
)

// Extract fallback code from value (e.g., "member:demo-12345" -> "DEMO-12345")
const fallbackCode = computed(() => {
  const parts = props.value.split(':')
  if (parts.length > 1 && parts[1]) {
    return parts[1].toUpperCase().replace(/-/g, '-')
  }
  return props.value.toUpperCase()
})
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <QRCodeVue3 :value="value" :size="size" />
    <p class="text-center text-sm text-latte-text-muted">Fallback: {{ fallbackCode }}</p>
  </div>
</template>
