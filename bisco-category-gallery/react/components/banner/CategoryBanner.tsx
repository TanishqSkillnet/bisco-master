import React, { useEffect, useState } from 'react'
import { pathOr, propEq, find, isEmpty } from 'ramda'
import {
  useSearchPage,
  useSearchPageState,
} from 'vtex.search-page-context/SearchPageContext'
import { useCssHandles } from 'vtex.css-handles'
import { withRuntimeContext } from 'vtex.render-runtime'
import CategorySelector from './CategorySelector'
import { useIntl, defineMessages } from 'react-intl'
import { ExtensionPoint } from 'vtex.render-runtime'

const messages = defineMessages({
  productNotFound: {
    id: 'store/category-gallery.product-not-found',
    defaultMessage: '',
  },
})

interface Props {
  defaultImage: string
  runtime: {
    page: string
    route: {
      canonicalPath: string
    }
  }
}

const CSS_HANDLES = ['categoryBanner', 'productsNotFoundMessage']

const CategoryBanner = (props: Props) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  const intl = useIntl()
  const [showNotFoundMessage, setShowNotFoundMessage] = useState(false)

  const { searchQuery } = useSearchPage()
  const { showContentLoader } = useSearchPageState()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const facets = pathOr({} as any, ['data', 'facets'], searchQuery)
  const { specificationFilters } = facets

  const products = pathOr([] as any, ['data', 'products'], searchQuery)

  useEffect(() => {
    if (
      !showContentLoader &&
      isEmpty(products) &&
      isEmpty(specificationFilters)
    ) {
      setShowNotFoundMessage(true)
    }
  }, [products, showContentLoader, specificationFilters])

  const {
    defaultImage,
    runtime: { page },
  } = props

  let selectedCategory = undefined
  let currentTreeLevel = 2

  if (page === 'store.search#department') {
    const departmentFacets = (specificationFilters || []).filter(
      (s: any) => s.name === 'Department'
    )
    selectedCategory = find(
      propEq('selected', true),
      pathOr([], [0, 'facets'], departmentFacets)
    )
    currentTreeLevel = 1
  } else if (page === 'store.search#category') {
    const categoriesFacets = (specificationFilters || []).filter(
      (s: any) => s.name === 'Category'
    )
    selectedCategory = find(
      propEq('selected', true),
      pathOr([], [0, 'facets'], categoriesFacets)
    )
    currentTreeLevel = 2
  } else if (page === 'store.search#subcategory') {
    const categoriesFacets = (specificationFilters || []).filter(
      (s: any) => s.name === 'Subcategory'
    )
    selectedCategory = find(
      propEq('selected', true),
      pathOr([], [0, 'facets'], categoriesFacets)
    )
    currentTreeLevel = 3
  }

  return showContentLoader ? (
    <div />
  ) : showNotFoundMessage ? (
    <div className={cssHandles.productsNotFoundMessage}>
      {intl.formatMessage(messages.productNotFound)}
    </div>
  ) : (
    <div className={`${cssHandles.categoryBanner} pl9-l`}>
      <div className="relative ma3">
        <div className="absolute right-0">
          <ExtensionPoint id="rfi-category" />
        </div>
      </div>
      <CategorySelector
        currentCategory={selectedCategory}
        treeLevel={currentTreeLevel}
        defaultImage={defaultImage}
      />
    </div>
  )
}

CategoryBanner.schema = {
  title: 'admin/category-gallery.category-selector.title',
  description: 'admin/category-gallery.category-selector.description',
  type: 'object',
  properties: {
    defaultImage: {
      default: '',
      type: 'string',
      title: 'admin/category-gallery.category-selector.defaultImage.title',
      widget: {
        'ui:widget': 'image-uploader',
      },
    },
  },
}

export default withRuntimeContext(CategoryBanner)
