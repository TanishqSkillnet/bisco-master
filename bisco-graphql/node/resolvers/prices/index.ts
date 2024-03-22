import { head, path, pathOr } from 'ramda'
import { FixedPrice } from '../utils/interfaces'
import {
  CheckoutItem,
  FlattenedCheckoutItem,
  Item,
  LogisticsInfo,
  PriceBreaksWithLeadTime,
  Slas,
} from '../utils/interfaces'
import { getQuantityBreaks, simulationData } from '../utils/priceUtils'

export const fieldResolvers = {
  PriceBreak: {
    price: (item: any, _: any) => (path(['price'], item) as number) / 100,
  },
}

export const queries = {
  priceBreaks: async (
    _: any,
    { itemId, sellerId, tradePolicyId, postalCode }: { itemId: string; sellerId: string, tradePolicyId: string, postalCode: string },
    ctx: any
  ) => {

    const {
      dataSources: { pricing },
      clients: { checkout },
    } = ctx

    try {

      // get fixed prices from pricing
      // ** pricing/prices/{{itemId}}/fixed
      const fixedPrices: [FixedPrice] = await pricing.fixedPrices(itemId)

      // do not proceed if prices not available
      if (!fixedPrices || !fixedPrices.length) {
        return []
      }

      // get price breaks from the response
      const priceBreaksList: PriceBreaksWithLeadTime[] = getQuantityBreaks(
        itemId,
        fixedPrices.filter(fixedPrice => fixedPrice.tradePolicyId === tradePolicyId).map(fixPrice => fixPrice.minQuantity)
      )

      // get checkout simulation responses for price breaks
      // ** checkout/pub/orderforms/simulation
      const results: CheckoutItem[] = await Promise.all(
        priceBreaksList.map(async (priceBreak: PriceBreaksWithLeadTime) => {
          let shipping = []
          try {
            shipping = await checkout.shipping(
              simulationData(itemId, priceBreak.minQuantity, sellerId, postalCode)
            )
          } catch {
            // if checkout api returns error ignore results
            return []
          }
          return shipping
        })
      )

      // return with prices if no checkout response
      if (!results || results.length === 0) {
        return priceBreaksList
      }

      // get logistics info
      const flattenCheckoutInfo: FlattenedCheckoutItem[] = results.map((result: CheckoutItem) => {
        return {
          item: path(['items', 0], result) as Item,
          logisticsInfo: path(['logisticsInfo', 0], result) as LogisticsInfo,
        }
      })

      // get lead times from logistics info and combine with price breaks
      const priceBreaksWithLeadTimes = priceBreaksList.map(
        (priceBreak: PriceBreaksWithLeadTime) => {

          // get selected checkout response
          const checkoutItem: FlattenedCheckoutItem | undefined = head(
            flattenCheckoutInfo.filter(
              (flattenItem: FlattenedCheckoutItem) =>
                flattenItem.item && flattenItem.item.quantity === priceBreak.minQuantity
            )
          )

          // get slas from checkout response
          const slas: Slas[] = pathOr([], ['logisticsInfo', 'slas'], checkoutItem)

          // get shipping estimates from slas
          const shippingEstimates = slas.map((sla: Slas) =>
            parseInt(sla.shippingEstimate.replace(/(^\d+)(.+$)/i, '$1'), undefined)
          )

          // get minimum lead time
          const leadTime =
            shippingEstimates.length === 0
              ? ''
              : shippingEstimates.reduce((estimate1: number, estimate2: number) =>
                  Math.min(estimate1, estimate2)
                )

          return {
            ...priceBreak,
            ...{
              leadTime,
              price: checkoutItem && checkoutItem.item ? checkoutItem.item.sellingPrice : 0,
            },
          }
        }
      )

      return priceBreaksWithLeadTimes
    } catch (e) {
      // TODO: Log the error
      console.log(e)
    }
    return []
  },
}
