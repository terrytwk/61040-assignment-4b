import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAuthStore } from './auth'
import { userProfileApi } from '@/services/api'

interface ProfileState {
  name: string
  email: string
  kerb?: string
  classYear?: string
  major?: string
  bio?: string
  favoriteDrink?: string
  favoriteCafe?: string
  avatar?: string
  memberSince?: string
  favoriteSpot?: string
}

export const useProfileStore = defineStore('profile', () => {
  const authStore = useAuthStore()

  const name = ref('')
  const email = ref('')
  const kerb = ref<string | undefined>('')
  const classYear = ref<string | undefined>('')
  const major = ref<string | undefined>('')
  const bio = ref<string | undefined>('')
  const favoriteDrink = ref<string | undefined>('')
  const favoriteCafe = ref<string | undefined>('')
  const avatar = ref<string | undefined>('')
  const memberSince = ref<string | undefined>('')
  const favoriteSpot = ref<string | undefined>('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties for current user
  const currentUser = computed(() => authStore.currentUser)
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  const loadFromLocal = () => {
    const saved = localStorage.getItem('latte_profile')
    if (saved) {
      try {
        const profile: ProfileState = JSON.parse(saved)
        name.value = profile.name || ''
        email.value = profile.email || ''
        kerb.value = profile.kerb || ''
        classYear.value = profile.classYear || ''
        major.value = profile.major || ''
        bio.value = profile.bio || ''
        favoriteDrink.value = profile.favoriteDrink || ''
        favoriteCafe.value = profile.favoriteCafe || ''
        avatar.value = profile.avatar || ''
        memberSince.value = profile.memberSince || ''
        favoriteSpot.value = profile.favoriteSpot || ''
      } catch (e) {
        console.warn('Failed to parse saved profile:', e)
      }
    } else {
      // Initialize with user data if authenticated, otherwise dummy data
      if (isAuthenticated.value && currentUser.value) {
        initializeUserData()
      } else {
        initializeDummyData()
      }
    }
  }

  const initializeUserData = () => {
    if (!currentUser.value) return

    // Use actual user data from authentication
    name.value = '' // Start with empty name - user should set their display name
    email.value = `${currentUser.value.username || 'user'}@mit.edu` // Generate email from username
    kerb.value = currentUser.value.username || 'user' // Set kerb to username
    classYear.value = '2026' // Default class year
    major.value = '6-3' // Default major
    bio.value = `Welcome to Latte Lab! I'm ${currentUser.value.username || 'user'}.`
    favoriteDrink.value = 'Cortado' // Default favorite drink
    favoriteCafe.value = 'George Howell' // Default favorite cafe
    avatar.value = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.value.username || 'user')}&background=8B5CF6&color=fff&size=150`
    memberSince.value = new Date().toISOString().split('T')[0] // Today's date
    favoriteSpot.value = 'Main Cafe'
  }

  const initializeDummyData = () => {
    name.value = 'Alex Chen'
    email.value = 'alex.chen@email.com'
    kerb.value = 'alexchen'
    classYear.value = '2025'
    major.value = '6-3'
    bio.value =
      'Coffee enthusiast and latte art lover. Always exploring new roasters and perfecting my morning routine.'
    favoriteDrink.value = 'Oat Milk Latte'
    favoriteCafe.value = 'Downtown Roastery'
    avatar.value =
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    memberSince.value = '2023-08-15'
    favoriteSpot.value = 'Downtown Roastery'
  }

  const loadFromServer = async () => {
    if (!currentUser.value) return

    isLoading.value = true
    error.value = null

    try {
      const response = await userProfileApi.getProfile(currentUser.value.id)

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const profileData = response.data[0]
        name.value = profileData.name || ''
        classYear.value = profileData.classYear || ''
        major.value = profileData.major || ''
        bio.value = profileData.bio || ''
        favoriteDrink.value = profileData.favoriteDrink || ''
        favoriteCafe.value = profileData.favoriteCafe || ''
        avatar.value =
          profileData.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.value.username || 'user')}&background=8B5CF6&color=fff&size=150`

        // Set kerb from current user
        kerb.value = currentUser.value.username || ''

        // Keep local data for fields not in API
        email.value = email.value || `${currentUser.value.username || 'user'}@mit.edu`
        memberSince.value = memberSince.value || new Date().toISOString().split('T')[0]
        favoriteSpot.value = favoriteSpot.value || 'Main Cafe'
      }
    } catch (err: unknown) {
      console.error('Failed to load profile from server:', err)
      const errorMessage =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        (err as Error)?.message ||
        'Failed to load profile'
      error.value = errorMessage
    } finally {
      isLoading.value = false
    }
  }

  const saveToLocal = () => {
    const profile: ProfileState = {
      name: name.value,
      email: email.value,
      kerb: kerb.value,
      classYear: classYear.value,
      major: major.value,
      bio: bio.value,
      favoriteDrink: favoriteDrink.value,
      favoriteCafe: favoriteCafe.value,
      avatar: avatar.value,
      memberSince: memberSince.value,
      favoriteSpot: favoriteSpot.value,
    }
    localStorage.setItem('latte_profile', JSON.stringify(profile))
  }

  const saveToServer = async () => {
    if (!currentUser.value) return

    isLoading.value = true
    error.value = null

    try {
      await userProfileApi.setProfile(currentUser.value.id, {
        name: name.value,
        classYear: classYear.value,
        major: major.value,
        bio: bio.value,
        favoriteDrink: favoriteDrink.value,
        favoriteCafe: favoriteCafe.value,
        avatar: avatar.value,
      })

      // Also save to local storage
      saveToLocal()
    } catch (err: unknown) {
      console.error('Failed to save profile to server:', err)
      const errorMessage =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        (err as Error)?.message ||
        'Failed to save profile'
      error.value = errorMessage
    } finally {
      isLoading.value = false
    }
  }

  const update = <K extends keyof ProfileState>(key: K, value: ProfileState[K]) => {
    if (key === 'name') {
      name.value = value as string
    } else if (key === 'email') {
      email.value = value as string
    } else if (key === 'kerb') {
      kerb.value = value as string
    } else if (key === 'classYear') {
      classYear.value = value as string
    } else if (key === 'major') {
      major.value = value as string
    } else if (key === 'bio') {
      bio.value = value as string
    } else if (key === 'favoriteDrink') {
      favoriteDrink.value = value as string
    } else if (key === 'favoriteCafe') {
      favoriteCafe.value = value as string
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

  // Watch for authentication changes and load profile data
  watch(
    () => authStore.isAuthenticated,
    (isAuthenticated) => {
      if (isAuthenticated && authStore.currentUser) {
        // User just logged in, load profile from server
        loadFromServer()
      }
    },
    { immediate: true },
  )

  return {
    name,
    email,
    kerb,
    classYear,
    major,
    bio,
    favoriteDrink,
    favoriteCafe,
    avatar,
    memberSince,
    favoriteSpot,
    isLoading,
    error,
    currentUser,
    isAuthenticated,
    loadFromLocal,
    loadFromServer,
    saveToLocal,
    saveToServer,
    update,
    initializeDummyData,
    initializeUserData,
  }
})
