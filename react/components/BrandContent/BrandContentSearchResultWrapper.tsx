import React from 'react'
import { withRuntimeContext } from 'vtex.render-runtime'
import { useSearchPage, useSearchPageState } from 'vtex.search-page-context/SearchPageContext'
import { Spinner } from 'vtex.styleguide'
import BrandContent from './BrandContent'

interface Props {
  runtime: {
    page: string
  }
}

const BrandContentSearchResultWrapper = (props: Props) => {
  const { params } = useSearchPage() // searchQuery
  const { showContentLoader } = useSearchPageState()

  const {
    runtime: {
      page,
    },
  } = props

  if(page !== 'store.search#brand'){
      return <div />
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

  return <BrandContent brandSlug={ params.brand } />
}

export default withRuntimeContext(BrandContentSearchResultWrapper)
