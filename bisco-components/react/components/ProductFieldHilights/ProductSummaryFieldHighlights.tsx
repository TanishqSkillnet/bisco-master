import React from 'react'
import FieldHighlights from './FieldHighlights'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import styles from './productFieldHilights.css'

const ProductSummaryFieldHighlights = (props: any) => {
  const { product } = useProductSummary()
  const newProps = { ...props, selectedProduct: product }

  const onclickPropagation = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div className={styles.ProductSummaryFieldHighlightsWrapper} onClick={onclickPropagation}>
      <FieldHighlights {...newProps} />
    </div>
  )
}

export default ProductSummaryFieldHighlights
