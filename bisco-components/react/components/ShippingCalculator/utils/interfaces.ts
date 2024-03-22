import { ApolloError } from 'apollo-client'

export interface LeadTimeResult {
  loading: boolean
  error?: ApolloError
  data: ShippingInfo
}

export interface ShippingInfo {
  leadTime: LeadTime
}

export interface LeadTime {
  itemId: string
  leadTime: string
}
