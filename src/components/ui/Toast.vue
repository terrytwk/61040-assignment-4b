<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="toasts.length > 0"
      class="fixed bottom-20 left-4 right-4 sm:bottom-4 sm:left-auto sm:right-4 sm:w-96 z-50 space-y-2"
      role="region"
      aria-live="polite"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
        :class="{
          'bg-green-50 ring-green-200': toast.type === 'success',
          'bg-red-50 ring-red-200': toast.type === 'error',
          'bg-blue-50 ring-blue-200': toast.type === 'info',
        }"
      >
        <div class="p-3 sm:p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <CheckCircle v-if="toast.type === 'success'" class="h-5 w-5 text-green-400" />
              <XCircle v-else-if="toast.type === 'error'" class="h-5 w-5 text-red-400" />
              <Info v-else class="h-5 w-5 text-blue-400" />
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p
                class="text-sm font-medium"
                :class="{
                  'text-green-800': toast.type === 'success',
                  'text-red-800': toast.type === 'error',
                  'text-blue-800': toast.type === 'info',
                }"
              >
                {{ toast.title }}
              </p>
              <p
                v-if="toast.message"
                class="mt-1 text-xs sm:text-sm break-all"
                :class="{
                  'text-green-700': toast.type === 'success',
                  'text-red-700': toast.type === 'error',
                  'text-blue-700': toast.type === 'info',
                }"
              >
                {{ toast.message }}
              </p>
            </div>
            <div class="ml-2 flex-shrink-0 flex">
              <button
                @click="removeToast(toast.id)"
                class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span class="sr-only">Close</span>
                <X class="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { CheckCircle, XCircle, Info, X } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>
