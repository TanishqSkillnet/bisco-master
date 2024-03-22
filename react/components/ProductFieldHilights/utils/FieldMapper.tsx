import { FIELDS_ALLOWED, PRODUCT_FIELD_MAPPINGS } from './constants'
import { head, path } from 'ramda'

export const getField = (fieldName: string, product: any) => {
  const fieldMappings = PRODUCT_FIELD_MAPPINGS[fieldName] as any
  const fieldValue = fieldMappings ? path(fieldMappings.path, product) : null

  // Get product RefId
  if (fieldMappings && FIELDS_ALLOWED.RefId === fieldName) {
    const referenceIds = (fieldValue as any[])
      .filter(referenceId => referenceId.Key === FIELDS_ALLOWED.RefId)
      .map(referenceId => ({ name: fieldMappings.name, value: referenceId.Value }))

    return head(referenceIds)
  }

  if(fieldMappings && FIELDS_ALLOWED.RefIdProductSummary === fieldName){
    return { name: fieldMappings.name, value: (fieldValue as any).Value }
  }

  return fieldValue ? { name: fieldMappings.name, value: fieldValue } : null
}
