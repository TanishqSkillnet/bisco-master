import { ApolloError } from 'apollo-client'

export interface Category {
  id: string
  name: string
  link: string
  children: Category[]
}

export interface CategoryItem {
  id: string
  name: string
  key: string
  to: string
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

export interface FacetImage {
  id: string
  facetId: string
  facetType: string
  url: string
}

export interface MDSearchDocumentResult {
  id: string
  fields: MDField[]
}

export interface ProductResult {
  loading: boolean
  error?: ApolloError
  data: ProductData
}

export interface ProductData {
  product: Product
}

export interface Product {
  productName: string
  productId: string
  description: string
  brand: string
  linkText: string
  items: Sku[]
}

export interface Sku {
  itemId: string
  name: string
  images: SkuImage[]
}

export interface SkuImage {
  imageUrl: string
}
