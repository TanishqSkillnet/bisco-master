declare module 'vtex.product-context*' {
  import { Context, Dispatch } from 'react'

  export const ProductContext: Context
  export const useProductDispatch: Dispatch
}
