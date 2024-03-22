import { pathOr } from 'ramda'
import React, { useContext } from 'react'
import { ProductContext } from 'vtex.product-context'
import AvailableInventory from './AvailableInventory'

const ProductAvailableInventory = () => {
  const valuesFromContext = useContext(ProductContext)
  const sellers: Seller[] = pathOr([], ['selectedItem', 'sellers'], valuesFromContext)

  return <AvailableInventory sellers={sellers}/>
}

export default ProductAvailableInventory
