import { map, path, union } from 'ramda'

export const queries = {
  documentsWithPagination: async (_: any, args: DocumentsArgs, context: Context) => {
    const { acronym, fields, page, pageSize, where, schema } = args
    const {
      clients: { masterdata },
    } = context
    const fieldsWithId = union(fields, ['id'])
    const data = (await masterdata.searchDocuments(
      acronym,
      fieldsWithId,
      where,
      {
        page,
        pageSize,
      },
      schema
    )) as any
    const documents = path(['data'], data) as any
    const pageInfo = path(['pageInfo'], data) as any
    return {
      items: map((document: any) => ({
        cacheId: document.id,
        fields: mapKeyAndStringifiedValues(document),
        id: document.id,
      }))(documents),
      pagination: pageInfo,
    }
  },
}

// export const fieldResolvers = {
//   ...documentSchemaResolvers,
// }

/**
 * Map a document object to a list of {key: 'property', value: 'propertyValue'},
 * Uses `JSON.stringify` in every value.
 */
const mapKeyAndStringifiedValues = (document: any) =>
  Object.keys(document).map(key => ({
    key,
    value:
      typeof document[key] === 'string'
        ? document[key]
        : JSON.stringify(document[key]),
  }))
