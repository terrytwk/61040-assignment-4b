<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { getProfile } from '@/services/api'
import TopBar from '@/components/layout/TopBar.vue'
import Modal from '@/components/layout/Modal.vue'
import AnnouncementCard from '@/components/home/AnnouncementCard.vue'
import EventList from '@/components/home/EventList.vue'
import FloatingQRButton from '@/components/home/FloatingQRButton.vue'
import QRCodeView from '@/components/ui/QRCodeView.vue'
import MenuSection from '@/components/menu/MenuSection.vue'
import Card from '@/components/ui/Card.vue'
import { Coffee, ArrowRight } from 'lucide-vue-next'

const app = useAppStore()
const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.currentUser)
const userDisplayName = ref<string>('')

const loadUserProfile = async () => {
  if (!currentUser.value) return

  try {
    const response = await getProfile(currentUser.value.id)
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const profile = response.data[0]
      userDisplayName.value = profile.name || currentUser.value.username || 'User'
    } else {
      userDisplayName.value = currentUser.value.username || 'User'
    }
  } catch (err) {
    console.warn('Failed to load user profile:', err)
    userDisplayName.value = currentUser.value.username || 'User'
  }
}

const handleLogin = () => {
  router.push('/login')
}

// Watch for authentication changes and load profile
watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated && currentUser.value) {
      loadUserProfile()
    } else {
      userDisplayName.value = ''
    }
  },
  { immediate: true },
)

onMounted(() => {
  app.init()
})
</script>

<template>
  <div>
    <TopBar :show-login="!isAuthenticated" />
    <main class="max-w-screen-sm mx-auto px-4" :class="{ 'pb-20': isAuthenticated }">
      <!-- Welcome Section -->
      <div class="py-6">
        <h1 class="text-2xl font-display font-semibold text-latte-fg mb-2">
          {{ isAuthenticated ? `Welcome back, ${userDisplayName}!` : 'Welcome to Latte Lab!' }}
        </h1>
        <p class="text-latte-text-muted">
          {{
            isAuthenticated
              ? "Discover what's happening at Latte Lab"
              : 'Your favorite coffee spot on campus'
          }}
        </p>
      </div>

      <!-- Login Prompt for Unauthenticated Users -->
      <div v-if="!isAuthenticated" class="mb-6">
        <Card class="p-6 text-center">
          <div class="flex flex-col items-center space-y-4">
            <div class="w-16 h-16 bg-latte-accent/10 rounded-full flex items-center justify-center">
              <Coffee class="w-8 h-8 text-latte-accent" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-latte-fg mb-2">Join Latte Lab</h3>
              <p class="text-latte-text-muted mb-4">
                Sign in to place orders, track your favorites, and enjoy exclusive member benefits.
              </p>
              <button
                @click="handleLogin"
                class="inline-flex items-center gap-2 px-6 py-3 bg-latte-accent text-white rounded-lg font-medium hover:bg-latte-accent/90 transition-colors"
              >
                Get Started
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      </div>

      <!-- Announcement -->
      <div class="mb-6">
        <AnnouncementCard
          v-if="app.showAnnouncement && app.announcement"
          :title="app.announcement.title"
          :body="app.announcement.body"
          @dismiss="app.dismissAnnouncement()"
        />
      </div>

      <!-- Events Section -->
      <section class="mb-8">
        <h2 class="text-xl font-display font-semibold text-latte-fg mb-4">Upcoming Events</h2>
        <EventList />
      </section>

      <!-- Menu Section -->
      <section class="mb-8">
        <h2 class="text-xl font-display font-semibold text-latte-fg mb-4">Cafe Menu</h2>
        <MenuSection />
      </section>
    </main>

    <!-- Floating QR Button - Only show for authenticated users -->
    <FloatingQRButton v-if="isAuthenticated" @click="app.openQR()" />

    <!-- QR Modal - Only show for authenticated users -->
    <Modal
      v-if="isAuthenticated"
      :model-value="app.isQRModalOpen"
      title="Member QR"
      @update:model-value="app.setQR($event)"
    >
      <div class="p-6">
        <div class="grid place-items-center gap-4">
          <div class="bg-white p-4 rounded-xl shadow-sm">
            <QRCodeView value="member:demo-12345" :size="200" />
          </div>
          <div class="text-center">
            <p class="text-sm text-latte-text-muted mb-2">Show this to the barista at checkout</p>
            <p class="text-xs text-latte-text-muted">Member ID: DEMO-12345</p>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
