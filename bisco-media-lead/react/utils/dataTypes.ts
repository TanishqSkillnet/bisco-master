export interface Profile {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface Address {
  country: string
  postalCode: string
}

export interface Brand {
  cacheId: string
  id: string
  name: string
  slug: string
  active: boolean
}

export interface ProductInfo {
  productId: string
  productRefId: string
  productName: string
  brandId: string
  brandName: string
}