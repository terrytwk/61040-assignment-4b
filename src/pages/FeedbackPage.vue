<script setup lang="ts">
import { ref, computed } from 'vue'
import TopBar from '@/components/layout/TopBar.vue'
import Card from '@/components/ui/Card.vue'
import { useAuthStore } from '@/stores/auth'
import { feedbackApi } from '@/services/api'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

const auth = useAuthStore()
const currentUser = computed(() => auth.currentUser)
const router = useRouter()
const { success, error: errorToast } = useToast()

const comment = ref('')
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)
const canSubmit = computed(() => !!currentUser.value && comment.value.trim().length > 0)

const goHome = () => {
  router.push('/')
}

const submit = async () => {
  submitError.value = null
  if (!currentUser.value) {
    submitError.value = 'You must be logged in to submit feedback.'
    return
  }
  if (!canSubmit.value) {
    submitError.value = 'Please enter a comment.'
    return
  }
  isSubmitting.value = true
  try {
    // Backend requires an order ID; use a general-purpose token for uncoupled feedback
    const res = await feedbackApi.create(currentUser.value.id, 'general-feedback', comment.value.trim())
    if (res.data && 'feedbackId' in res.data) {
      comment.value = ''
      success('Thanks for the feedback!')
      setTimeout(() => router.push('/'), 2000)
    } else if (res.data && 'error' in res.data) {
      submitError.value = res.data.error
    } else {
      submitError.value = 'Unexpected response from server.'
    }
  } catch (e: any) {
    submitError.value = e?.response?.data?.error || e?.message || 'Failed to submit feedback'
    errorToast('Feedback failed', submitError.value || undefined)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div>
    <TopBar />
    <main class="max-w-screen-sm mx-auto px-4 pb-20">
      <div class="pt-4">
        <button
          @click="goHome"
          class="flex items-center gap-2 px-4 py-2 text-latte-text-muted hover:text-latte-fg transition-colors bg-latte-card/80 backdrop-blur-sm rounded-lg border border-latte-border/50"
        >
          <ArrowLeft class="w-4 h-4" />
          <span class="text-sm font-medium">Back to Home</span>
        </button>
      </div>
      <div class="py-6">
        <h1 class="text-2xl font-display font-semibold text-latte-fg mb-2">Give Feedback</h1>
        <p class="text-latte-text-muted">Share your thoughts about a completed order.</p>
      </div>

      <Card class="p-6 mb-6">
        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-latte-fg mb-1">Your Feedback</label>
            <textarea
              v-model="comment"
              rows="4"
              placeholder="What went well? What can be improved?"
              class="w-full px-3 py-2 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-latte-accent"
            />
          </div>
          <div class="flex items-center gap-3">
            <button
              type="submit"
              :disabled="!canSubmit || isSubmitting"
              class="inline-flex items-center gap-2 px-4 py-2 bg-latte-accent text-white rounded-lg font-medium hover:bg-latte-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit Feedback' }}
            </button>
            <span v-if="submitError" class="text-sm text-red-600">{{ submitError }}</span>
          </div>
        </form>
      </Card>
    </main>
  </div>
</template>
