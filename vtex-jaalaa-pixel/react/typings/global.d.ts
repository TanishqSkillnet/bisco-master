interface Window extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataLayer: any[]
}

declare function addInteractionQuote(
  prc: string,
  partNumber: string,
  quantity: number,
  unitPrice: number,
  cookie: string,
  firstName?: string,
  lastName?: string,
  emailAddress?: string,
  phoneNumber?: string,
  companyName?: string,
  address?: string,
  postalCode?: string,
  country?: string,
  targetPrice?: number,
  totalPrice?: number,
  note?: string,
  dateNeeded?: string,
  brand?: string,
  unitOfMeasure?: string
): void

interface Item {
  prc: string
  partNumber: string
  quantity: number
  unitPrice: number
}

interface ItemLegacy {
  prc: string
  partNumber: string
  quantity: number
  unitPrice: number
  brandName: string
}

declare function addInteractionOrder(
  products: Item[],
  cookie: string,
  firstName?: string,
  lastName?: string,
  emailAddress?: string,
  phoneNumber?: string,
  companyName?: string,
  address?: string,
  postalCode?: string,
  country?: string,
  targetPrice?: number,
  totalPrice?: number,
  note?: string
): void

declare function addUbQuote(
  prc: string,
  partNumber: string,
  quantity: number,
  unitPrice: number,
  cookie: string,
  firstName?: string,
  lastName?: string,
  emailAddress?: string,
  phoneNumber?: string,
  companyName?: string,
  address?: string,
  postalCode?: string,
  country?: string,
  brandName?: string
): void

declare function addUbOrder(
  products: ItemLegacy[],
  cookie: string,
  firstName?: string,
  lastName?: string,
  emailAddress?: string,
  phoneNumber?: string,
  companyName?: string,
  address?: string,
  postalCode?: string,
  country?: string
): void
