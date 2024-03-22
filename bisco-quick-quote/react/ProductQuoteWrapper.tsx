import { path } from 'ramda'
import React, { useContext } from 'react'
import { ProductContext } from 'vtex.product-context'
import { canUseDOM } from 'vtex.render-runtime'
import QuickQuote from './QuickQuote'
import style from './quickQuote.css'

const ProductQuoteWrapper = () => {
  const valuesFromContext = useContext(ProductContext)
  const selectedProduct = path(['product'], valuesFromContext)
  const selectedItem = path(['selectedItem'], valuesFromContext)

  return canUseDOM && selectedProduct?  (
    <div className={style.productQuoteWrapper}>
      <QuickQuote product={selectedProduct} selectedItem={selectedItem} />
    </div>
  ) : (
    <div />
  )
}

export default ProductQuoteWrapper
