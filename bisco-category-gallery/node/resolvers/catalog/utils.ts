import { compose, last, split } from 'ramda'
import crypto from 'crypto'

const pageTypeMapping: Record<string, string> = {
  Brand: 'brand',
  Department: 'department',
  Category: 'category',
  SubCategory: 'subcategory',
  NotFound: 'search',
  FullText: 'search',
  Search: 'search',
}

const lastSegment = compose<string, string[], string>(
  last,
  split('/')
)

export function hashMD5(text: string) {
  const hash = crypto.createHash('md5')
  return hash.update(text).digest('hex')
}

export function findCategoryInTree(
  tree: Category[],
  values: string[],
  index = 0
): Category | null {
  for (const node of tree) {
    const slug = lastSegment(node.url)
    if (slug.toUpperCase() === values[index].toUpperCase()) {
      if (index === values.length - 1) {
        return node
      }
      return findCategoryInTree(node.children, values, index + 1)
    }
  }
  return null
}


type CategoryMap = Record<string, Category>

/**
 * We are doing this because the `get category` API is not returning the values
 * for slug and href. So we get the whole category tree and get that info from
 * there instead until the Catalog team fixes this issue with the category API.
 */
export async function getCategoryInfo(
  catalog: Context['clients']['catalog'],
  id: number,
  levels: number
) {
  console.log(levels)
  const categories = await catalog.categoriesfromvbase()
  const mapCategories = categories.reduce(appendToMap, {}) as CategoryMap

  const category = mapCategories[id] || { url: '' }

  return category
}

export function buildCategoryMap(categoryTree: Category[]) {
  return categoryTree.reduce(appendToMap, {}) as CategoryMap
}

/**
 * That's a recursive function to fill an object like { [categoryId]: Category }
 * It will go down the category.children appending its children and so on.
 */
function appendToMap(mapCategories: CategoryMap, category: Category) {
  mapCategories[category.id] = category

  mapCategories = category.children.reduce(appendToMap, mapCategories)

  return mapCategories
}

export function translatePageType(catalogPageType: string): string {
  return pageTypeMapping[catalogPageType] || 'search'
}
