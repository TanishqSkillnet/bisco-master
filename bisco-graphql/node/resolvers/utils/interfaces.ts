export interface InventoryResponse {
  skuId: string
  balance: [Balance]
}

export interface Balance {
  warehouseId: string
  warehouseName: string
  totalQuantity: number
  reservedQuantity: number
  hasUnlimitedQuantity: boolean
  timeToRefill: string
}

export interface FixedPrice {
  tradePolicyId: string
  value: number,
  listPrice: number | undefined
  minQuantity: number
}

export interface PriceBreaksWithLeadTime {
  itemId: string
  minQuantity: number
  maxQuantity?: number
  price: number
  leadTime?: string
}

export interface CheckoutItem{
  logisticsInfo: LogisticsInfo[]
  items: Item[]
}

export interface FlattenedCheckoutItem {
  logisticsInfo: LogisticsInfo
  item: Item
}

export interface Item {
  quantity: number,
  sellingPrice: number
  price: number
}

export interface LogisticsInfo {
  quantity: number
  slas: Slas[]
}

export interface Slas {
  price: number,
  shippingEstimate: string
}