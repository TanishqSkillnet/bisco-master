import React, { useEffect } from 'react'
import { useItemContext } from 'vtex.product-list/ItemContext'
import { useQuery } from 'react-apollo'
import PRODUCT_QUERY from '../../queries/minicartProduct.graphql'
import GET_PRICE_BREAKS from '../PriceBreaks/queries/priceBreaksQuery.graphql'

const MinicartQuantitySelector = () => {
  const { item, onQuantityChange } = useItemContext()
  const { data, error: productError } = useQuery(PRODUCT_QUERY, {
    variables: {
      identifier: { field: 'id', value: item.productId },
    },
  })
  console.log(productError)
  const postalCode = localStorage.getItem('userPostalCode')
  const priceBreakData = useQuery(GET_PRICE_BREAKS, {
    variables: { itemId: item.id, sellerId: item.seller, tradePolicyId: '1', postalCode: postalCode },
  })

  const res = priceBreakData.data?.priceBreaks.map((qnt:{minQuantity:number}) => qnt.minQuantity)

  let minQty = Math.min.apply(Math,res)
  let unit = item?.unitMultiplier ?? 1

  useEffect(() => {
    if (!item.quantity || !onQuantityChange || priceBreakData.loading) {
      return
    }

    const actualQty =(item.quantity === Infinity ? minQty : item.quantity) * unit
    const correctedMinQty = minQty * unit

    const adjustedQty =
      actualQty < correctedMinQty
        ? minQty === Infinity ? unit : correctedMinQty
        : actualQty

    onQuantityChange(adjustedQty / unit)
  }, [item.quantity, minQty, onQuantityChange, unit, data, priceBreakData])

  return <></>
}

export default MinicartQuantitySelector
