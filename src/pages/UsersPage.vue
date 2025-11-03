<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { userProfileApi } from '@/services/api'
import TopBar from '@/components/layout/TopBar.vue'
import Card from '@/components/ui/Card.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'

interface Profile {
  user: string
  name: string
  classYear?: string
  major?: string
  bio: string
  favoriteDrink?: string
  favoriteCafe?: string
  avatar?: string
}

const loading = ref(false)
const error = ref<string | null>(null)
const profiles = ref<Profile[]>([])
const auth = useAuthStore()
const currentUserId = computed(() => auth.currentUser?.id)

const router = useRouter()
const goHome = () => {
  router.push('/')
}

const loadProfiles = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await userProfileApi.getAllProfiles()
    if (Array.isArray(res.data)) {
      const allProfiles: Profile[] = res.data
      const me = currentUserId.value
      profiles.value = me ? allProfiles.filter((p) => p.user !== me) : allProfiles
    } else {
      profiles.value = []
    }
  } catch (e: any) {
    error.value = e?.response?.data?.error || e?.message || 'Failed to load users'
  } finally {
    loading.value = false
  }
}

onMounted(loadProfiles)
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
        <h1 class="text-2xl font-display font-semibold text-latte-fg mb-2">Meet Coffee Drinkers</h1>
        <p class="text-latte-text-muted">Discover fellow members in the community.</p>
      </div>

      <div v-if="loading" class="text-center text-latte-text-muted py-8">Loading users...</div>
      <div v-else-if="error" class="text-center text-red-500 py-8">{{ error }}</div>

      <div v-else class="grid gap-4">
        <Card v-for="p in profiles" :key="p.user" class="p-4">
          <div class="flex items-center gap-4">
            <img
              :src="p.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || 'User')}&background=8B5CF6&color=fff&size=96`"
              alt="avatar"
              class="w-16 h-16 rounded-full object-cover"
            />
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-latte-fg">{{ p.name || 'Member' }}</h3>
                <span v-if="p.classYear || p.major" class="text-sm text-latte-text-muted">
                  {{ [p.major, p.classYear].filter(Boolean).join(' · ') }}
                </span>
              </div>
              <p class="text-sm text-latte-text-muted mt-1 line-clamp-2">{{ p.bio }}</p>
              <div class="text-xs text-latte-text-muted mt-2 flex gap-4">
                <span v-if="p.favoriteDrink">☕ Favorite: {{ p.favoriteDrink }}</span>
                <span v-if="p.favoriteCafe">🏠 Cafe: {{ p.favoriteCafe }}</span>
              </div>
            </div>
          </div>
        </Card>
        <div v-if="profiles.length === 0" class="text-center text-latte-text-muted py-8">
          No users yet. Ask friends to set up their profiles!
        </div>
      </div>
    </main>
  </div>
</template>
