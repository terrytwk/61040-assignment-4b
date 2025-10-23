export interface Order {
  order: string
  user: string
  createdAt: Date
  lines: OrderLine[]
}

export interface OrderLine {
  id: string
  item: string
  qty: number
  displayItemName: string
  selections: Array<{
    option: string
    choice: string
    displayOptionName: string
    displayChoiceName: string
  }>
}

export type OrderStatus = 'pending' | 'completed' | 'canceled'

export type TimeFilter = 'today' | 'week' | 'all'
