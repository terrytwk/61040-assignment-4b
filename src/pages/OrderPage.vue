<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TopBar from '@/components/layout/TopBar.vue'
import Card from '@/components/ui/Card.vue'
import Toast from '@/components/ui/Toast.vue'
import KerbSearch from '@/components/profile/KerbSearch.vue'
import {
  QrCode,
  FileText,
  Camera,
  Search,
  Coffee,
  ArrowLeft,
  CheckCircle,
  BarChart3,
} from 'lucide-vue-next'
import { useMenuStore } from '@/stores/menu'
import { useOrderStore } from '@/stores/order'
import { useToast } from '@/composables/useToast'
import type { MenuItemWithOptions, Selection } from '@/types/menu'

const activeTab = ref<'qr' | 'form'>('qr')
const kerbInput = ref('')
const selectedUser = ref<{ user: string; username: string } | null>(null)
const showUserCard = ref(false)
const selectedDrink = ref('')
const showPOS = ref(false)
const showDrinkOptions = ref(false)
const currentDrink = ref<MenuItemWithOptions | null>(null)
const drinkSelections = ref<Record<string, string>>({})
const orderSubmitted = ref(false)
const submittingOrder = ref(false)

// Initialize stores and composables
const menuStore = useMenuStore()
const orderStore = useOrderStore()
const router = useRouter()
const { success, error } = useToast()

// Load menu items on component mount
onMounted(async () => {
  await menuStore.loadMenuItems()
})

const switchTab = (tab: 'qr' | 'form') => {
  activeTab.value = tab
  // Reset states when switching tabs
  showUserCard.value = false
  showPOS.value = false
  selectedDrink.value = ''
  kerbInput.value = ''
  selectedUser.value = null
  showDrinkOptions.value = false
  currentDrink.value = null
  drinkSelections.value = {}
}

const goBackToKerb = () => {
  // Return to the search tab and clear current selection
  activeTab.value = 'form'
  showUserCard.value = false
  showPOS.value = false
  selectedUser.value = null
  selectedDrink.value = ''
  showDrinkOptions.value = false
  currentDrink.value = null
  drinkSelections.value = {}
}

const handleUserSelect = async (user: { user: string; username: string }) => {
  selectedUser.value = user
  try {
    // Open a new order for the selected user
    await orderStore.openOrder(user.user)

    // Show the user card and POS interface
    showUserCard.value = true
    showPOS.value = true
    orderSubmitted.value = false

    success('User selected', `Order opened for ${user.username}`)
  } catch (err) {
    console.error('Failed to open order:', err)
    error('Failed to open order', 'Please try again.')
  }
}

const goToDashboard = () => {
  router.push('/order-dashboard')
}

const selectDrink = (drink: MenuItemWithOptions) => {
  if (currentDrink.value?.id === drink.id) {
    // Toggle off if same drink clicked
    currentDrink.value = null
    showDrinkOptions.value = false
    drinkSelections.value = {}
    selectedDrink.value = ''
  } else {
    // Select new drink
    currentDrink.value = drink
    showDrinkOptions.value = true
    drinkSelections.value = {}
    selectedDrink.value = ''
  }
}

const updateSelectedDrink = () => {
  if (currentDrink.value) {
    const selections = Object.entries(drinkSelections.value)
      .filter(([_, choiceId]) => choiceId)
      .map(([optionId, choiceId]) => {
        const option = currentDrink.value?.options.find((opt) => opt.id === optionId)
        const choice = option?.choices.find((ch) => ch.id === choiceId)
        return choice?.name || ''
      })
      .filter(Boolean)

    selectedDrink.value = `${currentDrink.value.name}${selections.length ? ` (${selections.join(', ')})` : ''}`
  }
}

const selectOption = (optionId: string, choiceId: string) => {
  drinkSelections.value[optionId] = choiceId
  updateSelectedDrink()
}

