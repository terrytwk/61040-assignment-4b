<script setup lang="ts">
import TopBar from '@/components/layout/TopBar.vue'
import ProfileDisplay from '@/components/profile/ProfileDisplay.vue'
</script>

<template>
  <div>
    <TopBar title="Profile" />
    <main class="max-w-screen-sm mx-auto px-4 pb-20 py-4">
      <ProfileDisplay />
    </main>
  </div>
</template>
