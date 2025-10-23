<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import Card from '@/components/ui/Card.vue'
import Toast from '@/components/ui/Toast.vue'
import {
  Calendar,
  MapPin,
  Coffee,
  Edit3,
  MoreVertical,
  LogOut,
  Share2,
  GraduationCap,
  BookOpen,
} from 'lucide-vue-next'

const profileStore = useProfileStore()
const authStore = useAuthStore()
const router = useRouter()
const { success } = useToast()
const isEditing = ref(false)
const showDropdown = ref(false)

const formatMemberSince = computed(() => {
  if (!profileStore.memberSince) return ''
  const date = new Date(profileStore.memberSince)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
})

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  try {
    await profileStore.saveToServer()
    isEditing.value = false
    success('Profile updated successfully!')
  } catch (error) {
    console.error('Failed to save profile:', error)
    // Fallback to local save
    profileStore.saveToLocal()
    isEditing.value = false
    success('Profile updated locally!')
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    const form = (e.target as HTMLElement).closest('form')
    if (form) {
      handleSubmit(e as any)
    }
  }
}

const startEditing = () => {
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  profileStore.loadFromLocal()
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

const handleLogout = () => {
  const username = authStore.currentUser?.username || 'User'
  authStore.logout()
  success('Logged out successfully', `Goodbye, ${username}!`)
  router.push('/login')
  closeDropdown()
}

const handleShare = async () => {
  const shareData = {
    title: `${profileStore.name}'s Profile`,
    text: `Check out ${profileStore.name}'s profile on Latte Lab!`,
    url: window.location.href,
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
      success('Profile shared successfully!')
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      success('Profile link copied to clipboard!')
    }
  } catch (error) {
    console.error('Error sharing:', error)
  }
  closeDropdown()
}

