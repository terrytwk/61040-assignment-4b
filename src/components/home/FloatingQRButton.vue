<script setup lang="ts">
const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    @click="emit('click')"
    class="fixed bottom-20 right-4 bg-latte-accent text-white rounded-full h-14 w-14 shadow-md grid place-items-center active:scale-95 transition-transform z-50"
    aria-label="Show member QR"
  >
    <span class="text-xl">▣</span>
  </button>
</template>
