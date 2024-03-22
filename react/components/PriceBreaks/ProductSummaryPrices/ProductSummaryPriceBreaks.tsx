import React, { useState } from 'react'
import { MAX_VISIBLE_ITEMS_IN_TABLE } from '../utils/constants'
import { PriceBreak } from '../utils/interfaces'
import { formatNumber } from '../utils/numberFormatter'
import styles from './searchPriceBreaks.css'
import { FormattedCurrency } from 'vtex.format-currency'

import PostalCodeSelector from '../../Shared/PostalCodeSelector/PostalCodeSelector'
import { correctedQuantity, correctedPrice, extendedPrice } from '../utils/priceTableUtils'
import { useIntl, defineMessages } from 'react-intl'


const messages = defineMessages({
    requestAQuoteForPriceNAvailability: {
      defaultMessage: 'Request a quote for price and availability',
      id: 'store/bisco-components.request-a-quote-for-price-and-availability',
    },
    pricingAndAvailability: {
      defaultMessage: 'Pricing & Availability',
      id: 'store/bisco-components.pricingNAvailability',
    },
    quantity: {
      defaultMessage: 'Quantity',
      id: 'store/bisco-components.quantity',
    },
    unitprice: {
      defaultMessage: 'Unit Price',
      id: 'store/bisco-components.unit-price',
    },
    extPrice: {
      defaultMessage: 'Ext. Price',
      id: 'store/bisco-components.ext-price',
    },
    daysToDeliver: {
      defaultMessage: 'Days to delivery',
      id: 'store/bisco-components.days-to-delivery',
    },
    minimum: {
      defaultMessage: 'Minimum: ',
      id: 'store/bisco-components.minimum',
    },
    more: {
      defaultMessage: 'More',
      id: 'store/bisco-components.more',
    },
    less: {
      defaultMessage: 'Less',
      id: 'store/bisco-components.less',
    }
  },
)
interface Props {
  priceBreaks?: PriceBreak[]
  availableQuantity?: number
  showLeadTimes: boolean
  maxRowsVisible?: number
  unitMultiplier?: number
  zipCode: string
  updatePostalCode: (zip: string) => void
}


const ProductSummaryPriceBreaks = ({
  priceBreaks,
  showLeadTimes,
  maxRowsVisible,
  unitMultiplier = 1,
  zipCode,
  updatePostalCode,
}: Props) => {
  const [showMore, setShowMore] = useState(true)
  const intl = useIntl()

  const toggleMore = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setShowMore(oldState => !oldState)
  }

  if (!priceBreaks || priceBreaks.length === 0) {
    return <div className="w-100 tl"> {intl.formatMessage(messages.requestAQuoteForPriceNAvailability)}</div>
  }
  const priceBreaksFiltered = priceBreaks.filter(p => p.price !== undefined && p.price !== 0)
  const maximumRowsVisible = maxRowsVisible ? maxRowsVisible : MAX_VISIBLE_ITEMS_IN_TABLE
  const collapsible = priceBreaksFiltered.length > maximumRowsVisible
  const sortedPriceBreaks =
    collapsible && showMore ? priceBreaksFiltered.slice(0, maximumRowsVisible) : priceBreaksFiltered

  return (
    <div className={styles.priceBreaksContainer}>
      <table className={`${styles.priceTable} collapse pv2 w-100`}>
        <thead>
          <tr>
            <th
              className={`${styles.pricingTableFullHeader} pa2 ba br2 b--black-10 tl`}
              colSpan={4}>
              {intl.formatMessage(messages.pricingAndAvailability)}
            </th>
          </tr>
        </thead>
        <thead className={`${styles.priceTableHead} striped--light-gray`}>
          <tr>
            <th className={`${styles.priceTableDataRow} pv2 ph3 tl normal`}>{intl.formatMessage(messages.quantity)}</th>
            <th className={`${styles.priceTableDataRow} pv2 ph3 tl normal`}>{intl.formatMessage(messages.unitprice)}</th>
            <th className={`${styles.priceTableDataRow} pv2 ph3 tl normal`}>{intl.formatMessage(messages.extPrice)}</th>
            {showLeadTimes && (
              <th className={`${styles.priceTableDataRow} pv2 ph3 tl normal`}>{intl.formatMessage(messages.daysToDeliver)}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedPriceBreaks.map((priceBreak: PriceBreak, index: number) => {
            const price =
              priceBreak.price && priceBreak.price > 0
                ? correctedPrice(priceBreak.price, unitMultiplier)
                : undefined

            const extPrice =
              priceBreak.price && priceBreak.price > 0
                ? extendedPrice(priceBreak.price, priceBreak.minQuantity)
                : undefined

            return (
              <tr className={`${styles.priceTableQuantity} striped--light-gray`}>
                <td className={`${styles.priceTableDataRow} pv2 ph3 tl`}>
                  <p className={styles.priceTableLineText}>
                    {priceBreak.minQuantity
                      ? `${formatNumber(correctedQuantity(priceBreak.minQuantity, unitMultiplier))}
                      ${priceBreak.maxQuantity ? '' : ' +'}`
                      : ''}
                  </p>
                </td>
                <td className={`${styles.priceTablePrice} pv2 ph3 tl`}>
                  {price ? <FormattedCurrency value={price} /> : ' '}
                </td>
                <td className={`${styles.priceTablePrice} pv2 ph3 tl`}>
                  {extPrice ? <FormattedCurrency value={extPrice} /> : ' '}
                </td>
                {showLeadTimes &&
                  (zipCode === '' && index === 0 ? (
                    <td className={`${styles.priceTableDataRow} pv2 ph3 tl`}>
                      <PostalCodeSelector
                        postalCode={zipCode}
                        updatePostalCode={updatePostalCode}
                      />
                    </td>
                  ) : (
                    <td className={`${styles.priceTableDataRow} pv2 ph3 tl`}>
                      {priceBreak.leadTime ? priceBreak.leadTime.replace(/(\d+)bd/, '$1 days') : ''}
                    </td>
                  ))}
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          {collapsible && (
            <tr>
              <td colSpan={4}>
                {showMore ? (
                  <a onClick={e => toggleMore(e)} className={styles.tableMoreButton}>
                    {intl.formatMessage(messages.more)} &#9660;
                  </a>
                ) : (
                  <a onClick={e => toggleMore(e)} className={styles.tableLessButton}>
                    {intl.formatMessage(messages.less)} &#9650;
                  </a>
                )}
              </td>
            </tr>
          )}
        </tfoot>
      </table>
    </div>
  )
}

export default ProductSummaryPriceBreaks
