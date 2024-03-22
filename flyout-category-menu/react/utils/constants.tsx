export const PATHS: { [index: string]: { parent: string; child: string; level: string } } = {
  '1': { parent: 'store.search#department', child: 'store.search#department', level: 'first' },
  '2': { parent: 'store.search#department', child: 'store.search#category', level: 'second' },
  '3': { parent: 'store.search#category', child: 'store.search#subcategory', level: 'third' },
  '4': { parent: 'store.search#category', child: 'store.search#subcategory', level: 'forth' },
}

export interface Category {
  id?: string
  slug: string
  children: Category[]
  name: string
  hideName?: boolean
}

export interface Runtime {
  navigate: ({}) => void
}
