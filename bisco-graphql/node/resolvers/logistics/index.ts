import { path } from 'ramda'
import { Balance, InventoryResponse } from '../utils/interfaces'

export const fieldResolvers = {
  AvailableInventory: {
    skuId: (entity: InventoryResponse, _: any) => path(['skuId'], entity),
    totalAvailableInventory: (entity: InventoryResponse, _: any) => {
      const totalAvailableQuantity =
        entity && entity.balance
          ? entity.balance.reduce((total: number, entityBalance: Balance) => {
              if (!entityBalance.hasUnlimitedQuantity) {
                total += entityBalance.totalQuantity
              }
              return total
            }, 0)
          : 0
      return totalAvailableQuantity ? totalAvailableQuantity : 0
    },
  },
}

export const queries = {
  availableInventory: async (_: any, args: any, ctx: any) => {
    const {
      dataSources: { logistics },
    } = ctx
    const { skuId } = args

    return skuId ? await logistics.inventoryBySku(skuId) : null
  },
}
