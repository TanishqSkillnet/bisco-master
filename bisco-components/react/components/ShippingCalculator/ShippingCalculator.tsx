import { pathOr } from 'ramda'
import React, { useMemo } from 'react'
import { useQuery } from 'react-apollo'
import { Spinner } from 'vtex.styleguide'
import PostalCodeSelector from '../Shared/PostalCodeSelector/PostalCodeSelector'
import GET_LEAD_TIME from './queries/leadTime.graphql'
import styles from './shippingCalculator.css'
import { businessDayCalculation } from './utils/dayCalculator'
import { useIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
  getShippingEstimate: {
    defaultMessage: 'Get Shipping Estimate',
    id: 'store/bisco-components.get-shipping-estimate',
  },
  calculatingShippingEstimate: {
    defaultMessage: 'Calculating Shipping Estimate',
    id: 'store/bisco-components.calculating-shipping-estimate',
  },
  expectedToArriveOnOrBefore: {
    defaultMessage: 'Expected to arrive on or before',
    id: 'store/bisco-components.expected-to-arrive-on-or-before',
  },
  shippingInfoIsUnavailableRequestAQuote: {
    defaultMessage: 'Shipping info is unavailable, Request a quote',
    id: 'store/bisco-components.shipping-info-is-unavailable-request-a-quote',
  }
})

interface Props {
  itemId: string
  quantity: number
  postalCode: string
  sellerId: string
  updatePostalCode?: (e: any) => void
}

const ShippingCalculator = ({
  itemId,
  quantity,
  postalCode,
  sellerId,
  updatePostalCode,
}: Props) => {
  const intl = useIntl()
  const { data, loading, error } = useQuery(GET_LEAD_TIME, {
    skip: !itemId,
    variables: { itemId, quantity, postalCode, sellerId },
  })
  const leadTime = pathOr('', ['leadTime', 'leadTime'], data)
  const splitArray = leadTime ? leadTime.split('b') : []
  const numberOfDays: number | undefined = splitArray.length > 0 ? Number(splitArray[0]) : undefined
  const actualLeadTime = useMemo(() => businessDayCalculation(numberOfDays), [numberOfDays])

  return (
    <div className={`${styles.productShippingCalculatorContainer} ${error? styles.shippingError: styles.shippingSuccess}`}>
      {!postalCode || postalCode === '' ? (
        <div>
          <span>{intl.formatMessage(messages.getShippingEstimate)}</span>
        </div>
      ) : loading ? (
        <div className="flex items-center">
          <span>{intl.formatMessage(messages.calculatingShippingEstimate)}</span>
          <span className="ml3"><Spinner size={16} /></span>
        </div>
      ): error ? (
        <div>
          <span>{pathOr('Error Loading lead time', ['graphQLErrors', 0, 'message'], error)}</span>
        </div>
      ) : actualLeadTime ? (
        <div>
          <span>{intl.formatMessage(messages.expectedToArriveOnOrBefore)}</span>
          <span className="b">{actualLeadTime?.toDateString()}</span>
        </div>
      ) : (
        <div>
          <span>{intl.formatMessage(messages.shippingInfoIsUnavailableRequestAQuote)}</span>
        </div>
      )}
      <PostalCodeSelector postalCode={postalCode} updatePostalCode={updatePostalCode} />
    </div>
  )
}

export default React.memo(ShippingCalculator)
