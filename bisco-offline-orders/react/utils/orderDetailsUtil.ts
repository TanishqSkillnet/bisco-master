import { pathOr } from 'ramda'

export const addressSplitter = (address: string) => {
  if (address === undefined || address.trim() === '') {
    return []
  }

  return address.split(',')
}

export const costForItems = (items: OfflineOrderItem[]) => {
  if (items === undefined || items.length === 0) {
    return 0
  }

  return items.reduce((accumulator: number, currentValue: OfflineOrderItem) => {
    let cost = 0
    let quantity = 0
    try {
      cost = parseFloat(pathOr('0', ['cost'], currentValue)) as number
    } catch (e) {
      console.log(e)
    }
    try {
      quantity = parseFloat(pathOr('0', ['quantity'], currentValue)) as number
    } catch (e) {
      console.log(e)
    }
    return accumulator + (cost * quantity)
  }, 0)
}
