import './globals'

import { LRUCache, Service, method } from '@vtex/api'

import { Clients } from './clients'
import { resolvers } from './resolvers'
import { synchronizeCategoryTree } from './middlewares/catalog'

const TWO_SECONDS_MS = 2 * 1000
const THREE_SECONDS_MS = 3 * 1000
const SIX_SECONDS_MS = 6 * 1000
const TEN_SECONDS_MS = 10 * 1000
const THIRTY_SECONDS_MS = 30 * 1000

// Segments are small and immutable.
const MAX_SEGMENT_CACHE = 10000
const segmentCache = new LRUCache<string, any>({ max: MAX_SEGMENT_CACHE })
const catalogCache = new LRUCache<string, any>({ max: 3000 })
const messagesCache = new LRUCache<string, any>({ max: 3000 })

// @ts-ignore
metrics.trackCache('segment', segmentCache)
// @ts-ignore
metrics.trackCache('catalog', catalogCache)
// @ts-ignore
metrics.trackCache('messages', messagesCache)

// @ts-ignore
export default new Service<Clients, void, CustomContext>({
  clients: {
    implementation: Clients,
    options: {
      checkout: {
        concurrency: 10,
        timeout: THIRTY_SECONDS_MS,
      },
      default: {
        retries: 2,
        timeout: THREE_SECONDS_MS,
      },
      messagesGraphQL: {
        concurrency: 5,
        memoryCache: messagesCache,
        timeout: TWO_SECONDS_MS,
      },
      session: {
        concurrency: 10,
        timeout: TEN_SECONDS_MS,
      },
      segment: {
        concurrency: 10,
        memoryCache: segmentCache,
        timeout: THREE_SECONDS_MS,
      },
      catalog: {
        concurrency: 10,
        memoryCache: catalogCache,
        metrics,
        timeout: SIX_SECONDS_MS,
      },
    },
  },
  graphql: {
    resolvers,
  },
  routes: {
    synchronizeCategoryTree: method({
      POST: [synchronizeCategoryTree],
    }),
  },
})
