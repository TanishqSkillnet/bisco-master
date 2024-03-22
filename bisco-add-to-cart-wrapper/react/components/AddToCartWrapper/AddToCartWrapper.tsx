import React, { useContext } from 'react'
import { ProductContext } from 'vtex.product-context'
import { ExtensionPoint } from 'vtex.render-runtime'
import { Spinner, Button } from 'vtex.styleguide'
import { useQuery } from 'react-apollo'
import { defineMessages, useIntl } from 'react-intl'

import GET_PRICE_BREAKS from '../../queries/priceBreaksQuery.graphql'

const message = defineMessages({
  addToCart: {
    defaultMessage: '',
    id: 'store/sku-list-comparison.add-to-cart-button',
  },
})

const AddToCartWrapper = () => {
  const intl = useIntl()
  const { loadingItem: loading, product } = useContext(ProductContext)
  const postalCode = localStorage.getItem('userPostalCode')
  const item = product.items[0]

  const { data, loading: queryLoading } = useQuery(GET_PRICE_BREAKS, {
    variables: {
      itemId: item?.itemId,
      sellerId: item?.sellers[0]?.sellerId ?? '',
      tradePolicyId: '1',
      postalCode,
    },
  })

  const priceBreakLength = data?.priceBreaks.length

  if (loading || queryLoading) {
    return (
      <div>
        <Spinner />
      </div>
    )
  }

  if (priceBreakLength === 0) {
    return (
      <Button disabled>
        <span>{intl.formatMessage(message.addToCart)}</span>
      </Button>
    )
  }

  return <ExtensionPoint id="add-to-cart-button" />
}

export default AddToCartWrapper
