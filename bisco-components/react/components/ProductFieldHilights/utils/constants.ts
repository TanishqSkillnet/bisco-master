interface ProductField {
  RefId: any
  [propName: string]: ProductReference
}

interface ProductReference {
  name: string
  path: string[]
}

export const PRODUCT_FIELD_MAPPINGS: ProductField = {
  RefId: { name: 'Reference # : ', path: ['referenceId'] },
  RefIdProductSummary: { name: 'Reference : ', path: ['sku', 'referenceId'] },
  Brand: { name: 'Brand : ', path: ['brand']}
}

export const FIELDS_ALLOWED = {
  RefId: 'RefId',
  RefIdProductSummary: 'RefIdProductSummary',
  Brand: 'Brand'
}
