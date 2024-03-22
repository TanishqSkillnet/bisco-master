export interface Profile {
  cacheId: string
  firstName: string
  lastName: string
  gender: string
  email: string
  homePhone: string
  tradeName: string
  corporateName: string
  stateRegistration: string
  isCorporate: boolean
}

export interface Brand {
  cacheId: string
  id: string
  name: string
  slug: string
  active: boolean
}
