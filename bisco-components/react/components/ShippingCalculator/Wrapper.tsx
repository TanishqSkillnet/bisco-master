import {
  useZipCode,
  useZipCodeDispatch
} from 'biscoind.zip-code-context/ZipCodeContext'
import { path, pathOr } from 'ramda'
import React, { useCallback, useContext } from 'react'
import { ProductContext } from 'vtex.product-context'
import { useProductDispatch } from 'vtex.product-context/ProductDispatchContext'
import ShippingCalculator from './ShippingCalculator'

const hasLocalStorage = typeof localStorage !== 'undefined'
interface Seller {
  sellerDefault: boolean;
  sellerId: string
}

const ProductShippingCalculator = () => {
  const valuesFromContext = useContext(ProductContext)
  const itemId: string = pathOr('', ['selectedItem', 'itemId'], valuesFromContext)
  const quantityFromContext: number = pathOr(0, ['selectedQuantity'], valuesFromContext)
  const sellers = path(['selectedItem', 'sellers'], valuesFromContext) as Seller []

  const valuesFromZipCodeContext = useZipCode()
  const zipCodeDispatch = useZipCodeDispatch()

  const zipCode = pathOr('', ['zipCode'], valuesFromZipCodeContext) as string
  const dispatch = useProductDispatch()

  let sellerId = ''

  const defaultSeller = sellers?.find((seller:Seller) => seller.sellerDefault)
  if (defaultSeller) {
    sellerId = defaultSeller.sellerId
  } else {
    sellerId = sellers.length >= 0 ? sellers[0]?.sellerId : ''
  }

  const updatePostalCode = useCallback(
    (zip: string) => {
      dispatch({ type: 'SET_POSTAL_CODE', args: { postalCode: zip } })
      if (hasLocalStorage) {
        localStorage.setItem('userPostalCode', zip)
      }
      zipCodeDispatch({
        args: { zipCodeValue: zip },
        type: 'SET_ZIP_CODE',
      })
    },
    [dispatch]
  )

  const shippingCalculatorProps = {
    itemId,
    postalCode: zipCode,
    quantity: quantityFromContext ? quantityFromContext : 1,
    sellerId: sellerId? sellerId: "undefined",
    updatePostalCode,
  }

  return <ShippingCalculator {...shippingCalculatorProps} />
}

export default ProductShippingCalculator
