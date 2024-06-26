import { LRUCache, method, Service } from '@vtex/api'

import { Clients } from './clients'
import { dataSources } from './dataSources'
import { schemaDirectives } from './directives'
import './globals'
import { googleVerification } from './middleWare/googleVerfication'
import { resolvers } from './resolvers'

// const TWO_SECONDS_MS = 2 * 1000
const THREE_SECONDS_MS = 3 * 1000
const FIVE_SECOND_MS = 5 * 1000

// Segments are small and immutable.
const MAX_SEGMENT_CACHE = 10000
const segmentCache = new LRUCache<string, any>({ max: MAX_SEGMENT_CACHE })
metrics.trackCache('segment', segmentCache)

export { Runtime } from '@vtex/api'

export default new Service<Clients, void, CustomContext>({
  clients: {
    implementation: Clients,
    options: {
      default: {
        retries: 1,
        timeout: FIVE_SECOND_MS,
      },
      segment: {
        memoryCache: segmentCache,
        timeout: THREE_SECONDS_MS,
      },
    },
  },
  graphql: {
    dataSources,
    resolvers,
    schemaDirectives,
  },
  routes: {
    googleVerification: method({
      GET: [googleVerification],
    }),
  },
})
