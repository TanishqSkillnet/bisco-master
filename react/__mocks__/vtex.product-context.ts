import React from 'react'

export const ProductContext = React.createContext({
  selectedItem: {
    sellers: [
      {
        commertialOffer: {
          AvailableQuantity: 40,
        },
      },
      {
        commertialOffer: {
          AvailableQuantity: 1000060,
        },
      },
    ],
  },
})
