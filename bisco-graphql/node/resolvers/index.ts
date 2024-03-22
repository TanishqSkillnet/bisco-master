import { fieldResolvers as checkoutFieldResolvers, queries as checkoutQueries } from './checkout'
import { queries as documentQueries } from './documents'
import { fieldResolvers as logisticsFieldResolvers, queries as logisticsQueries } from './logistics'
import {
  fieldResolvers as priceBreaksFieldResolvers,
  queries as priceBreaksQueries,
} from './prices'

// eslint-disable-next-line no-global-assign
// tslint:disable-next-line:no-var-requires
Promise = require('bluebird')

export const resolvers = {
  ...priceBreaksFieldResolvers,
  ...logisticsFieldResolvers,
  ...checkoutFieldResolvers,
  // ...documentFieldResolvers,
  Query: {
    ...priceBreaksQueries,
    ...logisticsQueries,
    ...checkoutQueries,
    ...documentQueries,
  },
}
