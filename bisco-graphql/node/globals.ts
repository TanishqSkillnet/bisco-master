import {
  IOContext,
  MetricsAccumulator,
  SegmentData,
  ServiceContext,
} from '@vtex/api'

import { Clients } from './clients'
import { LogisticsDataSource } from './dataSources/logistics'
import { PricingDataSource } from './dataSources/pricing'
import { RatesAndBenefitsDataSource } from './dataSources/ratesAndBenefits'

if (!global.metrics) {
  console.error('No global.metrics at require time')
  global.metrics = new MetricsAccumulator()
}

declare global {
  type Context = ServiceContext<Clients, void, CustomContext>

  interface CustomContext {
    cookie: string
    dataSources: StoreGraphQLDataSources
    originalPath: string
    vtex: CustomIOContext
  }

  interface CustomIOContext extends IOContext {
    segment?: SegmentData
    orderFormId?: string
  }

  interface StoreGraphQLDataSources {
    pricing: PricingDataSource
    ratesAndBenefits: RatesAndBenefitsDataSource
    logistics: LogisticsDataSource
  }

  interface DocumentResponse {
    Id: string
    Href: string
    DocumentId: string
  }

  interface DocumentsArgs {
    acronym: string
    fields: string[]
    page: number
    pageSize: number
    where: string
    schema?: string
  }

}
