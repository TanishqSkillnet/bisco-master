import { ApolloError } from 'apollo-client'

export interface PriceBreakResult {
  loading: boolean
  error?: ApolloError
  data: PriceBreaks
}

export interface PriceBreaks {
  priceBreaks: PriceBreak[]
}

export interface PriceBreak {
  itemId: string
  maxQuantity: number
  minQuantity: number
  price: number
  leadTime: string
  totalScheduledTime: string
}