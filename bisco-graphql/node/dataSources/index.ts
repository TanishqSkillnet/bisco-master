import { LogisticsDataSource } from './logistics'
import { PricingDataSource } from './pricing'
import { RatesAndBenefitsDataSource } from './ratesAndBenefits'

export const dataSources = () => ({
  logistics: new LogisticsDataSource(),
  pricing: new PricingDataSource(),
  ratesAndBenefits: new RatesAndBenefitsDataSource(),
})
