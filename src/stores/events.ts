import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Event } from '@/types/events'

export const useEventsStore = defineStore('events', () => {
  const upcoming = ref<Event[]>([])
  const loading = ref(false)

  const loadMockEvents = () => {
    loading.value = true

    // Simulate loading delay
    setTimeout(() => {
      const now = new Date()
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Coffee Cupping Workshop',
          dateISO: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          location: 'Main Lab',
          blurb: 'Learn to taste and evaluate different coffee origins',
        },
        {
          id: '2',
          title: 'Latte Art Competition',
          dateISO: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          location: 'Brew Station',
          blurb: 'Show off your pouring skills and win prizes',
        },
        {
          id: '3',
          title: 'Bean Roasting Demo',
          dateISO: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
          location: 'Roasting Room',
          blurb: 'Watch our master roaster in action',
        },
        {
          id: '4',
          title: 'Coffee & Code Meetup',
          dateISO: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days from now
          location: 'Community Space',
          blurb: 'Network with fellow developers over great coffee',
        },
        {
          id: '5',
          title: 'Seasonal Blend Release',
          dateISO: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 days from now
          location: 'Tasting Bar',
          blurb: 'Be the first to try our new autumn blend',
        },
      ]

      upcoming.value = mockEvents
      loading.value = false
    }, 300)
  }

  return {
    upcoming,
    loading,
    loadMockEvents,
  }
})
