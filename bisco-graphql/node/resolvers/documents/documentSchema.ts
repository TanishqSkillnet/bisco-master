import { map, prop, toPairs } from 'ramda'

export const resolvers = {
  DocumentSchema: {
    cache: prop('v-cache'),
    indexed: prop('v-indexed'),
    properties: ({properties} : any) =>
      map(([name, rest]: any) => ({
        name,
        optional: rest.optional || false,
        type: rest.type,
      }), toPairs(properties)),

    security: prop('v-security'),
  },
}
