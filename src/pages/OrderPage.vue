<script setup lang="ts">
import { ref, watch } from 'vue'
import TopBar from '@/components/layout/TopBar.vue'
import Card from '@/components/ui/Card.vue'
import { QrCode, FileText, Camera, Search, Coffee, ArrowLeft } from 'lucide-vue-next'

const activeTab = ref<'qr' | 'form'>('qr')
const kerbInput = ref('')
const showUserCard = ref(false)
const selectedDrink = ref('')
const showPOS = ref(false)
const showDrinkOptions = ref(false)
const currentDrink = ref<any>(null)
const drinkOptions = ref({
  temperature: '',
  milk: '',
})

// Mock user data
const userData = ref({
  name: 'Alex Chen',
  email: 'alex.chen@email.com',
  bio: 'Coffee enthusiast and latte art lover. Always exploring new roasters and perfecting my morning routine.',
  avatar:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
})

// Simple drink menu
const drinks = [
  {
    id: 'latte',
    name: 'Latte',
    description: 'Rich espresso with steamed milk',
    temperatures: ['Hot', 'Iced'],
    milks: ['Whole Milk', 'Oat Milk'],
  },
  {
    id: 'americano',
    name: 'Americano',
    description: 'Espresso with hot water',
    temperatures: ['Hot', 'Iced'],
    milks: [],
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    description: 'Espresso with milk foam',
    temperatures: ['Hot'],
    milks: ['Whole Milk', 'Oat Milk'],
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    description: 'Smooth cold-brewed coffee',
    temperatures: ['Iced'],
    milks: [],
  },
]

const switchTab = (tab: 'qr' | 'form') => {
  activeTab.value = tab
  // Reset states when switching tabs
  showUserCard.value = false
  showPOS.value = false
  selectedDrink.value = ''
  kerbInput.value = ''
  showDrinkOptions.value = false
  currentDrink.value = null
  drinkOptions.value = { temperature: '', milk: '' }
}

const handleFind = () => {
  if (kerbInput.value.trim()) {
    // Simulate finding user
    showUserCard.value = true
    showPOS.value = true
  }
}

const goBackToKerb = () => {
  showUserCard.value = false
  showPOS.value = false
  selectedDrink.value = ''
  showDrinkOptions.value = false
  currentDrink.value = null
  drinkOptions.value = { temperature: '', milk: '' }
}

const selectDrink = (drink: any) => {
  if (currentDrink.value?.id === drink.id) {
    // Toggle off if same drink clicked
    currentDrink.value = null
    showDrinkOptions.value = false
    drinkOptions.value = { temperature: '', milk: '' }
    selectedDrink.value = ''
  } else {
    // Select new drink
    currentDrink.value = drink
    showDrinkOptions.value = true
    drinkOptions.value = { temperature: '', milk: '' }
    selectedDrink.value = ''
  }
}

const updateSelectedDrink = () => {
  if (currentDrink.value && drinkOptions.value.temperature) {
    selectedDrink.value = `${currentDrink.value.name} (${drinkOptions.value.temperature}${drinkOptions.value.milk ? `, ${drinkOptions.value.milk}` : ''})`
  }
}

const submitOrder = () => {
  if (selectedDrink.value) {
    alert(`Order submitted!\nCustomer: ${userData.value.name}\nDrink: ${selectedDrink.value}`)
    // Reset the form
    showUserCard.value = false
    showPOS.value = false
    selectedDrink.value = ''
    kerbInput.value = ''
    showDrinkOptions.value = false
    currentDrink.value = null
    drinkOptions.value = { temperature: '', milk: '' }
  }
}

// Watch for changes in drink options to update selected drink automatically
watch([() => drinkOptions.value.temperature, () => drinkOptions.value.milk], () => {
  if (currentDrink.value && drinkOptions.value.temperature) {
    selectedDrink.value = `${currentDrink.value.name} (${drinkOptions.value.temperature}${drinkOptions.value.milk ? `, ${drinkOptions.value.milk}` : ''})`
  }
})
</script>

<template>
  <div>
    <TopBar title="Order" :show-logout="true" />
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
                Kerb
              </label>
              <div class="flex gap-2">
                <input
                  id="kerb"
                  v-model="kerbInput"
                  type="text"
                  placeholder="Enter Kerb ID"
                  class="flex-1 h-12 rounded-xl border-latte-border focus:ring-2 focus:ring-latte-accent"
                />
                <button
                  @click="handleFind"
                  class="inline-flex items-center justify-center rounded-xl h-12 px-4 font-semibold bg-latte-accent text-white active:scale-95 transition-transform"
                >
                  <Search class="w-4 h-4" />
                </button>
              </div>
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
      <Card v-if="showUserCard" class="p-6">
        <div class="flex items-center space-x-4">
          <img
            :src="userData.avatar"
            :alt="`${userData.name}'s avatar`"
            class="w-16 h-16 rounded-full object-cover border-2 border-latte-border"
          />
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-latte-fg">{{ userData.name }}</h3>
            <p class="text-sm text-latte-text-muted">{{ userData.email }}</p>
            <p class="text-sm text-latte-fg/80 mt-1">{{ userData.bio }}</p>
          </div>
        </div>
      </Card>

      <!-- POS Interface -->
      <Card v-if="showPOS" class="p-6">
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-latte-fg">Select Drink</h3>

          <!-- Drink Selection List -->
          <div class="space-y-3">
            <div
              v-for="drink in drinks"
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
                  <!-- Temperature Selection -->
                  <div v-if="drink.temperatures?.length">
                    <h5 class="text-sm font-semibold text-latte-fg mb-2">Temperature</h5>
                    <div class="flex gap-2">
                      <button
                        v-for="temp in drink.temperatures"
                        :key="temp"
                        @click="drinkOptions.temperature = temp"
                        class="px-3 py-2 rounded-lg border text-sm transition-colors"
                        :class="[
                          drinkOptions.temperature === temp
                            ? 'border-latte-accent bg-latte-accent text-white'
                            : 'border-latte-border hover:border-latte-accent/50',
                        ]"
                      >
                        {{ temp }}
                      </button>
                    </div>
                  </div>

                  <!-- Milk Selection -->
                  <div v-if="drink.milks?.length">
                    <h5 class="text-sm font-semibold text-latte-fg mb-2">Milk</h5>
                    <div class="flex gap-2 flex-wrap">
                      <button
                        v-for="milk in drink.milks"
                        :key="milk"
                        @click="drinkOptions.milk = milk"
                        class="px-3 py-2 rounded-lg border text-sm transition-colors"
                        :class="[
                          drinkOptions.milk === milk
                            ? 'border-latte-accent bg-latte-accent text-white'
                            : 'border-latte-border hover:border-latte-accent/50',
                        ]"
                      >
                        {{ milk }}
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
            :disabled="!selectedDrink"
            class="w-full inline-flex items-center justify-center rounded-xl h-12 px-4 font-semibold transition-transform"
            :class="[
              selectedDrink
                ? 'bg-latte-accent text-white active:scale-95'
                : 'bg-latte-muted text-latte-text-muted cursor-not-allowed',
            ]"
          >
            Submit Order
          </button>
        </div>
      </Card>
    </main>
  </div>
</template>
