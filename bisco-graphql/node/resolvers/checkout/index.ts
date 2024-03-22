import { head, path, pathOr } from 'ramda'
import { CheckoutItem, Slas } from '../utils/interfaces'
import { simulationData, sortByShippingEstimateAscending } from '../utils/priceUtils'

export const fieldResolvers = {
  ShippingInfo: {
    itemId: (item: any, _: any) => path(['skuId'], item),
    leadTime: (item: any, _: any) => path(['shippingEstimate'], item),
  },
}

export const queries = {
  leadTime: async (_: any, args: any, ctx: any) => {
    const {
      clients: { checkout },
    } = ctx

    const { skuId, quantity, postalCode, sellerId } = args

    try {
      const result: CheckoutItem = await checkout.shipping(
        simulationData(skuId, quantity, sellerId, postalCode)
      )

      return {
        skuId,
        ...head(
          sortByShippingEstimateAscending(path(['logisticsInfo', 0, 'slas'], result) as Slas[])
        ),
      }
    } catch (e) {
      // TODO: Log the error
      throw pathOr('', ['response', 'data', 'error', 'message'], e)
    }
    return {}
  },
}
