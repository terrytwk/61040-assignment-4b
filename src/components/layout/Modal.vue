<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const dialogRef = ref<HTMLDialogElement>()
const closeButtonRef = ref<HTMLButtonElement>()

// Focus trap
const trapFocus = (e: KeyboardEvent) => {
  if (e.key !== 'Tab') return

  const focusableElements = dialogRef.value?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  ) as NodeListOf<HTMLElement>

  if (!focusableElements.length) return

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (e.shiftKey) {
    if (document.activeElement === firstElement && lastElement) {
      lastElement.focus()
      e.preventDefault()
    }
  } else {
    if (document.activeElement === lastElement && firstElement) {
      firstElement.focus()
      e.preventDefault()
    }
  }
}

// Handle escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('update:modelValue', false)
  }
}

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      await nextTick()
      closeButtonRef.value?.focus()
      document.addEventListener('keydown', trapFocus)
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.removeEventListener('keydown', trapFocus)
      document.removeEventListener('keydown', handleKeydown)
    }
  },
)

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === dialogRef.value) {
    emit('update:modelValue', false)
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 bg-black/30" @click="handleBackdropClick">
      <dialog
        ref="dialogRef"
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="title ? 'modal-title' : undefined"
        class="fixed inset-0 z-50 flex items-center justify-center rounded-2xl"
        @click.stop
      >
        <div
          class="relative bg-latte-card rounded-2xl border border-latte-border shadow-md max-w-md w-full"
        >
          <div class="p-6">
            <div v-if="title" class="flex items-center justify-between mb-4">
              <h2 id="modal-title" class="text-xl font-semibold text-latte-fg">
                {{ title }}
              </h2>
              <button
                ref="closeButtonRef"
                @click="emit('update:modelValue', false)"
                class="text-latte-text-muted hover:text-latte-fg transition-colors"
                aria-label="Close modal"
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
            <div v-else class="flex justify-end mb-4">
              <button
                ref="closeButtonRef"
                @click="emit('update:modelValue', false)"
                class="text-latte-text-muted hover:text-latte-fg transition-colors"
                aria-label="Close modal"
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
            <slot />
          </div>
        </div>
      </dialog>
    </div>
  </Teleport>
</template>
