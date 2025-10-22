import { defineStore } from 'pinia'
import { ref } from 'vue'

interface ProfileState {
  name: string
  email: string
  preferredDrink?: string
  bio?: string
  avatar?: string
  memberSince?: string
  favoriteSpot?: string
}

export const useProfileStore = defineStore('profile', () => {
  const name = ref('')
  const email = ref('')
  const preferredDrink = ref('')
  const bio = ref('')
  const avatar = ref('')
  const memberSince = ref('')
  const favoriteSpot = ref('')

  const loadFromLocal = () => {
    const saved = localStorage.getItem('latte_profile')
    if (saved) {
      try {
        const profile: ProfileState = JSON.parse(saved)
        name.value = profile.name || ''
        email.value = profile.email || ''
        preferredDrink.value = profile.preferredDrink || ''
        bio.value = profile.bio || ''
        avatar.value = profile.avatar || ''
        memberSince.value = profile.memberSince || ''
        favoriteSpot.value = profile.favoriteSpot || ''
      } catch (e) {
        console.warn('Failed to parse saved profile:', e)
      }
    } else {
      // Initialize with dummy data if no saved profile
      initializeDummyData()
    }
  }

  const initializeDummyData = () => {
    name.value = 'Alex Chen'
    email.value = 'alex.chen@email.com'
    preferredDrink.value = 'Oat Milk Latte'
    bio.value =
      'Coffee enthusiast and latte art lover. Always exploring new roasters and perfecting my morning routine.'
    avatar.value =
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    memberSince.value = '2023-08-15'
    favoriteSpot.value = 'Downtown Roastery'
  }

  const saveToLocal = () => {
    const profile: ProfileState = {
      name: name.value,
      email: email.value,
      preferredDrink: preferredDrink.value,
      bio: bio.value,
      avatar: avatar.value,
      memberSince: memberSince.value,
      favoriteSpot: favoriteSpot.value,
    }
    localStorage.setItem('latte_profile', JSON.stringify(profile))
  }

  const update = <K extends keyof ProfileState>(key: K, value: ProfileState[K]) => {
    if (key === 'name') {
      name.value = value as string
    } else if (key === 'email') {
      email.value = value as string
    } else if (key === 'preferredDrink') {
      preferredDrink.value = value as string
    } else if (key === 'bio') {
      bio.value = value as string
    } else if (key === 'avatar') {
      avatar.value = value as string
    } else if (key === 'memberSince') {
      memberSince.value = value as string
    } else if (key === 'favoriteSpot') {
      favoriteSpot.value = value as string
    }
  }

  // Initialize on store creation
  loadFromLocal()

  return {
    name,
    email,
    preferredDrink,
    bio,
    avatar,
    memberSince,
    favoriteSpot,
    loadFromLocal,
    saveToLocal,
    update,
    initializeDummyData,
  }
})
