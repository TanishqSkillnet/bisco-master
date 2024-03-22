export const documentSerializer = (documents: MDSearchDocumentResult[]) => {
  
  if (!documents || documents.length === 0) {
    return []
  }

  const fieldReducer = (fieldsAccumulator: any, field: MDField) => {
    fieldsAccumulator[field.key] = field.value
    return fieldsAccumulator
  }

  const documentReducer = (documentAccumulator: any, document: MDSearchDocumentResult) => {
    documentAccumulator.push(document.fields.reduce(fieldReducer, {}))
    return documentAccumulator
  }

  return documents.reduce(documentReducer, [])
}
