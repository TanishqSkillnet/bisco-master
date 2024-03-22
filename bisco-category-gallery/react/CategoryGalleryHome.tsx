import React from 'react'
import { pathOr } from 'ramda'
import { useQuery } from 'react-apollo'
import CATEGORIES_TREE from './queries/categoriesTree.graphql'
import { useCssHandles } from 'vtex.css-handles'
import { getLeafNodesByLevel } from './utils/categoryTreeUtils'
import CategoryGallery from './components/gallery/CategoryGallery'
import { useResponsiveValue } from 'vtex.responsive-values'

interface Props {
  itemsPerPage: {
    desktop: number
    tablet: number
    phone: number
  }
  treeLevel?: number
}

const CSS_HANDLES = ['categoryGalleryContainer']

const CategoryGalleryHome = ({
  treeLevel,
  itemsPerPage = {
    desktop: 5,
    tablet: 3,
    phone: 1,
  },
}: Props) => {
  const DEFAULT_TREE_LEVEL = 2
  const cardsPerPage = useResponsiveValue(itemsPerPage)

  const cssHandles = useCssHandles(CSS_HANDLES)

  const { data: categoryTree, loading: categoryTreeLoading } = useQuery(
    CATEGORIES_TREE,
    { variables: { treeLevel: treeLevel ? treeLevel : DEFAULT_TREE_LEVEL } }
  )

  const departments = pathOr([], ['categories'], categoryTree)
  const childCategories = getLeafNodesByLevel(departments, treeLevel)

  return categoryTreeLoading ? (
    <div />
  ) : (
    <div className={`${cssHandles.categoryGalleryContainer} justify-center`}>
      <CategoryGallery
        categories={childCategories}
        cardsPerPage={cardsPerPage}
      />
    </div>
  )
}

CategoryGalleryHome.schema = {
  title: 'admin/category-gallery.title',
  description: 'admin/category-gallery.description',
  type: 'object',
  properties: {
    treeLevel: {
      title: 'admin/category-gallery.tree-level.title',
      type: 'string',
    },
    itemsPerPage: {
      type: 'object',
      isLayout: true,
      title: 'admin/category-gallery.cards-per-page.title',
      properties: {
        desktop: {
          default: 6,
          type: 'number',
        },
        tablet: {
          default: 2,
          type: 'number',
        },
        phone: {
          default: 1,
          type: 'number',
        },
      },
    },
  },
}

export default CategoryGalleryHome
