import { defineStore } from 'pinia'
import { ref } from 'vue'
import { orderApi } from '@/services/api'
import type { Selection } from '@/types/menu'

export interface OrderLine {
  id: string
  item: string
  qty: number
  selections: Selection[]
}

export interface Order {
  id: string
  user: string
  status: 'pending' | 'completed' | 'canceled'
  createdAt: string
  lines: OrderLine[]
}

export const useOrderStore = defineStore('order', () => {
  const currentOrder = ref<Order | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Open a new order for a user
  const openOrder = async (userId: string) => {
    loading.value = true
    error.value = null

    try {
      console.log('Opening order for user:', userId)
      const response = await orderApi.openOrder(userId)
      console.log('Order opened:', response.data)

      if ('error' in response.data) {
        throw new Error(response.data.error)
      }

      // Create a new order object
      currentOrder.value = {
        id: response.data.order,
        user: userId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        lines: [],
      }

      return response.data.order
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to open order'
      console.error('Error opening order:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Add an item to the current order
  const addItemToOrder = async (
    itemId: string,
    qty: number,
    selections: Selection[],
    displayItemName: string,
    selectionsWithDisplayNames: Array<{
      option: string
      choice: string
      displayOptionName: string
      displayChoiceName: string
    }>,
  ) => {
    if (!currentOrder.value) {
      throw new Error('No active order')
    }

    loading.value = true
    error.value = null

    try {
      console.log('Adding item to order:', {
        itemId,
        qty,
        selections,
        displayItemName,
        selectionsWithDisplayNames,
      })
      const response = await orderApi.addItem(
        currentOrder.value.id,
        itemId,
        qty,
        displayItemName,
        selectionsWithDisplayNames,
      )
      console.log('Item added:', response.data)

      if ('error' in response.data) {
        throw new Error(response.data.error)
      }

      // Refresh order lines
      await refreshOrderLines()

      return response.data.line
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add item to order'
      console.error('Error adding item to order:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Submit the current order
  const submitOrder = async () => {
    if (!currentOrder.value) {
      throw new Error('No active order')
    }

    loading.value = true
    error.value = null

    try {
      console.log('Submitting order:', currentOrder.value.id)
      const response = await orderApi.submitOrder(currentOrder.value.id)
      console.log('Order submitted:', response.data)

      if ('error' in response.data) {
        throw new Error(response.data.error)
      }

      // Update order status
      currentOrder.value.status = 'pending' // Submit doesn't change status, just validates

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to submit order'
      console.error('Error submitting order:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Refresh order lines from the server
  const refreshOrderLines = async () => {
    if (!currentOrder.value) {
      return
    }

    try {
      console.log('Refreshing order lines for order:', currentOrder.value.id)
      const response = await orderApi.getOrderLines(currentOrder.value.id)
      console.log('Order lines:', response.data)

      if ('error' in response.data) {
        throw new Error(response.data.error)
      }

      // Update the order lines
      currentOrder.value.lines = response.data.map((lineData: any) => ({
        id: lineData.line.id,
        item: lineData.line.item,
        qty: lineData.line.qty,
        selections: lineData.line.selections || [],
      }))
    } catch (err) {
      console.error('Error refreshing order lines:', err)
      // Don't throw here, just log the error
    }
  }

  // Get order status
  const getOrderStatus = async () => {
    if (!currentOrder.value) {
      return null
    }

    try {
      const response = await orderApi.getOrderStatus(currentOrder.value.id)

      if ('error' in response.data) {
        throw new Error(response.data.error)
      }

      return response.data[0]?.status || 'pending'
    } catch (err) {
      console.error('Error getting order status:', err)
      return 'pending'
    }
  }

  // Clear the current order
  const clearOrder = () => {
    currentOrder.value = null
    error.value = null
  }

  // Check if order has items
  const hasItems = () => {
    return currentOrder.value && currentOrder.value.lines.length > 0
  }

  return {
    currentOrder,
    loading,
    error,
    openOrder,
    addItemToOrder,
    submitOrder,
    refreshOrderLines,
    getOrderStatus,
    clearOrder,
    hasItems,
  }
})
