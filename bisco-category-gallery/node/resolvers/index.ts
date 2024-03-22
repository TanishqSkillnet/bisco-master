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

export const resolvers = {
  ...catalogFieldResolvers,
  ...scheduleFieldResolvers,
  Query: {
    ...catalogQueries,
    ...schedulerQueries,
  },
  Mutation: {
    ...catalogMutations,
    ...schedulerMutations,
  },
}
