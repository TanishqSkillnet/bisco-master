import React from 'react'
import { pathOr, clone } from 'ramda'
import { useSearchPage, useSearchPageState } from 'vtex.search-page-context/SearchPageContext'
import { Spinner } from 'vtex.styleguide'
import { withRuntimeContext } from 'vtex.render-runtime'
import { categoryTreeSearch, ftSearchCategoryTree } from './utils/treeSearch'
import { removeChildrenAfter } from './utils/treeLevelRemover'
import CategoryPanel from './CategoryPanel'

interface Props {
  runtime: {
    page: string
    route: {
      canonicalPath: string
    }
  }
}

const CategoryPanelSearchResultsWrapper = (props: Props) => {
  const { searchQuery } = useSearchPage()
  const { showContentLoader } = useSearchPageState()

  const facets = pathOr({}, ['data', 'facets'], searchQuery)
  const { categoriesTrees, specificationFilters } = facets

  const {
    runtime: {
      page,
      route: { canonicalPath },
    },
  } = props

  let filteredTree = []
  if (page === 'store.search#department') {
    const filtered = categoryTreeSearch(clone(categoriesTrees), canonicalPath, /\/d$/)
    const filteredArray = filtered? [filtered]: []
    const filteredChildren = removeChildrenAfter(clone(filteredArray),2)
    filteredTree = filteredChildren ? filteredChildren : []
  } else if (page === 'store.search#category') {
    const filtered = categoryTreeSearch(clone(categoriesTrees), canonicalPath)
    filteredTree = filtered ? [filtered] : []
  } else if (page === 'store.search#subcategory') {
    // const filtered = categoryTreeSearch(clone(categoriesTrees), canonicalPath)
    // categoryTitle = filtered ? filtered.name : ''
  } else if (page === 'store.search#brand') {
    filteredTree =  []
  } else {
    const ftSearchCategories = (specificationFilters || []).filter((s: any) => s.name === 'Category 3')
    const filtered = ftSearchCategoryTree(clone(ftSearchCategories))

    filteredTree = filtered ? filtered : []
  }

  if (showContentLoader) {
    return (
      <div className="w-100 flex justify-center">
        <div className="w3 ma0">
          <Spinner />
        </div>
      </div>
    )
  }

  return <CategoryPanel tree={filteredTree} />
}

export default withRuntimeContext(CategoryPanelSearchResultsWrapper)
