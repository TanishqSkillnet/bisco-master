export const OFFLINE_ORDER_ACRONYM = 'OfflineOrder'
export const OFFLINE_ORDER_FIELDS = [
  'orderId',
  'id',
  'billingAddress',
  'shippingAddress',
  'status',
  'createdDate',
  'email',
  'totalCost',
]
export const OFFLINE_ORDER_SCHEMA = 'offline-order-schema-v1'

export const OFFLINE_ORDER_ITEM_ACRONYM = 'OfflineOrderItem'
export const OFFLINE_ORDER_ITEM_FIELDS = [
  'itemNo',
  'refId',
  'deliveryDate',
  'orderId',
  'quantity',
  'cost',
]
export const OFFLINE_ORDER_ITEM_SCHEMA = 'offline-order-item-schema-v1'

export const NO_IMAGE = 'http://www.biscoind.com/images/no-image.png'
