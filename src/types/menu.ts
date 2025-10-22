export type MenuItem = {
  id: string
  name: string
  description: string
  category: string
  options: string[]
}

export type MenuCategory = {
  id: string
  name: string
  items: MenuItem[]
}
