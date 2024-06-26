import {
  useZipCode,
  useZipCodeDispatch
} from 'biscoind.zip-code-context/ZipCodeContext'
import { path, pathOr } from 'ramda'
import React from 'react'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import ShippingCalculator from './ShippingCalculator'
import styles from './shippingCalculator.css'

interface Seller {
  sellerDefault: boolean;
  sellerId: string
}

const ProductSummaryShippingCalculator = () => {
  const valuesFromContext = useProductSummary()
  const itemId = path(['selectedItem', 'itemId'], valuesFromContext) as string
  const quantityFromContext = path(['selectedQuantity'], valuesFromContext) as number
  const sellers = path(['selectedItem', 'sellers'], valuesFromContext) as Seller []

  let sellerId = ''

  const defaultSeller = sellers?.find((seller:Seller) => seller.sellerDefault)
  if (defaultSeller) {
    sellerId = defaultSeller.sellerId
  } else {
    sellerId = sellers.length >= 0 ? sellers[0]?.sellerId : ''
  }

  const valuesFromZipCodeContext = useZipCode()
  const dispatch = useZipCodeDispatch()

  const zipCode = pathOr('', ['zipCode'], valuesFromZipCodeContext) as string

  const updatePostalCode = (zip: string) => {
    localStorage.setItem('userPostalCode', zip)
    dispatch({
      args: { zipCodeValue: zip },
      type: 'SET_ZIP_CODE',
    })
  }

  const preventPropagation = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const shippingCalculatorProps = {
    itemId,
    postalCode: zipCode,
    quantity: quantityFromContext ? quantityFromContext : 1,
    salesChannel: 1,
    sellerId: sellerId? sellerId: "undefined",
    updatePostalCode,
  }

  return (
    <div className={styles.ProductSummaryShippingCalculatorWrapper} onClick={preventPropagation}>
      <ShippingCalculator {...shippingCalculatorProps} />
    </div>
  )
}

export default ProductSummaryShippingCalculator
