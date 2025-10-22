<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import TopBar from '@/components/layout/TopBar.vue'
import Modal from '@/components/layout/Modal.vue'
import AnnouncementCard from '@/components/home/AnnouncementCard.vue'
import EventList from '@/components/home/EventList.vue'
import FloatingQRButton from '@/components/home/FloatingQRButton.vue'
import QRCodeView from '@/components/ui/QRCodeView.vue'
import MenuSection from '@/components/menu/MenuSection.vue'

const app = useAppStore()

onMounted(() => {
  app.init()
})
</script>

<template>
  <div>
    <TopBar />
    <main class="max-w-screen-sm mx-auto px-4 pb-20">
      <!-- Welcome Section -->
      <div class="py-6">
        <h1 class="text-2xl font-display font-semibold text-latte-fg mb-2">Welcome back!</h1>
        <p class="text-latte-text-muted">Discover what's happening at Latte Lab</p>
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

    <FloatingQRButton @click="app.openQR()" />

    <Modal
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
