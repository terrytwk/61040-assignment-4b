<script setup lang="ts">
import { ref } from 'vue'
import { useProfileStore } from '@/stores/profile'
import Card from '@/components/ui/Card.vue'

const profileStore = useProfileStore()
const isEditing = ref(false)

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
  // Reload from localStorage to reset any unsaved changes
  profileStore.loadFromLocal()
}
</script>

<template>
  <Card class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-latte-fg">Edit Profile</h3>
      <button
        v-if="!isEditing"
        @click="startEditing"
        class="inline-flex items-center justify-center rounded-xl h-10 px-4 font-semibold bg-latte-accent text-white active:scale-95 transition-transform"
      >
        Edit
      </button>
    </div>

    <form v-if="isEditing" @submit="handleSubmit" class="space-y-4">
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
          v-model="profileStore.favoriteDrink"
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

    <div v-else class="text-center py-8">
      <p class="text-latte-text-muted mb-4">Click "Edit" to modify your profile information</p>
    </div>
  </Card>
</template>
