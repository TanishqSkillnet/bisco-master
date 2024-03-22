import { PriceBreaksWithLeadTime, Slas } from './interfaces'

export const simulationData = (
  itemId: string,
  quantity: number,
  sellerId: string,
  postalCode: string
) => {
  return {
    country: 'USA',
    items: [
      {
        id: itemId,
        quantity,
        seller: sellerId,
      },
    ],
    postalCode,
  }
}

export const getQuantityBreaks = (itemId: string, numbers: number[]) => {
  const priceArray = sortNumberArray(numbers).reduce(
    (accumulator: PriceBreaksWithLeadTime[], current: number, index: number, array: number[]) => {
      accumulator.push({
        itemId,
        leadTime: undefined,
        maxQuantity: array.length >= index + 1 ? array[index + 1] - 1 : undefined,
        minQuantity: current,
        price: 0,
      })
      return accumulator
    },
    []
  )

  return priceArray
}

export const sortNumberArray = (numbers: number[]) => {
  return numbers.sort((a, b) => a - b)
}

export const sortByShippingEstimateAscending = (inputArray: Slas[]) => {
  return inputArray? inputArray.sort((x: any, y: any) => {
    if (x.shippingEstimate < y.shippingEstimate) {
      return -1
    }
    if (x.shippingEstimate > y.shippingEstimate) {
      return 1
    }
    return 0
  }): []
}