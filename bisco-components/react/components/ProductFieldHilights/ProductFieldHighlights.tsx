import React, { useContext } from 'react'
import { path } from 'ramda'
import { ProductContext } from 'vtex.product-context'
import FieldHighlights from './FieldHighlights'

const ProductFieldHighlights = (props: any) => {
  const valuesFromContext = useContext(ProductContext)
  const selectedProduct = path(['selectedItem'], valuesFromContext)
  const newProps = {...props, selectedProduct : selectedProduct}

  return <FieldHighlights { ...newProps } />
}

export default ProductFieldHighlights
