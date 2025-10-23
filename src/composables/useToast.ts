import { ref, reactive } from 'vue'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  message?: string
}

const toasts = ref<Toast[]>([])

export function useToast() {
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      id,
      ...toast,
    }

    toasts.value.push(newToast)

    // Auto remove after 2 seconds
    setTimeout(() => {
      removeToast(id)
    }, 2000)

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAllToasts = () => {
    toasts.value = []
  }

  // Convenience methods
  const success = (title: string, message?: string) => {
    return addToast({ type: 'success', title, message })
  }

  const error = (title: string, message?: string) => {
    return addToast({ type: 'error', title, message })
  }

  const info = (title: string, message?: string) => {
    return addToast({ type: 'info', title, message })
  }

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    info,
  }
}
