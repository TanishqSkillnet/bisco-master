import { mergeAll, zipObj } from 'ramda'

/*
 * Convert a list of fields like [ {key: 'propertyName', value: 'String'}, ... ]
 * to a JSON format.
 */
const parseFieldsToJson = (fields: any) => mergeAll(
  fields.map((field: any) => zipObj([field.key], [field.value]))
)

export { parseFieldsToJson }
