import { endsWith } from 'ramda'

export const documentSerializer = (documents: Document[]) => {
  if (!documents) {
    return []
  }

  const fieldReducer = (fieldsAccumulator: DocumentObject, field: Field) => {
    if (!endsWith('_linked', field.key)) {
      fieldsAccumulator[field.key] = field.value
    }
    if (endsWith('_linked', field.key)) {
      fieldsAccumulator[field.key] = JSON.parse(field.value)
    }
    return fieldsAccumulator
  }

  const documentReducer = (
    documentAccumulator: DocumentObject[],
    document: Document
  ) => {
    if (!document || !document.fields) {
      return documentAccumulator
    }
    documentAccumulator.push(document.fields.reduce(fieldReducer, {}))
    return documentAccumulator
  }

  return documents.reduce(documentReducer, [] as DocumentObject[])
}
