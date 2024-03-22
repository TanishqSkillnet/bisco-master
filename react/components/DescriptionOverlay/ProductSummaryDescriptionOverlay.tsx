import React from 'react'
import DescriptionOverlay from './DescriptionOverlay'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import style from './descriptionOverlay.css'

const ProductSummaryDescriptionOverlay = () => {
  const { product } = useProductSummary()

  const preventPropagation = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div className={style.ProductSummaryDescriptionOverlayWrapper} onClick={preventPropagation}>
      <DescriptionOverlay description={product.description} />
    </div>
  )
}

export default ProductSummaryDescriptionOverlay
