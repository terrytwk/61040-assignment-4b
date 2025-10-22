<script setup lang="ts">
import { computed, ref } from 'vue'
import { useProfileStore } from '@/stores/profile'
import Card from '@/components/ui/Card.vue'
import { Calendar, MapPin, Coffee, Edit3 } from 'lucide-vue-next'

const profileStore = useProfileStore()
const isEditing = ref(false)

const formatMemberSince = computed(() => {
  if (!profileStore.memberSince) return ''
  const date = new Date(profileStore.memberSince)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
})

const handleSubmit = (e: Event) => {
  e.preventDefault()
  profileStore.saveToLocal()
  isEditing.value = false
  alert('Profile updated successfully!')
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
</script>

<template>
  <div class="space-y-4">
    <!-- View Mode - Two Cards -->
    <template v-if="!isEditing">
      <!-- Profile Header Card -->
      <Card class="p-6">
        <div class="flex flex-col items-center text-center space-y-4">
          <!-- Avatar -->
          <div class="relative">
            <img
              :src="profileStore.avatar"
              :alt="`${profileStore.name}'s avatar`"
              class="w-24 h-24 rounded-full object-cover border-4 border-latte-border"
            />
          </div>

          <!-- Name and Email -->
          <div>
            <h2 class="text-2xl font-display font-semibold text-latte-fg mb-1">
              {{ profileStore.name }}
            </h2>
            <p class="text-latte-text-muted">{{ profileStore.email }}</p>
          </div>

          <!-- Bio -->
          <p v-if="profileStore.bio" class="text-latte-fg/80 text-center max-w-sm">
            {{ profileStore.bio }}
          </p>

          <!-- Edit Button -->
          <button
            @click="startEditing"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-latte-accent hover:text-latte-accent/80 transition-colors"
          >
            <Edit3 class="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </Card>

      <!-- Profile Details Card -->
      <Card class="p-6">
        <h3 class="text-lg font-semibold text-latte-fg mb-4">Profile Details</h3>
        <div class="space-y-4">
          <!-- Member Since -->
          <div v-if="profileStore.memberSince" class="flex items-center space-x-3">
            <Calendar class="w-5 h-5 text-latte-text-muted" />
            <div>
              <p class="text-sm font-medium text-latte-fg">Member Since</p>
              <p class="text-sm text-latte-text-muted">{{ formatMemberSince }}</p>
            </div>
          </div>

          <!-- Preferred Drink -->
          <div v-if="profileStore.preferredDrink" class="flex items-center space-x-3">
            <Coffee class="w-5 h-5 text-latte-text-muted" />
            <div>
              <p class="text-sm font-medium text-latte-fg">Preferred Drink</p>
              <p class="text-sm text-latte-text-muted">{{ profileStore.preferredDrink }}</p>
            </div>
          </div>

          <!-- Favorite Spot -->
          <div v-if="profileStore.favoriteSpot" class="flex items-center space-x-3">
            <MapPin class="w-5 h-5 text-latte-text-muted" />
            <div>
              <p class="text-sm font-medium text-latte-fg">Favorite Spot</p>
              <p class="text-sm text-latte-text-muted">{{ profileStore.favoriteSpot }}</p>
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
        <!-- Avatar URL -->
        <div>
          <label for="avatar" class="uppercase tracking-wider text-xs text-latte-fg/70 block mb-2">
            Avatar URL
          </label>
          <input
            id="avatar"
            v-model="profileStore.avatar"
            type="url"
            class="h-12 rounded-xl border-latte-border focus:ring-2 focus:ring-latte-accent w-full"
            @keydown="handleKeydown"
          />
        </div>

        <!-- Name -->
        <div>
          <label for="name" class="uppercase tracking-wider text-xs text-latte-fg/70 block mb-2">
            Name
          </label>
          <input
            id="name"
            v-model="profileStore.name"
            type="text"
            class="h-12 rounded-xl border-latte-border focus:ring-2 focus:ring-latte-accent w-full"
            @keydown="handleKeydown"
          />
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="uppercase tracking-wider text-xs text-latte-fg/70 block mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="profileStore.email"
            type="email"
            class="h-12 rounded-xl border-latte-border focus:ring-2 focus:ring-latte-accent w-full"
            @keydown="handleKeydown"
          />
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

        <!-- Preferred Drink -->
        <div>
          <label
            for="preferredDrink"
            class="uppercase tracking-wider text-xs text-latte-fg/70 block mb-2"
          >
            Preferred Drink
          </label>
          <input
            id="preferredDrink"
            v-model="profileStore.preferredDrink"
            type="text"
            class="h-12 rounded-xl border-latte-border focus:ring-2 focus:ring-latte-accent w-full"
            @keydown="handleKeydown"
          />
        </div>

        <!-- Favorite Spot -->
        <div>
          <label
            for="favoriteSpot"
            class="uppercase tracking-wider text-xs text-latte-fg/70 block mb-2"
          >
            Favorite Spot
          </label>
          <input
            id="favoriteSpot"
            v-model="profileStore.favoriteSpot"
            type="text"
            class="h-12 rounded-xl border-latte-border focus:ring-2 focus:ring-latte-accent w-full"
            @keydown="handleKeydown"
          />
        </div>

        <!-- Member Since -->
        <div>
          <label
            for="memberSince"
            class="uppercase tracking-wider text-xs text-latte-fg/70 block mb-2"
          >
            Member Since
          </label>
          <input
            id="memberSince"
            v-model="profileStore.memberSince"
            type="date"
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
  </div>
</template>
