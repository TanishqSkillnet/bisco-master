import { Service } from '@vtex/api'
import {
  getMediaLeadDocuments
} from './resolvers/GetMediaLeadDocuments'


export default new Service({
  graphql: {
    resolvers: {
      Query: {
        getMediaLeadDocuments
      },
    },
  },
})
