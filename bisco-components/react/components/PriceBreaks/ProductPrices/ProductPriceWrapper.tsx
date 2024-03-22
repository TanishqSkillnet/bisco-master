import { useZipCode, useZipCodeDispatch } from 'biscoind.zip-code-context/ZipCodeContext'
import { pathOr } from 'ramda'
import React, { useContext, useCallback } from 'react'
import { useQuery } from 'react-apollo'
import { ProductContext } from 'vtex.product-context'
import { canUseDOM } from 'vtex.render-runtime'
import { useDevice } from 'vtex.device-detector'
import GET_PRICE_BREAKS from '../queries/priceBreaksQuery.graphql'
import Loader from './loaders/Loader'
import ProductPriceBreaks from './ProductPriceBreaks'
import { useIntl, defineMessages } from 'react-intl'
import PriceTableLoader from './loaders/PriceTableLoader'

const hasLocalStorage = typeof localStorage !== 'undefined'

const messages = defineMessages({
    requestAQuoteForPriceNAvailability: {
      defaultMessage: 'Request a quote for price and availability',
      id: 'store/bisco-components.request-a-quote-for-price-and-availability',
    },
    showPrices: {
      defaultMessage: 'Show Prices',
      id: 'store/bisco-components.show-prices',
    }
  },
)

const ProductPriceBreaksWrapper = () => {
  const valuesFromContext = useContext(ProductContext) as any
  const intl = useIntl()
  const itemId = pathOr('', ['selectedItem', 'itemId'], valuesFromContext)
  const sellerId = valuesFromContext?.selectedItem?.sellers?.
              find((seller: { sellerId: string }) => seller.sellerId === "biscoanitaerp")?.
                    sellerId ?? pathOr('', ['selectedItem', 'sellers', 0, 'sellerId'], valuesFromContext)
  const measurementUnit = pathOr('', ['selectedItem', 'measurementUnit'], valuesFromContext)
  const unitMultiplier = pathOr('', ['selectedItem', 'unitMultiplier'], valuesFromContext)
  const { device } = useDevice()

  const valuesFromZipCodeContext = useZipCode()
  const zipCodeDispatch = useZipCodeDispatch()

  const zipCode = pathOr('', ['zipCode'], valuesFromZipCodeContext) as string

  const { loading, error, data } = useQuery(GET_PRICE_BREAKS, {
    variables: { itemId, sellerId, tradePolicyId: '1', postalCode: zipCode },
  })

  const updatePostalCode = useCallback(
    (zip: string) => {
      if (hasLocalStorage) {
        localStorage.setItem('userPostalCode', zip)
      }

      zipCodeDispatch({
        args: { zipCodeValue: zip },
        type: 'SET_ZIP_CODE',
      })
    },
    [zipCodeDispatch]
  )

  const priceBreaks = { ...data, ...{ fixedRowsCount: 10, measurementUnit, unitMultiplier } }

  return canUseDOM ? (
    loading ? (
      <Loader />
    ) : error ? (
      <div className="w-100 tl">{intl.formatMessage(messages.requestAQuoteForPriceNAvailability)}</div>
    ) : (
      <ProductPriceBreaks {...priceBreaks} zipCode={zipCode} updatePostalCode={updatePostalCode} />

    )
  ) : (<div>
        {device === 'desktop' ? (
          <div style={{height:"650px"}} />
        ) : (
          <PriceTableLoader/>
        )}
       </div>
  )
}

export default ProductPriceBreaksWrapper