// Click outside handler
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown-container')) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="space-y-4">
    <!-- View Mode - Horizontal Layout -->
    <template v-if="!isEditing">
      <!-- Main Profile Card -->
      <Card class="p-6">
        <!-- Top Section: Avatar, Name, Username, Menu in one horizontal component -->
        <div class="flex items-center gap-4 mb-6">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <img
              :src="profileStore.avatar"
              :alt="`${profileStore.name}'s avatar`"
              class="w-16 h-16 rounded-full object-cover border-4 border-latte-border"
            />
          </div>

          <!-- Name and Username -->
          <div class="flex-1 min-w-0">
            <h2 class="text-xl font-display font-semibold text-latte-fg mb-1">
              {{ profileStore.name || profileStore.kerb }}
            </h2>
            <p class="text-sm text-latte-text-muted">@{{ profileStore.kerb }}</p>
          </div>

          <!-- Menu Button -->
          <div class="relative dropdown-container flex-shrink-0">
            <button
              @click="toggleDropdown"
              class="inline-flex items-center justify-center w-10 h-10 text-latte-text-muted hover:text-latte-fg hover:bg-latte-muted rounded-lg transition-colors"
            >
              <MoreVertical class="w-5 h-5" />
            </button>

            <!-- Dropdown Content -->
            <div
              v-if="showDropdown"
              class="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-latte-border py-2 z-50"
            >
              <button
                @click="startEditing"
                class="w-full flex items-center gap-3 px-4 py-2 text-sm text-latte-fg hover:bg-latte-muted transition-colors"
              >
                <Edit3 class="w-4 h-4" />
                Edit Profile
              </button>
              <button
                @click="handleShare"
                class="w-full flex items-center gap-3 px-4 py-2 text-sm text-latte-fg hover:bg-latte-muted transition-colors"
              >
                <Share2 class="w-4 h-4" />
                Share Profile
              </button>
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut class="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <!-- Content Below: Bio and Profile Details -->
        <div class="space-y-6">
          <!-- Bio -->
          <div v-if="profileStore.bio">
            <h3 class="text-sm font-medium text-latte-fg mb-2">About</h3>
            <p class="text-latte-fg/80 leading-relaxed">{{ profileStore.bio }}</p>
          </div>

          <!-- Profile Details Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Class Year -->
            <div v-if="profileStore.classYear" class="flex items-center space-x-3">
              <GraduationCap class="w-5 h-5 text-latte-text-muted flex-shrink-0" />
              <div class="min-w-0">
                <p class="text-sm font-medium text-latte-fg">Class Year</p>
                <p class="text-sm text-latte-text-muted truncate">{{ profileStore.classYear }}</p>
              </div>
            </div>

            <!-- Major -->
            <div v-if="profileStore.major" class="flex items-center space-x-3">
              <BookOpen class="w-5 h-5 text-latte-text-muted flex-shrink-0" />
              <div class="min-w-0">
                <p class="text-sm font-medium text-latte-fg">Major</p>
                <p class="text-sm text-latte-text-muted truncate">{{ profileStore.major }}</p>
              </div>
            </div>

            <!-- Member Since -->
            <div v-if="profileStore.memberSince" class="flex items-center space-x-3">
              <Calendar class="w-5 h-5 text-latte-text-muted flex-shrink-0" />
              <div class="min-w-0">
                <p class="text-sm font-medium text-latte-fg">Member Since</p>
                <p class="text-sm text-latte-text-muted truncate">{{ formatMemberSince }}</p>
              </div>
            </div>

            <!-- Favorite Drink -->
            <div v-if="profileStore.favoriteDrink" class="flex items-center space-x-3">
              <Coffee class="w-5 h-5 text-latte-text-muted flex-shrink-0" />
              <div class="min-w-0">
                <p class="text-sm font-medium text-latte-fg">Favorite Drink</p>
                <p class="text-sm text-latte-text-muted truncate">
                  {{ profileStore.favoriteDrink }}
                </p>
              </div>
            </div>

            <!-- Favorite Cafe -->
            <div v-if="profileStore.favoriteCafe" class="flex items-center space-x-3 sm:col-span-2">
              <MapPin class="w-5 h-5 text-latte-text-muted flex-shrink-0" />
              <div class="min-w-0">
                <p class="text-sm font-medium text-latte-fg">Favorite Cafe</p>
                <p class="text-sm text-latte-text-muted truncate">
                  {{ profileStore.favoriteCafe }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </template>

    <!-- Edit Mode - Single Card -->
    <Card v-else class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-latte-fg">Edit Profile</h3>
        <button
          @click="cancelEditing"
          class="text-latte-text-muted hover:text-latte-fg transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form @submit="handleSubmit" class="space-y-4">
        <!-- Name -->
        <div>
          <label for="name" class="uppercase tracking-wider text-xs text-latte-fg/70 block mb-2">
            Display Name
          </label>
          <input
            id="name"
            v-model="profileStore.name"
            type="text"
            placeholder="Enter your display name"
            class="h-12 rounded-xl border-latte-border focus:ring-2 focus:ring-latte-accent w-full"
            @keydown="handleKeydown"
          />
          <p class="text-xs text-latte-text-muted mt-1">
            Username: @{{ profileStore.kerb }} (not editable)
          </p>
        </div>

        <!-- Bio -->
        <div>
          <label for="bio" class="uppercase tracking-wider text-xs text-latte-fg/70 block mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            v-model="profileStore.bio"
            rows="3"
            class="rounded-xl border-latte-border focus:ring-2 focus:ring-latte-accent w-full resize-none"
            @keydown="handleKeydown"
          />
        </div>

        <!-- Class Year -->
        <div>
          <label
            for="classYear"
            class="uppercase tracking-wider text-xs text-latte-fg/70 block mb-2"
          >
            Class Year
          </label>
          <input
            id="classYear"
            v-model="profileStore.classYear"
            type="text"
            placeholder="e.g., 2026"
            class="h-12 rounded-xl border-latte-border focus:ring-2 focus:ring-latte-accent w-full"
            @keydown="handleKeydown"
          />
        </div>

        <!-- Major -->
        <div>
          <label for="major" class="uppercase tracking-wider text-xs text-latte-fg/70 block mb-2">
            Major
          </label>
          <input
            id="major"
            v-model="profileStore.major"
            type="text"
            placeholder="e.g., 6-3"
            class="h-12 rounded-xl border-latte-border focus:ring-2 focus:ring-latte-accent w-full"
            @keydown="handleKeydown"
          />
        </div>

        <!-- Favorite Drink -->
        <div>
          <label
            for="favoriteDrink"
            class="uppercase tracking-wider text-xs text-latte-fg/70 block mb-2"
          >
            Favorite Drink
          </label>
          <input
            id="favoriteDrink"
            v-model="profileStore.favoriteDrink"
            type="text"
            placeholder="e.g., Cortado"
            class="h-12 rounded-xl border-latte-border focus:ring-2 focus:ring-latte-accent w-full"
            @keydown="handleKeydown"
          />
        </div>

        <!-- Favorite Cafe -->
        <div>
          <label
            for="favoriteCafe"
            class="uppercase tracking-wider text-xs text-latte-fg/70 block mb-2"
          >
            Favorite Cafe
          </label>
          <input
            id="favoriteCafe"
            v-model="profileStore.favoriteCafe"
            type="text"
            placeholder="e.g., George Howell"
            class="h-12 rounded-xl border-latte-border focus:ring-2 focus:ring-latte-accent w-full"
            @keydown="handleKeydown"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3 pt-4">
          <button
            type="submit"
            class="flex-1 inline-flex items-center justify-center rounded-xl h-12 px-4 font-semibold bg-latte-accent text-white active:scale-95 transition-transform"
          >
            Save Changes
          </button>
          <button
            type="button"
            @click="cancelEditing"
            class="flex-1 inline-flex items-center justify-center rounded-xl h-12 px-4 font-semibold bg-latte-card text-latte-fg border border-latte-border active:scale-95 transition-transform"
          >
            Cancel
          </button>
        </div>
      </form>
    </Card>

    <!-- Toast notifications -->
    <Toast />
  </div>
</template>
