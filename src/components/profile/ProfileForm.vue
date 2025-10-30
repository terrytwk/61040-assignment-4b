<script setup lang="ts">
import { ref } from 'vue'
import { useProfileStore } from '@/stores/profile'
import Card from '@/components/ui/Card.vue'

const profileStore = useProfileStore()

const handleSubmit = (e: Event) => {
  e.preventDefault()
  profileStore.saveToLocal()
  alert('Profile saved')
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    const form = (e.target as HTMLElement).closest('form')
    if (form) {
      handleSubmit(e as any)
    }
  }
}
</script>

<template>
  <Card class="p-6">
    <form @submit="handleSubmit" class="space-y-4">
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

      <button
        type="submit"
        class="inline-flex items-center justify-center rounded-2xl h-12 px-4 font-semibold bg-latte-accent text-white active:scale-95 w-full"
      >
        Save
      </button>
    </form>
  </Card>
</template>
