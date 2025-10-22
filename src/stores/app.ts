import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const showAnnouncement = ref(true)
  const announcement = ref({
    title: 'Latte Lab Kickoff',
    body: 'First meetup this Friday at 3pm — free pour-overs while beans last!',
  })
  const isQRModalOpen = ref(false)

  // Initialize from localStorage
  const init = () => {
    const saved = localStorage.getItem('latte_app_app_state')
    if (saved) {
      try {
        const state = JSON.parse(saved)
        showAnnouncement.value = state.showAnnouncement ?? true
      } catch (e) {
        console.warn('Failed to parse saved app state:', e)
      }
    }
  }

  // Persist to localStorage
  const persist = () => {
    const state = {
      showAnnouncement: showAnnouncement.value,
    }
    localStorage.setItem('latte_app_app_state', JSON.stringify(state))
  }

  const dismissAnnouncement = () => {
    showAnnouncement.value = false
    persist()
  }

  const openQR = () => {
    isQRModalOpen.value = true
  }

  const closeQR = () => {
    isQRModalOpen.value = false
  }

  const setQR = (value: boolean) => {
    isQRModalOpen.value = value
  }

  return {
    showAnnouncement,
    announcement,
    isQRModalOpen,
    init,
    dismissAnnouncement,
    openQR,
    closeQR,
    setQR,
  }
})
