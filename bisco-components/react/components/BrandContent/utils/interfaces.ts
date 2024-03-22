import { ApolloError } from 'apollo-client'

export interface Brand {
  id: string
  name: string
  slug: string
  imageUrl?: string
}

export interface BrandResult {
  loading: boolean
  error?: ApolloError
  data: BrandList
}

export interface BrandList {
  brands: Brand[]
}

export interface ProductResult {
  loading: boolean
  error?: ApolloError
  data: ProductData
}

export interface ProductData {
  product: Product
}

export interface MDField {
  key: string
  value: string
}

export interface MDSearchResult {
  loading: boolean
  error?: ApolloError
  data: MDSearchData
}

export interface MDSearchData {
  documents: MDSearchDocumentResult[]
}

export interface MDSearchDocumentResult {
  id: string
  fields: MDField[]
}

export interface Video {
  title: string
  url: string
}

export interface BrandProduct {
  productId: string
}

export interface Product {
  productName: string
  productId: string
  description: string
  brand: string
  linkText: string
  items: Sku[]
}

export interface NormalizedProduct {
  productName: string
  productId: string
  description: string
  brand: string
  linkText: string
  items: Sku[]
  sku: NormalizedSku
}

export interface Sku {
  itemId: string
  name: string
  sellers: Seller[]
}

export interface NormalizedSku {
  itemId: string
  name: string
  seller: Seller
  referenceId: ReferenceId
  image: SkuImage
}

export interface Seller {
  commertialOffer: CommertialOffer
}

export interface CommertialOffer {
  Price: number
  ListPrice: number
  AvailableQuantity: number
}

export interface ReferenceId {
  Key?: string
  Value: string
}

export interface SkuImage {
  imageUrl: string
}
