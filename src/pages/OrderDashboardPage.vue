<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import TopBar from '@/components/layout/TopBar.vue'
import Card from '@/components/ui/Card.vue'
import Toast from '@/components/ui/Toast.vue'
import { Clock, CheckCircle, Coffee, ArrowLeft, RefreshCw, ChevronDown } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'
import { getOrdersByStatus, completeOrder, getProfile } from '@/services/api'
import type { Order, OrderStatus, TimeFilter } from '@/types/orders'

const activeTab = ref<'pending' | 'completed'>('pending')
const timeFilter = ref<TimeFilter>('today')
const orders = ref<Order[]>([])
const customerNames = ref<Record<string, string>>({})
const loading = ref(false)
const completingOrders = ref<Set<string>>(new Set())

const { success, error } = useToast()

// Computed properties
const filteredOrders = computed(() => {
  let filtered = orders.value

  // Filter out orders without items
  filtered = filtered.filter((order) => order.lines && order.lines.length > 0)

  // Apply time filter
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  switch (timeFilter.value) {
    case 'today':
      filtered = filtered.filter((order) => new Date(order.createdAt) >= today)
      break
    case 'week':
      filtered = filtered.filter((order) => new Date(order.createdAt) >= weekAgo)
      break
    case 'all':
      // No additional filtering
      break
  }

  return filtered
})

const totalCount = computed(() => filteredOrders.value.length)

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

const getTimeFilterLabel = (filter: TimeFilter) => {
  switch (filter) {
    case 'today':
      return 'Today'
    case 'week':
      return 'This Week'
    case 'all':
      return 'All Time'
  }
}

// Methods
const loadCustomerNames = async (userIds: string[]) => {
  const uniqueUserIds = [...new Set(userIds)].filter((id) => id && !customerNames.value[id])

  for (const userId of uniqueUserIds) {
    try {
      const response = await getProfile(userId)
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const profile = response.data[0]
        customerNames.value[userId] = profile.name || userId
      } else {
        customerNames.value[userId] = userId // Fallback to user ID if no profile
      }
    } catch (err) {
      console.warn(`Failed to load profile for user ${userId}:`, err)
      customerNames.value[userId] = userId // Fallback to user ID on error
    }
  }
}

const loadOrders = async () => {
  loading.value = true
  try {
    const response = await getOrdersByStatus(activeTab.value)
    if (response.data && Array.isArray(response.data)) {
      orders.value = response.data.map((order) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        lines: order.lines || [], // Ensure lines is always an array
      }))

      // Load customer names for all unique users
      const userIds = orders.value.map((order) => order.user).filter(Boolean)
      await loadCustomerNames(userIds)
    } else {
      orders.value = []
    }
  } catch (err: any) {
    console.error('Failed to load orders:', err)
    error('Failed to load orders', err.response?.data?.error || 'Please try again.')
    orders.value = []
  } finally {
    loading.value = false
  }
}

const completeOrderAction = async (orderId: string) => {
  completingOrders.value.add(orderId)
  try {
    await completeOrder(orderId)
    success('Order completed', 'Order has been marked as completed.')
    // Reload orders to update the list
    await loadOrders()
  } catch (err: any) {
    console.error('Failed to complete order:', err)
    error('Failed to complete order', err.response?.data?.error || 'Please try again.')
  } finally {
    completingOrders.value.delete(orderId)
  }
}

const switchTab = (tab: 'pending' | 'completed') => {
  activeTab.value = tab
  loadOrders()
}

const switchTimeFilter = (filter: TimeFilter) => {
  timeFilter.value = filter
}

// Load orders when component mounts or tab changes
onMounted(() => {
  loadOrders()
})

watch(activeTab, () => {
  loadOrders()
})
</script>

