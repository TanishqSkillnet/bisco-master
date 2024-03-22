import { PriceBreak } from './interfaces'

export const getPriceBreaksRows = (priceBreaks: PriceBreak[], maxRows: number) => {

  const fillEmptyCount = maxRows - priceBreaks.length > 0 ? maxRows - priceBreaks.length : 0
  const emptySet =
    fillEmptyCount > 0
      ? [...new Array(fillEmptyCount)].map(
          () =>
            ({
              itemId: '',
              maxQuantity: 0,
              minQuantity: 0,
              price: 0,
              leadTime: '',
              totalScheduledTime: '',
            } as PriceBreak)
        )
      : []

  return [...priceBreaks, ...emptySet]
}

export const correctedQuantity = (quantity?: number, unitMultiplier?: number) => {
  if (!quantity) {
    return undefined
  }
  return quantity * (unitMultiplier ? unitMultiplier : 1)
}

export const correctedPrice = (price?: number, unitMultiplier?: number) => {
  if (!price) {
    return undefined
  }
  return price / (unitMultiplier ? unitMultiplier : 1)
}

export const extendedPrice = (price?: number, minQuantity?: number) => {
  if(!price || !minQuantity) {
    return undefined
  }
  return price * minQuantity as number
}
