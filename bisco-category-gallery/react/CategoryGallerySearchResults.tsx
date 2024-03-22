import React from 'react'
// import { pathOr } from 'ramda'
import {
  useSearchPage,
  useSearchPageState,
} from 'vtex.search-page-context/SearchPageContext'
import { useQuery } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import { withRuntimeContext } from 'vtex.render-runtime'
import CategoryGallery from './components/gallery/CategoryGallery'
import { useResponsiveValue } from 'vtex.responsive-values'
import CATEGORY_TREE_QUERY from './queries/categoriesTree.graphql'

import { getFilteredChildren, getTranslatedFilteredChildren } from './utils/categoryTreeUtils'
import { pathOr } from 'ramda'

interface Props {
  itemsPerPage: {
    desktop: number
    tablet: number
    phone: number
  }
  runtime: {
    page: string
    route: {
      canonicalPath: string
    }
  }
}

const CSS_HANDLES = ['searchResultCategoryGalleryContainer']

const CategoryGallerySearchResults = (props: Props) => {
  const cssHandles = useCssHandles(CSS_HANDLES)

  const { searchQuery } = useSearchPage()
  const { showContentLoader } = useSearchPageState()

  const facets = pathOr({} as any, ['data', 'facets'], searchQuery)
  const { specificationFilters } = facets

  const {
    runtime: { page, route },
    itemsPerPage = {
      desktop: 5,
      tablet: 3,
      phone: 1,
    },
  } = props

  const { data: catTreeData, loading: catTreeLoading } = useQuery(
    CATEGORY_TREE_QUERY,
    {
      variables: {
        treeLevel: 3,
      },
    }
  )

  const categoryTree = catTreeData ? catTreeData.categoriesTree : []

  const cardsPerPage = useResponsiveValue(itemsPerPage)
  const pathParams = route.canonicalPath
    ? route.canonicalPath.split('/').filter((path: string) => path !== '')
    : []

  const isCustomBinding = () => {
    const customBinding = ['ko-KR', 'fr-CA', 'es-MX']
    const url = window?.location?.href ?? ''
    return url
      .split('/')
      .map((part: string) => customBinding.includes(part))
      .includes(true)
  }

  let filteredTree: Category[] = []

  if (page === 'store.search#department') {
    const ftSearchCategories = pathOr(
      [],
      ['facets'],
      (specificationFilters || []).find((s: any) => s.name === 'Category' || s.name === 'Categoría 2' || s.name === '카테고리 2' || s.name === 'Catégorie 2')
    )
    // filteredTree = ftSearchCategories
    filteredTree = !isCustomBinding()
      ? getFilteredChildren(categoryTree, pathParams)
      : getTranslatedFilteredChildren(
          categoryTree,
          ftSearchCategories,
          pathParams
        )
  } else if (page === 'store.search#category') {
    const subCategories = pathOr(
      [],
      ['facets'],
      (specificationFilters || []).find((s: any) => s.name === 'Subcategory' || s.name === 'Categoría 3' || s.name === '카테고리 3' || s.name === 'Catégorie 3')
    )
    // filteredTree = subCategories
    filteredTree = !isCustomBinding()
      ? getFilteredChildren(categoryTree, pathParams)
      : getTranslatedFilteredChildren(
          categoryTree,
          subCategories,
          pathParams
        )
  }

  return catTreeLoading || showContentLoader ? (
    <div />
  ) : (
    <div className={`${cssHandles.searchResultCategoryGalleryContainer} pl9-l`}>
      <CategoryGallery categories={filteredTree} cardsPerPage={cardsPerPage} />
    </div>
  )
}

CategoryGallerySearchResults.schema = {
  title: 'admin/category-gallery.title',
  description: 'admin/category-gallery.description',
  type: 'object',
  properties: {
    itemsPerPage: {
      type: 'object',
      isLayout: true,
      title: 'admin/category-gallery.cards-per-page.title',
      properties: {
        desktop: {
          default: 4,
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

export default withRuntimeContext(CategoryGallerySearchResults)