const submitOrder = async () => {
  if (!selectedDrink.value || !currentDrink.value || !orderStore.currentOrder) {
    return
  }

  submittingOrder.value = true

  try {
    // Convert selections to API format
    const selections: Selection[] = Object.entries(drinkSelections.value)
      .filter(([_, choiceId]) => choiceId)
      .map(([optionId, choiceId]) => ({
        option: optionId,
        choice: choiceId,
      }))

    // Validate selections before adding to order
    console.log('About to validate selections for item:', currentDrink.value.id)
    console.log('Selections to validate:', selections)
    const validation = await menuStore.validateSelections(currentDrink.value.id, selections)
    console.log('Validation result:', validation)
    console.log('Validation type:', typeof validation)
    console.log('Validation.ok:', validation?.ok)

    if (!validation.ok) {
      error('Invalid selection', validation.reason)
      return
    }

    // Prepare selections with display names
    const selectionsWithDisplayNames = Object.entries(drinkSelections.value)
      .filter(([_, choiceId]) => choiceId)
      .map(([optionId, choiceId]) => {
        // Find the option and choice names from the menu data
        const option = currentDrink.value?.options.find((opt) => opt.id === optionId)
        const choice = option?.choices.find((ch) => ch.id === choiceId)

        return {
          option: optionId,
          choice: choiceId,
          displayOptionName: option?.name || 'Unknown Option',
          displayChoiceName: choice?.name || 'Unknown Choice',
        }
      })

    // Add the item to the order
    await orderStore.addItemToOrder(
      currentDrink.value.id,
      1,
      selections,
      currentDrink.value.name,
      selectionsWithDisplayNames,
    )

    // Submit the order
    await orderStore.submitOrder()

    // Show success toast
    success('Order submitted successfully!', `Order ID: ${orderStore.currentOrder?.id}`)

    // Reset the form and go back to initial screen
    selectedDrink.value = ''
    showDrinkOptions.value = false
    currentDrink.value = null
    drinkSelections.value = {}
    orderSubmitted.value = false
    showUserCard.value = false
    showPOS.value = false
    orderStore.clearOrder()

    console.log('Order submitted successfully!')
  } catch (err) {
    console.error('Failed to submit order:', err)
    error('Failed to submit order', err instanceof Error ? err.message : 'Unknown error')
  } finally {
    submittingOrder.value = false
  }
}

// Watch for changes in drink selections to update selected drink automatically
watch(
  drinkSelections,
  () => {
    updateSelectedDrink()
  },
  { deep: true },
)
</script>

