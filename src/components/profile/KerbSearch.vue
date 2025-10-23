<script setup lang="ts">
import { ref } from 'vue'
import { findUserByKerb } from '@/services/api'
import { useToast } from '@/composables/useToast'
import { Search } from 'lucide-vue-next'

interface UserSearchResult {
  user: string
  username: string
}

interface Props {
  placeholder?: string
  onUserSelect?: (user: UserSearchResult) => void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter username to find...',
  onUserSelect: () => {},
})

const searchQuery = ref('')
const isLoading = ref(false)
const { error: toastError } = useToast()

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    toastError('Search Error', 'Please enter a username to search.')
    return
  }

  isLoading.value = true
  try {
    const response = await findUserByKerb(searchQuery.value.trim())

    if (response.data && !('error' in response.data)) {
      // Success - found exactly one user
      props.onUserSelect(response.data as UserSearchResult)
    } else {
      // Error - no user found or multiple matches
      const errorMessage = (response.data as { error: string })?.error || 'No user found'
      toastError('User Not Found', errorMessage)
    }
  } catch (err: any) {
    console.error('Kerb search failed:', err)
    toastError('Search Error', err.response?.data?.error || 'Failed to perform search.')
  } finally {
    isLoading.value = false
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    performSearch()
  }
}
</script>

<template>
  <div class="kerb-search-container w-full">
    <div class="flex gap-2">
      <input
        type="text"
        v-model="searchQuery"
        :placeholder="placeholder"
        @keydown="handleKeydown"
        class="flex-1 h-12 px-4 rounded-xl border-latte-border focus:ring-2 focus:ring-latte-accent text-latte-fg bg-latte-input"
        aria-label="Search users"
        :disabled="isLoading"
      />
      <button
        @click="performSearch"
        :disabled="isLoading || !searchQuery.trim()"
        class="h-12 px-4 rounded-xl font-semibold transition-transform flex items-center gap-2"
        :class="[
          isLoading || !searchQuery.trim()
            ? 'bg-latte-muted text-latte-text-muted cursor-not-allowed'
            : 'bg-latte-accent text-white active:scale-95 hover:bg-latte-accent/90',
        ]"
        aria-label="Find user"
      >
        <Search class="w-4 h-4" />
        <span v-if="!isLoading">Find</span>
        <span v-else>...</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.kerb-search-container {
  /* Add any specific container styles if needed */
}
</style>
