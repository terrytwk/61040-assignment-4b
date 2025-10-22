<script setup lang="ts">
import type { Event } from '@/types/events'
import { formatEventDate } from '@/utils/formatter'
import { Calendar, MapPin } from 'lucide-vue-next'

const props = defineProps<{
  event: Event
}>()
</script>

<template>
  <div
    class="bg-latte-card rounded-2xl border border-latte-border shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-52"
  >
    <!-- Event Content -->
    <div class="p-4 pb-3 flex-1 flex flex-col">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-latte-fg mb-1">{{ event.title }}</h3>
          <div class="flex items-center text-sm text-latte-text-muted mb-2">
            <Calendar class="w-4 h-4 mr-2" />
            <span>{{ formatEventDate(event.dateISO) }}</span>
          </div>
          <div v-if="event.location" class="flex items-center text-sm text-latte-text-muted">
            <MapPin class="w-4 h-4 mr-2" />
            <span>{{ event.location }}</span>
          </div>
        </div>
      </div>

      <!-- Event Description -->
      <div class="flex-1">
        <p v-if="event.blurb" class="text-sm text-latte-fg/80 leading-relaxed">
          {{ event.blurb }}
        </p>
        <!-- Empty space for events without blurb -->
        <div v-else class="h-6"></div>
      </div>
    </div>

    <!-- Event Footer -->
    <div class="px-4 py-3 bg-latte-muted/30 border-t border-latte-border/50 mt-auto">
      <div class="flex items-center justify-between">
        <span class="text-xs text-latte-text-muted">Latte Lab Event</span>
        <button
          class="text-xs font-medium text-latte-accent hover:text-latte-accent/80 transition-colors"
        >
          Learn More →
        </button>
      </div>
    </div>
  </div>
</template>
