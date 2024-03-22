import { pathOr, find, propEq } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import AvailableInventory from './AvailableInventory'
import styles from './inventory.css'
import AvailableQuantity from './queries/availableQuantity.graphql'

const ProductSummaryAvailableInventory = () => {
  const [sellers, setSellers] = useState([])

  const valuesFromContext = useProductSummary()
  const productId = pathOr([], ['product', 'productId'], valuesFromContext)
  const itemId = pathOr([], ['selectedItem', 'itemId'], valuesFromContext)

  const { loading, data } = useQuery(AvailableQuantity, {
    variables: { identifier: { field: 'id', value: productId } },
  })

  useEffect(() => {
    const items = pathOr([], ['product', 'items'], data)
    const selectedItem = find(propEq('itemId', itemId))(items)
    setSellers(pathOr([], ['sellers'], selectedItem)) 
  }, [data])

  const preventPropagation = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return loading ? (
    <div></div>
  ) : (
    <div className={styles.ProductSummaryAvailableInventoryWrapper} onClick={preventPropagation}>
      <AvailableInventory sellers={sellers} />
    </div>
  )
}

export default ProductSummaryAvailableInventory
