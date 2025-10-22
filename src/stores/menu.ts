import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MenuCategory, MenuItem } from '@/types/menu'

export const useMenuStore = defineStore('menu', () => {
  const categories = ref<MenuCategory[]>([])
  const loading = ref(false)

  const loadMockMenu = () => {
    loading.value = true

    // Simulate loading delay
    setTimeout(() => {
      categories.value = [
        {
          id: 'drinks',
          name: 'Drinks',
          items: [
            {
              id: 'latte',
              name: 'Oat Milk Latte',
              description: 'Rich espresso with creamy oat milk',
              category: 'drinks',
              options: ['Oat Milk', 'Hot / Iced'],
            },
            {
              id: 'cappuccino',
              name: 'Cappuccino',
              description: 'Classic espresso with steamed milk foam',
              category: 'drinks',
              options: ['Whole Milk', 'Hot'],
            },
            {
              id: 'americano',
              name: 'Americano',
              description: 'Espresso with hot water',
              category: 'drinks',
              options: ['Hot / Iced'],
            },
            {
              id: 'cold-brew',
              name: 'Cold Brew',
              description: 'Smooth cold-brewed coffee',
              category: 'drinks',
              options: ['Iced'],
            },
            {
              id: 'matcha-latte',
              name: 'Matcha Latte',
              description: 'Ceremonial grade matcha with oat milk',
              category: 'drinks',
              options: ['Oat Milk', 'Hot / Iced'],
            },
            {
              id: 'golden-milk',
              name: 'Golden Milk',
              description: 'Turmeric latte with coconut milk',
              category: 'drinks',
              options: ['Coconut Milk', 'Hot'],
            },
            {
              id: 'chai-latte',
              name: 'Chai Latte',
              description: 'Spiced tea with steamed milk',
              category: 'drinks',
              options: ['Whole Milk', 'Hot / Iced'],
            },
          ],
        },
      ]
      loading.value = false
    }, 300)
  }

  return {
    categories,
    loading,
    loadMockMenu,
  }
})
