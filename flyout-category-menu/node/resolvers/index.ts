import {
  fieldResolvers as catalogFieldResolvers,
  queries as catalogQueries,
  mutations as catalogMutations,
} from './catalog'

import {
  fieldResolvers as scheduleFieldResolvers,
  mutations as schedulerMutations,
  queries as schedulerQueries,
} from './scheduler'

import { mutations as translationMutations } from './translations'

export const resolvers = {
  ...catalogFieldResolvers,
  ...scheduleFieldResolvers,
  Query: {
    ...catalogQueries,
    ...schedulerQueries,
  },
  Mutation: {
    ...translationMutations,
    ...catalogMutations,
    ...schedulerMutations,
  },
}
