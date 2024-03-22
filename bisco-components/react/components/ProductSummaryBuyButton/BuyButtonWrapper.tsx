import { pathOr } from 'ramda'
import React from 'react'
import { ProductSummaryBuyButton } from 'vtex.product-summary'

import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import { useIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
  addToCart: {
    defaultMessage: 'Add to cart',
    id: 'store/bisco-components.add-to-cart',
  }
})

const BuyButtonWrapper = () => {

  const intl = useIntl()
  const { selectedItem } = useProductSummary()
  const availableQuantity: number = pathOr(0, ['seller', 'commertialOffer', 'AvailableQuantity'], selectedItem)

  const params = {
    buyButtonText: `${intl.formatMessage(messages.addToCart)}`,
    displayBuyButton: availableQuantity && availableQuantity > 0 ? 'displayButtonAlways': 'displayButtonNone',
  }

  const preventPropagation = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div onClick={preventPropagation}>
      <ProductSummaryBuyButton {...params} />
    </div>
  )
}

export default BuyButtonWrapper
