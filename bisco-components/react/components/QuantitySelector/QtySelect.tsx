import React, { useContext, useEffect } from 'react'
import { useProduct, useProductDispatch } from 'vtex.product-context'
import GET_PRICE_BREAKS from '../PriceBreaks/queries/priceBreaksQuery.graphql'
import { useZipCode } from 'biscoind.zip-code-context/ZipCodeContext'
import { pathOr } from 'ramda'
import { ProductContext } from 'vtex.product-context'
import { useQuery } from 'react-apollo'

const QtySelect = () => {
  const productDispatch = useProductDispatch()

  const valuesFromContext = useContext(ProductContext)
  const itemId = pathOr('', ['selectedItem', 'itemId'], valuesFromContext)
  const sellerId = pathOr('', ['selectedItem', 'sellers', 0, 'sellerId'], valuesFromContext)

  const valuesFromZipCodeContext = useZipCode()
  const zipCode = pathOr('', ['zipCode'], valuesFromZipCodeContext) as string

  const { data } = useQuery(GET_PRICE_BREAKS, {
    variables: { itemId, sellerId, tradePolicyId: '1', postalCode: zipCode },
  })

  const res = data?.priceBreaks.map((qnt:{minQuantity:number}) => qnt.minQuantity)
  const minQty = Math.min.apply(Math,res)
  let unit = 1
  const { selectedItem, selectedQuantity } = useProduct() ?? {}

  if (selectedItem) {
    unit = selectedItem?.unitMultiplier
  }

  useEffect(() => {
    if (!selectedQuantity || !productDispatch) {
      return
    }

    const actualQty = selectedQuantity * unit
    const correctedMinQty = minQty * unit
    const adjustedQty =
      actualQty < correctedMinQty || selectedQuantity == Infinity
        ? minQty == Infinity ? unit : correctedMinQty
        : actualQty

        console.log(minQty * unit)

    productDispatch({
      type: 'SET_QUANTITY',
      args: { quantity: adjustedQty / unit },
    })
  }, [minQty, productDispatch, selectedQuantity, unit])

  return <></>
}

export default QtySelect
