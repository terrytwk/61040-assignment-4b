import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MenuItem, MenuItemWithOptions, MenuOptionWithChoices, MenuChoice } from '@/types/menu'
import { menuApi } from '@/services/api'

export const useMenuStore = defineStore('menu', () => {
  const items = ref<MenuItem[]>([])
  const itemsWithOptions = ref<MenuItemWithOptions[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadMenuItems = async () => {
    loading.value = true
    error.value = null

    try {
      console.log('Starting to load menu items...')
      console.log('API base URL:', import.meta.env.VITE_API_BASE_URL || '/api')

      // First, get all active menu items from the backend
      const itemsResponse = await menuApi.getAllActiveItems()
      console.log('Items response:', itemsResponse.data)

      if (!itemsResponse.data || itemsResponse.data.length === 0) {
        error.value = 'No menu items found. Please create menu items in the backend first.'
        return
      }

      const itemsWithOptionsData: MenuItemWithOptions[] = []

      // For each item, fetch its options and choices
      for (const itemData of itemsResponse.data) {
        const item = itemData.item
        console.log(`Processing item: ${item.name} (ID: ${item.id})`)

        try {
          // Fetch options for this item
          const optionsResponse = await menuApi.getOptionsForItem(item.id)
          console.log(`Options for ${item.name}:`, optionsResponse.data)

          const optionsWithChoices: MenuOptionWithChoices[] = []

          // For each option, fetch its choices
          for (const optionData of optionsResponse.data) {
            const option = optionData.option
            console.log(`Processing option: ${option.id} for item ${item.name}`)

            try {
              const choicesResponse = await menuApi.getChoicesFor(item.id, option.id)
              const choices = choicesResponse.data.map(
                (choiceData: { choice: MenuChoice }) => choiceData.choice,
              )

              optionsWithChoices.push({
                ...option,
                choices,
              })
            } catch (choicesError) {
              console.warn(`Failed to fetch choices for option ${option.id}:`, choicesError)
              // Add option without choices
              optionsWithChoices.push({
                ...option,
                choices: [],
              })
            }
          }

          // Create the menu item with options
          const menuItem: MenuItem = {
            id: item.id,
            name: item.name,
            description: item.description,
            isActive: true,
          }

          itemsWithOptionsData.push({
            ...menuItem,
            options: optionsWithChoices,
          })
        } catch (optionsError) {
          console.warn(`Failed to fetch options for item ${item.name}:`, optionsError)
          // Add item without options
          const menuItem: MenuItem = {
            id: item.id,
            name: item.name,
            description: item.description,
            isActive: true,
          }
          itemsWithOptionsData.push({
            ...menuItem,
            options: [],
          })
        }
      }

      if (itemsWithOptionsData.length === 0) {
        error.value = 'No menu items found. Please create menu items in the backend first.'
      } else {
        items.value = itemsWithOptionsData.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          isActive: item.isActive,
        }))
        itemsWithOptions.value = itemsWithOptionsData
        console.log(`Successfully loaded ${itemsWithOptionsData.length} menu items`)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load menu items'
      console.error('Error loading menu items:', err)
    } finally {
      loading.value = false
    }
  }

  const getItemWithOptions = (itemId: string): MenuItemWithOptions | undefined => {
    return itemsWithOptions.value.find((item) => item.id === itemId)
  }

  const validateSelections = async (
    itemId: string,
    selections: Array<{ option: string; choice: string }>,
  ) => {
    try {
      console.log('Validating selections for item:', itemId)
      console.log('Selections:', selections)

      const response = await menuApi.validateSelectionSet(itemId, selections)
      console.log('Full validation response:', response)
      console.log('Validation response data:', response.data)
      console.log('Response data type:', typeof response.data)
      console.log('Is array:', Array.isArray(response.data))

      // Check if the response is an error object
      if (response.data && typeof response.data === 'object' && 'error' in response.data) {
        console.log('Returning error object:', { ok: false, reason: response.data.error })
        return { ok: false, reason: response.data.error }
      }

      // Check if the response is an array with validation results
      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log('Returning validation result:', response.data[0])
        return response.data[0]
      }

      // Fallback for unexpected response format
      console.log('Unexpected response format, returning fallback error')
      return { ok: false, reason: 'Unexpected response format' }
    } catch (error) {
      console.error('Error validating selections:', error)
      return { ok: false, reason: 'Validation failed' }
    }
  }

  return {
    items,
    itemsWithOptions,
    loading,
    error,
    loadMenuItems,
    getItemWithOptions,
    validateSelections,
  }
})
