import { createContext, useContext } from 'react'

const ProductSummaryContext = createContext({
  product: {
    selectedItem: {
      sellers: [],
    },
  },
})

export const useProductSummary = () => {
  return useContext(ProductSummaryContext)
}
