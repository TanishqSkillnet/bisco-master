export interface Book {
  authors: string[]
  cacheId?: string
  id: string
  name: string
}

export interface BookInput {
  name: Book['name']
  authors: Book['authors']
}

export interface quickQuoteDataObjectInput {
  firstName: string,
  lastName: string,
  emailAddress: string,
  companyName: string,
  address: string,
  city: string,
  state: string,
  phone: string,
  postalCode: string,
  country: string,
  targetPrice: string,
  totalPrice: string,
  note: string,
  cookie: string,
  type: string,
  dateNeeded: string,
  items: quickQuoteDataItemInput[],
  campaignInfo: quickQuoteCampaignInfoInput
}

export interface quickQuoteDataItemInput {
  biscoPartNumber: string,
  prc: string,
  partNumber: string,
  brandName: string,
  quantity: number,
  unitOfMeasure: string,
  targetPrice: number,
  unitPrice: number
}

export interface quickQuoteCampaignInfoInput {
  source: string,
  medium: string,
  campaignName: string,
  term: string,
  contentPage: string,
  id: string,
  referrer: string
}

export type Maybe<T> = T | void
