import { useZipCode, useZipCodeDispatch } from 'biscoind.zip-code-context/ZipCodeContext'
import { pathOr } from 'ramda'
import React, { useCallback, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import { canUseDOM, useRuntime } from 'vtex.render-runtime'
import { Button } from 'vtex.styleguide'
import GET_PRICE_BREAKS from '../queries/priceBreaksQuery.graphql'
import Loader from './Loader'
import ProductSummaryPriceBreaks from './ProductSummaryPriceBreaks'
import styles from './searchPriceBreaks.css'
import { useIntl, defineMessages } from 'react-intl'


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

const hasLocalStorage = typeof localStorage !== 'undefined'

interface Props {
  showLeadTimes: boolean
}

const ProductSummaryPriceWrapper = ({ showLeadTimes }: Props) => {
  const { deviceInfo: { isMobile }}: { deviceInfo: { isMobile: boolean}} = useRuntime()
  const intl = useIntl()
  const valuesFromContext = useProductSummary()
  const itemId = pathOr('', ['selectedItem', 'itemId'], valuesFromContext)
  const unitMultiplier = pathOr('', ['selectedItem', 'unitMultiplier'], valuesFromContext)
  const [skipOnMobile, setSkipOnMobile] = useState(true)

  const sellerId = valuesFromContext?.selectedItem?.sellers?.
                    find((seller: { sellerId: string }) => seller.sellerId === "biscoanitaerp")?.
                          sellerId ?? pathOr('', ['selectedItem', 'sellers', 0, 'sellerId'], valuesFromContext)
  const valuesFromZipCodeContext = useZipCode()
  const zipCodeDispatch = useZipCodeDispatch()

  const zipCode = pathOr('', ['zipCode'], valuesFromZipCodeContext) as string

  const { loading, error, data } = useQuery(GET_PRICE_BREAKS, {
    variables: { itemId, sellerId, tradePolicyId: '1', postalCode: zipCode },
  })

  const skipCondition = skipOnMobile && (isMobile ?? false)

  const onLoadPriceButtonClicked = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setSkipOnMobile(false)
  }

  const preventPropagation = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
  }

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

  return canUseDOM ? (
    skipCondition ? (
      <div className={`${styles.priceBreaksButtonContainer} w-100`}>
        <Button onClick={onLoadPriceButtonClicked}>{intl.formatMessage(messages.showPrices)}</Button>
      </div>
    ):
    loading ? (
      <Loader />
    ) : error ? (
      <div className="w-100 tl"> {intl.formatMessage(messages.requestAQuoteForPriceNAvailability)}</div>
    ) : (
      <div className={`tj ${styles.searchPriceBreaksWrapper}`} onClick={preventPropagation}>
        <ProductSummaryPriceBreaks
          {...data}
          showLeadTimes={showLeadTimes ? showLeadTimes : false}
          unitMultiplier={unitMultiplier}
          zipCode={zipCode}
          updatePostalCode={updatePostalCode}
        />
      </div>
    )
  ) : (
    <div onClick={preventPropagation} />
  )
}

export default ProductSummaryPriceWrapper
