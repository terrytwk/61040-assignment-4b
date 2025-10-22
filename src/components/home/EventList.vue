<script setup lang="ts">
import { onMounted } from 'vue'
import { useEventsStore } from '@/stores/events'
import EventCard from './EventCard.vue'
import Skeleton from '@/components/ui/Skeleton.vue'

const eventsStore = useEventsStore()

onMounted(() => {
  eventsStore.loadMockEvents()
})
</script>

<template>
  <div class="relative">
    <div v-if="eventsStore.loading" class="space-y-4">
      <Skeleton :lines="3" />
    </div>
    <div v-else class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide items-stretch">
      <EventCard 
        v-for="event in eventsStore.upcoming" 
        :key="event.id" 
        :event="event" 
        class="flex-shrink-0 w-80"
      />
    </div>
  </div>
</template>
