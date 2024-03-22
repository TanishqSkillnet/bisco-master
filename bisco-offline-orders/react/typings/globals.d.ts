import { ReactNode } from 'react'
import { ApolloError } from 'apollo-client'

declare global {
  interface ChallengeProps {
    children: ReactNode[]
  }

  interface MDField {
    key: string
    value: string
  }

  interface MDSearchResult {
    loading: boolean
    error?: ApolloError
    data: MDSearchData
  }

  interface MDSearchData {
    documents: MDSearchDocumentResult[]
  }

  interface MDSearchDocumentResult {
    id: string
    fields: MDField[]
  }

  interface MDPaging {
    page: number
    perPage: number
    total: number
    from: string
    to: string
  }

  interface OfflineOrder {
    orderId: string
    billingAddress: string
    shippingAddress: string
    status: string
    createdDate: string
    totalCost: string
  }

  interface OfflineOrderItem{
    itemNo: string 
    refId: string 
    deliveryDate: string 
    orderId: string 
    quantity: string 
    cost: string
  }
}
