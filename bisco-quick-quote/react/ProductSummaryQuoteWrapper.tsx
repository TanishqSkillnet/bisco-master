import { path } from 'ramda'
import React from 'react'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import { canUseDOM } from 'vtex.render-runtime'
import QuickQuote from './QuickQuote'
import style from './quickQuote.css'

const ProductSummaryQuoteWrapper = () => {
  const valuesFromContext = useProductSummary()
  const selectedProduct = path(['product'], valuesFromContext)
  const selectedItem = path(['selectedItem'], valuesFromContext)

  const preventPropagation = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return canUseDOM && selectedProduct? (
    <div className={style.productSummaryQuoteWrapper} onClick={preventPropagation}>
      <QuickQuote product={selectedProduct} selectedItem={selectedItem} />
    </div>
  ) : (
    <div />
  )
}

export default ProductSummaryQuoteWrapper
