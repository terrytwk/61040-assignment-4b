<script setup lang="ts">
import { onMounted } from 'vue'
import { useMenuStore } from '@/stores/menu'
import MenuItem from './MenuItem.vue'
import Skeleton from '@/components/ui/Skeleton.vue'

const menuStore = useMenuStore()

onMounted(() => {
  menuStore.loadMenuItems()
})
</script>

<template>
  <div>
    <div v-if="menuStore.loading" class="space-y-4">
      <Skeleton :lines="3" />
    </div>
    <div v-else class="space-y-1">
      <MenuItem v-for="item in menuStore.itemsWithOptions" :key="item.id" :item="item" />
    </div>
  </div>
</template>
