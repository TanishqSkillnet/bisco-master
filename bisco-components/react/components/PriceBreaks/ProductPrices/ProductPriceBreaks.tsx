import React from 'react'
import ProductAvailableInventory from '../../Inventory/ProductAvailableInventory'
import PostalCodeSelector from '../../Shared/PostalCodeSelector/PostalCodeSelector'
import { MAX_ROWS_PRODUCT_PRICE_BREAKS_TABLE } from '../utils/constants'
import { PriceBreak } from '../utils/interfaces'
import { formatNumber } from '../utils/numberFormatter'
import { correctedPrice, correctedQuantity, extendedPrice } from '../utils/priceTableUtils'
import styles from './productPriceBreaks.css'

import { FormattedCurrency } from 'vtex.format-currency'
import { useIntl, defineMessages } from 'react-intl'


const messages = defineMessages({
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
  multiple: {
    defaultMessage: 'Multiple: ',
    id: 'store/bisco-components.multiple',
  },
  unitOfMeasure: {
    defaultMessage: 'Unit of measure: ',
    id: 'store/bisco-components.unit-of-measure',
  },
  priceBreakError: {
    defaultMessage: 'Request a quote for price and availability',
    id: 'store/bisco-components.price-break-error',
  },
})


interface Props {
  priceBreaks?: PriceBreak[]
  fixedRowsCount?: number
  unitMultiplier?: number
  measurementUnit?: number
  zipCode: string
  updatePostalCode: (zip: string) => void
}

const ProductPriceBreaks = ({
  priceBreaks,
  fixedRowsCount,
  unitMultiplier = 1,
  measurementUnit = 1,
  zipCode,
  updatePostalCode,
}: Props) => {

  const intl = useIntl()

  if (!priceBreaks) {
    return <div className="w-100 tl"> {intl.formatMessage(messages.priceBreakError)}</div>
  }

  if(priceBreaks.length === 0) {
    return <div className={styles.availableInventoryNoPrice}><ProductAvailableInventory /></div>
  }

  const priceBreaksFiltered = priceBreaks.filter(p => p.price !== undefined && p.price !== 0)
  const maxRows = fixedRowsCount ? fixedRowsCount : MAX_ROWS_PRODUCT_PRICE_BREAKS_TABLE
  const priceBreaksTableData = priceBreaksFiltered
    .filter(PB => PB.minQuantity > 0)
    .slice(0, maxRows)

  const minimum = priceBreaks.length > 0 ?  priceBreaks[0].minQuantity: 0

  const remainingRowsCount = maxRows - priceBreaksTableData.length

  return (
    <div className={styles.productPriceBreaksContainer}>
      <table className={`${styles.productPriceTable} collapse ba br2 b--black-10 pv2 ph3 w-100`}>
        <colgroup>
          <col className={styles.colGroupQuantityBreak} />
          <col className={styles.colGroupUnitPrice} />
          <col className={styles.colGroupLeadTime} />
        </colgroup>
        <thead className={styles.productPriceTableMainHeader}>
          <tr>
            <th className={`${styles.productPricingTableTitle} pa2 tl ttu`} colSpan={3}>
              {intl.formatMessage(messages.pricingAndAvailability)}
            </th>
          </tr>

          <tr>
            <th className={`${styles.availableInventoryRow} pv2 ph3 tl normal`} colSpan={3}>
              <ProductAvailableInventory />
            </th>
          </tr>
        </thead>

        <thead className={`${styles.productPriceTableHeader}`}>
          <tr className={`${styles.productPriceTableHeaderRow} pv2 ph3 tl normal`}>
            <th className={`${styles.productPriceTableHeaderRowData} pv2 ph3 tl normal`}>
              {intl.formatMessage(messages.quantity)}
            </th>
            <th className={`${styles.productPriceTableHeaderRowData} pv2 ph3 tl normal`}>
              {intl.formatMessage(messages.unitprice)}
            </th>
            <th className={`${styles.productPriceTableHeaderRowData} pv2 ph3 tl normal`}>
              {intl.formatMessage(messages.extPrice)}
            </th>
            <th className={`${styles.productPriceTableHeaderRowData} pv2 ph3 tl normal`}>
              {intl.formatMessage(messages.daysToDeliver)}
            </th>
          </tr>
        </thead>
        <tbody>
          {priceBreaksTableData.map((priceBreak: PriceBreak, index: number) => {
            const price = priceBreak.price && priceBreak.price > 0 ? correctedPrice(priceBreak.price, unitMultiplier) :  undefined
            const extPrice = priceBreak.price && priceBreak.price > 0 ? extendedPrice(priceBreak.price, priceBreak.minQuantity) : undefined
            return <tr className={`${styles.productPriceTableRow}`}>
              <td className={`${styles.productPriceQuantityDataColumn} pv2 ph3 tl`}>
                <span className={styles.productPriceTableQuantities}>
                  {priceBreak.minQuantity
                    ? `${formatNumber(correctedQuantity(priceBreak.minQuantity, unitMultiplier))}
                      ${priceBreak.maxQuantity ? '' : ' +'}`
                    : ''}
                </span>
              </td>
              <td className={`${styles.productPriceTablePriceColumn} pv2 ph3 tl`}>
                <span>
                  {price
                    ? <FormattedCurrency value={price} />
                    : ' '}
                </span>
              </td>
              <td className={`${styles.productPriceTablePriceColumn} pv2 ph3 tl`}>
                <span>
                  {extPrice
                    ? <FormattedCurrency value={extPrice ?? 0} />
                    : ' '}
                </span>
              </td>
              {zipCode === '' && index === 0 ? (
                <td className={`${styles.productPriceTableLeadTimeColumn} pv2 tl`}>
                  <PostalCodeSelector postalCode={zipCode} updatePostalCode={updatePostalCode} />
                </td>
              ) : (
                <td className={`${styles.productPriceTableLeadTimeColumn} pv2 tl`}>
                  <span>
                    {priceBreak.minQuantity && zipCode === ''
                      ? ' '
                      : priceBreak.leadTime
                        ? priceBreak.leadTime.replace(/(\d+)bd/, '$1 days')
                        : ' '}
                  </span>
                </td>
              )}
            </tr>
            }
          )}
          {remainingRowsCount > 0 ? (
            Array.from(Array(remainingRowsCount).keys()).map(() => (
              <tr className={`${styles.productPriceTableRow}`}>
                <td className={`${styles.productPriceQuantityDataColumn} pv2 ph3 tl`} />
                <td className={`${styles.productPriceTablePriceColumn} pv2 ph3 tl`} />
                <td className={`${styles.productPriceTablePriceColumn} pv2 ph3 tl`} />
                <td className={`${styles.productPriceTableLeadTimeColumn} pv2 ph3 tl`} />
              </tr>
            ))
          ) : (
            <tr />
          )}
        </tbody>
        <tfoot>
          <tr className={`${styles.productPriceTableFooterRow}`}>
            <td className={`${styles.productPriceTableFooterMinimumColumn}`} colSpan={4}>
              <div className={`flex justify-between `}>
                <div className={`flex flex-column`}><span>{intl.formatMessage(messages.minimum)}</span><span>{minimum * unitMultiplier}</span></div>
                <div className={`flex flex-column`}><span>{intl.formatMessage(messages.multiple)}</span><span>{unitMultiplier ? unitMultiplier : ''}</span></div>
                <div className={`flex flex-column`}><span>{intl.formatMessage(messages.unitOfMeasure)}</span><span>{measurementUnit ? measurementUnit : ''}</span></div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default React.memo(ProductPriceBreaks)