<template>
  <div>
    <TopBar title="Order Dashboard" />
    <main class="max-w-screen-lg mx-auto px-4 pb-20 py-4">
      <!-- Back Button -->
      <div class="mb-4">
        <button
          @click="$router.push('/order')"
          class="flex items-center gap-2 px-4 py-2 text-latte-text-muted hover:text-latte-fg transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          <span class="text-sm font-medium">Back to Order</span>
        </button>
      </div>

      <!-- Header Controls -->
      <Card class="p-4 mb-6">
        <div class="flex gap-4 items-start sm:items-center justify-between">
          <!-- Tab Switcher -->
          <div class="flex space-x-1 bg-latte-muted rounded-xl p-1">
            <button
              @click="switchTab('pending')"
              class="flex items-center gap-2 py-2 px-3 rounded-lg transition-colors"
              :class="[
                activeTab === 'pending'
                  ? 'bg-latte-card text-latte-fg shadow-sm'
                  : 'text-latte-text-muted hover:text-latte-fg',
              ]"
            >
              <Clock class="w-4 h-4" />
              <span class="text-sm font-medium">Pending</span>
            </button>
            <button
              @click="switchTab('completed')"
              class="flex items-center gap-2 py-2 px-3 rounded-lg transition-colors"
              :class="[
                activeTab === 'completed'
                  ? 'bg-latte-card text-latte-fg shadow-sm'
                  : 'text-latte-text-muted hover:text-latte-fg',
              ]"
            >
              <CheckCircle class="w-4 h-4" />
              <span class="text-sm font-medium">Completed</span>
            </button>
          </div>

          <!-- Refresh Button -->
          <button
            @click="loadOrders"
            :disabled="loading"
            class="flex items-center gap-2 px-3 py-2 text-sm text-latte-text-muted hover:text-latte-fg transition-colors disabled:opacity-50"
          >
            <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
            <span class="hidden sm:inline">Refresh</span>
          </button>
        </div>

        <!-- Total Count -->
        <div class="mt-4 pt-4 border-t border-latte-border">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Coffee class="w-5 h-5 text-latte-accent" />
              <span class="text-sm font-medium text-latte-fg">
                {{ totalCount }} {{ activeTab }} order{{ totalCount !== 1 ? 's' : '' }}
              </span>
            </div>
            <div class="relative">
              <select
                v-model="timeFilter"
                @change="switchTimeFilter(timeFilter)"
                class="appearance-none bg-latte-card border border-latte-border rounded-lg px-3 py-1 pr-6 text-xs text-latte-fg focus:ring-2 focus:ring-latte-accent focus:border-latte-accent"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <!-- Orders List -->
      <div v-if="loading" class="text-center py-8">
        <div class="text-latte-text-muted">Loading orders...</div>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="text-center py-12">
        <div
          class="w-16 h-16 bg-latte-muted rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Coffee class="w-8 h-8 text-latte-text-muted" />
        </div>
        <h2 class="text-xl font-semibold text-latte-fg mb-2">No {{ activeTab }} orders</h2>
        <p class="text-latte-text-muted">
          {{
            timeFilter === 'today'
              ? 'No orders for today yet.'
              : timeFilter === 'week'
                ? 'No orders this week yet.'
                : 'No orders found.'
          }}
        </p>
      </div>

      <div v-else class="space-y-4">
        <Card
          v-for="order in filteredOrders"
          :key="order.order"
          class="p-4 hover:shadow-md transition-shadow"
        >
          <div class="space-y-3">
            <!-- Customer Name - Prominent -->
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-latte-fg">
                {{ customerNames[order.user] || order.user }}
              </h3>
              <!-- Time - Small and subtle -->
              <div class="text-xs text-latte-text-muted">
                {{ formatTime(order.createdAt) }}
              </div>
            </div>

            <!-- Order Items - Most Important -->
            <div v-if="order.lines && order.lines.length > 0" class="space-y-2">
              <div
                v-for="line in order.lines"
                :key="line.id"
                class="bg-latte-muted/30 rounded-lg p-3 border-l-4 border-latte-accent"
              >
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-semibold text-latte-fg text-base">
                    {{ line.displayItemName || 'Unknown Item' }}
                  </h4>
                  <span
                    class="text-sm font-medium text-latte-accent bg-latte-accent/10 px-2 py-1 rounded"
                  >
                    Qty: {{ line.qty || 1 }}
                  </span>
                </div>
                <div v-if="line.selections && line.selections.length > 0" class="space-y-1">
                  <div
                    v-for="selection in line.selections"
                    :key="`${selection.option}-${selection.choice}`"
                    class="text-sm text-latte-fg/80 bg-white/50 rounded px-2 py-1"
                  >
                    <span class="font-medium text-latte-accent"
                      >{{ selection.displayOptionName || 'Option' }}:</span
                    >
                    {{ selection.displayChoiceName || 'Choice' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- No Items Message -->
            <div v-else class="text-center py-4 text-latte-text-muted">
              <p class="text-sm">No items in this order</p>
            </div>

            <!-- Complete Button (only for pending orders) -->
            <div v-if="activeTab === 'pending'" class="pt-2">
              <button
                @click="completeOrderAction(order.order)"
                :disabled="completingOrders.has(order.order)"
                class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-transform"
                :class="[
                  completingOrders.has(order.order)
                    ? 'bg-latte-muted text-latte-text-muted cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 active:scale-95',
                ]"
              >
                <CheckCircle class="w-5 h-5" />
                <span v-if="completingOrders.has(order.order)">Completing...</span>
                <span v-else>Complete Order</span>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </main>

    <!-- Toast notifications -->
    <Toast />
  </div>
</template>

<style scoped>
/* Add any specific styles if needed */
</style>