<template>
  <div>
    <TopBar title="Order" :show-logout="true">
      <template #right>
        <button
          @click="goToDashboard"
          class="flex items-center gap-2 px-3 py-2 text-sm text-latte-text-muted hover:text-latte-fg transition-colors"
          title="Order Dashboard"
        >
          <BarChart3 class="w-4 h-4" />
          <span class="hidden sm:inline">Dashboard</span>
        </button>
      </template>
    </TopBar>
    <main class="max-w-screen-sm mx-auto px-4 pb-20 py-4">
      <!-- Initial Tab Switcher and Input (shown when no user found) -->
      <template v-if="!showUserCard">
        <!-- Tab Switcher -->
        <Card class="p-4 mb-6">
          <div class="flex space-x-1 bg-latte-muted rounded-xl p-1">
            <button
              @click="switchTab('qr')"
              class="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors"
              :class="[
                activeTab === 'qr'
                  ? 'bg-latte-card text-latte-fg shadow-sm'
                  : 'text-latte-text-muted hover:text-latte-fg',
              ]"
            >
              <QrCode class="w-4 h-4" />
              <span class="text-sm font-medium">QR</span>
            </button>
            <button
              @click="switchTab('form')"
              class="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors"
              :class="[
                activeTab === 'form'
                  ? 'bg-latte-card text-latte-fg shadow-sm'
                  : 'text-latte-text-muted hover:text-latte-fg',
              ]"
            >
              <FileText class="w-4 h-4" />
              <span class="text-sm font-medium">Form</span>
            </button>
          </div>
        </Card>

        <!-- QR Scanner Tab -->
        <Card v-if="activeTab === 'qr'" class="p-6">
          <div class="text-center space-y-4">
            <div
              class="w-16 h-16 bg-latte-muted rounded-full flex items-center justify-center mx-auto"
            >
              <Camera class="w-8 h-8 text-latte-text-muted" />
            </div>
            <h3 class="text-lg font-semibold text-latte-fg">Scan QR Code</h3>
            <p class="text-latte-text-muted">
              Point camera at customer's QR code to find their order
            </p>
            <button
              class="inline-flex items-center justify-center rounded-xl h-12 px-6 font-semibold bg-latte-accent text-white active:scale-95 transition-transform"
            >
              Open Camera
            </button>
          </div>
        </Card>

        <!-- Form Input Tab -->
        <Card v-if="activeTab === 'form'" class="p-6">
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-latte-fg">Find by Kerb</h3>
            <div>
              <label
                for="kerb"
                class="uppercase tracking-wider text-xs text-latte-fg/70 block mb-2"
              >
                Search for User
              </label>
              <KerbSearch
                placeholder="Type a username to search..."
                @user-select="handleUserSelect"
              />
            </div>
          </div>
        </Card>
      </template>

      <!-- Back Button (above user card) -->
      <div v-if="showUserCard" class="mb-4">
        <button
          @click="goBackToKerb"
          class="flex items-center gap-2 px-4 py-2 text-latte-text-muted hover:text-latte-fg transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          <span class="text-sm font-medium">Back to Search</span>
        </button>
      </div>

      <!-- User Card Display -->
      <Card v-if="showUserCard && selectedUser" class="p-6">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-600 font-semibold text-xl">
              {{ selectedUser.username.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-latte-fg">{{ selectedUser.username }}</h3>
            <p class="text-sm text-latte-text-muted">{{ selectedUser.username }}@mit.edu</p>
            <p class="text-sm text-latte-fg/80 mt-1">Ready to place order</p>
          </div>
        </div>
      </Card>

      <!-- POS Interface -->
      <Card v-if="showPOS" class="p-6">
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-latte-fg">Select Drink</h3>

          <!-- Loading State -->
          <div v-if="menuStore.loading" class="text-center py-8">
            <div class="text-latte-text-muted">Loading menu items...</div>
          </div>

          <!-- Error State -->
          <div v-else-if="menuStore.error" class="text-center py-8">
            <div class="text-red-500">Error loading menu: {{ menuStore.error }}</div>
          </div>

          <!-- Order Store Error -->
          <div v-if="orderStore.error" class="text-center py-4">
            <div class="text-red-500">Order Error: {{ orderStore.error }}</div>
          </div>

          <!-- Drink Selection List -->
          <div v-else class="space-y-3">
            <div
              v-for="drink in menuStore.itemsWithOptions"
              :key="drink.id"
              class="rounded-xl border transition-all"
              :class="[
                currentDrink?.id === drink.id
                  ? 'border-latte-accent bg-latte-accent/5'
                  : 'border-latte-border',
              ]"
            >
              <!-- Drink Button -->
              <button @click="selectDrink(drink)" class="w-full p-4 text-left">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-latte-muted rounded-lg flex items-center justify-center">
                    <Coffee class="w-5 h-5 text-latte-text-muted" />
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-latte-fg">{{ drink.name }}</h4>
                    <p class="text-xs text-latte-text-muted">{{ drink.description }}</p>
                  </div>
                </div>
              </button>

              <!-- Inline Options (expanded below selected drink) -->
              <div
                v-if="currentDrink?.id === drink.id && showDrinkOptions"
                class="px-4 pb-4 border-t border-latte-border/50"
              >
                <div class="pt-4 space-y-4">
                  <!-- Dynamic Options -->
                  <div v-for="option in drink.options" :key="option.id">
                    <h5 class="text-sm font-semibold text-latte-fg mb-2">
                      {{ option.name }}
                      <span v-if="option.required" class="text-red-500">*</span>
                    </h5>
                    <div class="flex gap-2 flex-wrap">
                      <button
                        v-for="choice in option.choices"
                        :key="choice.id"
                        @click="selectOption(option.id, choice.id)"
                        class="px-3 py-2 rounded-lg border text-sm transition-colors"
                        :class="[
                          drinkSelections[option.id] === choice.id
                            ? 'border-latte-accent bg-latte-accent text-white'
                            : 'border-latte-border hover:border-latte-accent/50',
                        ]"
                      >
                        {{ choice.name }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Order Button -->
          <button
            @click="submitOrder"
            :disabled="!selectedDrink || submittingOrder"
            class="w-full inline-flex items-center justify-center rounded-xl h-12 px-4 font-semibold transition-transform"
            :class="[
              selectedDrink && !submittingOrder
                ? 'bg-latte-accent text-white active:scale-95'
                : 'bg-latte-muted text-latte-text-muted cursor-not-allowed',
            ]"
          >
            <span v-if="submittingOrder">Submitting...</span>
            <span v-else>Submit Order</span>
          </button>
        </div>
      </Card>
    </main>

    <!-- Toast notifications -->
    <Toast />
  </div>
</template>
