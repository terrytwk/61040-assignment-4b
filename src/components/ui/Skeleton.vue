<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    lines?: number
  }>(),
  {
    lines: 3,
  },
)
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="i in props.lines"
      :key="i"
      class="animate-pulse rounded-lg bg-latte-muted h-4"
      :class="{ 'w-3/4': i === props.lines && props.lines > 1 }"
    />
  </div>
</template>
