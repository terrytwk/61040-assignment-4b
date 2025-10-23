// API Response Types based on API specification
export type MenuItem = {
  id: string
  name: string
  description: string
  isActive: boolean
}

export type MenuOption = {
  id: string
  name: string
  required: boolean
  maxChoices: number
}

export type MenuChoice = {
  id: string
  name: string
}

export type MenuOptionWithChoices = MenuOption & {
  choices: MenuChoice[]
}

export type MenuItemWithOptions = MenuItem & {
  options: MenuOptionWithChoices[]
}

export type MenuCategory = {
  id: string
  name: string
  items: MenuItem[]
}

// Selection types for ordering
export type Selection = {
  option: string
  choice: string
}

export type OrderLine = {
  id: string
  item: string
  qty: number
  selections: Selection[]
}

export type OrderStatus = 'pending' | 'completed' | 'canceled'
