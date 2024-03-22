import { canUseDOM } from 'vtex.render-runtime'
// eslint-disable-next-line no-restricted-imports
import { pathOr } from 'ramda'
import * as uuid from 'uuid'

import { PixelMessage, ProductOrder } from './typings/events'
import { getCookie, setCookie } from './utils/dom-utils'
import { getAddress } from './utils/address'
// import push from './modules/push'
// import { fetchProfile } from './helpers'

async function handleEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    // case 'vtex:quoteAdd': {
    //   const {
    //     product,
    //     quantity,
    //     profile,
    //     targetPrice,
    //     totalPrice,
    //     note,
    //     needByDate,
    //   } = e.data

    //   const categories: string[] = pathOr(
    //     [],
    //     ['categories'],
    //     product
    //   ) as string[]
    //   const longestCategory =
    //     categories.length > 0
    //       ? categories.reduce((a: string, b: string) => {
    //           return a.length > b.length ? a : b
    //         })
    //       : ''

    //   const ecommerce = {
    //     quote: {
    //       firstName: pathOr('', ['firstName'], profile),
    //       lastName: pathOr('', ['lastName'], profile),
    //       emailAddress: pathOr('', ['email'], profile),
    //       companyName: pathOr('', ['corporateName'], profile),
    //       address: getAddress([
    //         pathOr('', ['address', 'number'], profile),
    //         pathOr('', ['address', 'street'], profile),
    //         pathOr('', ['address', 'city'], profile),
    //         pathOr('', ['address', 'state'], profile),
    //       ]),
    //       zipCode: pathOr('', ['address', 'postalCode'], profile),
    //       country: pathOr('', ['address', 'country'], profile),
    //       category: (longestCategory.match(/[^/]+/g) ?? []).join('/'),
    //       product,
    //     },
    //   }

    //   push({
    //     event: 'quoteAdded',
    //     // ...quote,
    //     ecommerce,
    //   })
    //   let jaalaUserCookie = getCookie('jaala-user')
    //   if (!jaalaUserCookie) {
    //     jaalaUserCookie = setCookie('jaala-user', uuid.v4())
    //   }
    //   addInteractionQuote(
    //     pathOr('', ['brandId'], product),
    //     pathOr('', ['sku', 'name'], product),
    //     quantity,
    //     parseFloat(
    //       pathOr('', ['sku', 'sellers', 0, 'commertialOffer', 'Price'], product)
    //     ),
    //     jaalaUserCookie,
    //     pathOr('', ['firstName'], profile),
    //     pathOr('', ['lastName'], profile),
    //     pathOr('', ['email'], profile),
    //     pathOr('', ['phoneNumber'], profile),
    //     pathOr('', ['corporateName'], profile),
    //     getAddress([
    //       pathOr('', ['address', 'number'], profile),
    //       pathOr('', ['address', 'street'], profile),
    //       pathOr('', ['address', 'city'], profile),
    //       pathOr('', ['address', 'state'], profile),
    //     ]),
    //     pathOr('', ['address', 'postalCode'], profile),
    //     pathOr('', ['address', 'country'], profile),
    //     targetPrice,
    //     totalPrice,
    //     note,
    //     needByDate,
    //     pathOr('', ['brand'], product),
    //     'E'
    //   )
    //   addUbQuote(
    //     pathOr('', ['brandId'], product),
    //     pathOr('', ['sku', 'name'], product),
    //     quantity,
    //     parseFloat(
    //       pathOr('', ['sku', 'sellers', 0, 'commertialOffer', 'Price'], product)
    //     ),
    //     jaalaUserCookie,
    //     pathOr('', ['firstName'], profile),
    //     pathOr('', ['lastName'], profile),
    //     pathOr('', ['email'], profile),
    //     pathOr('', ['phoneNumber'], profile),
    //     pathOr('', ['corporateName'], profile),
    //     getAddress([
    //       pathOr('', ['address', 'number'], profile),
    //       pathOr('', ['address', 'street'], profile),
    //       pathOr('', ['address', 'city'], profile),
    //       pathOr('', ['address', 'state'], profile),
    //     ]),
    //     pathOr('', ['address', 'postalCode'], profile),
    //     pathOr('', ['address', 'country'], profile),
    //     pathOr('', ['brand'], product)
    //   )
    //   break
    // }
    case 'vtex:orderPlaced': {
      const {
        corporateName,
        openTextField,
        transactionProducts,
        transactionTotal,
        visitorAddressCity,
        // visitorAddressComplement,
        visitorAddressCountry,
        // visitorAddressNeighbordhood,
        visitorAddressNumber,
        visitorAddressPostalCode,
        visitorAddressState,
        visitorAddressStreet,
        visitorContactInfo,
        visitorContactPhone,
      } = e.data
      // const profile = await fetchProfile()
      let jaalaUserCookie = getCookie('jaala-user')
      if (!jaalaUserCookie) {
        jaalaUserCookie = setCookie('jaala-user', uuid.v4())
      }
      addInteractionOrder(
        transactionProducts.map((product: ProductOrder) => ({
          prc: pathOr('', ['brandId'], product),
          partNumber: pathOr('', ['skuName'], product),
          quantity: parseInt(pathOr('', ['quantity'], product), 10),
          unitPrice: parseFloat(pathOr('', ['price'], product)),
        })),
        jaalaUserCookie,
        visitorContactInfo[1],
        visitorContactInfo[2],
        visitorContactInfo[0],
        visitorContactPhone,
        corporateName,
        getAddress([
          visitorAddressNumber || '',
          visitorAddressStreet || '',
          visitorAddressCity || '',
          visitorAddressState,
        ]),
        visitorAddressPostalCode,
        visitorAddressCountry,
        0,
        transactionTotal,
        pathOr('', ['value'], openTextField)
      )
      addUbOrder(
        transactionProducts.map((product: ProductOrder) => ({
          prc: pathOr('', ['brandId'], product),
          partNumber: pathOr('', ['skuName'], product),
          quantity: parseInt(pathOr('', ['quantity'], product), 10),
          unitPrice: parseFloat(pathOr('', ['price'], product)),
          brandName: pathOr('', ['brand'], product),
        })),
        jaalaUserCookie,
        visitorContactInfo[1],
        visitorContactInfo[2],
        visitorContactInfo[0],
        visitorContactPhone,
        corporateName,
        getAddress([
          visitorAddressNumber || '',
          visitorAddressStreet || '',
          visitorAddressCity || '',
          visitorAddressState,
        ]),
        visitorAddressPostalCode,
        visitorAddressCountry
      )
      break
    }
    default: {
      break
    }
  }
}

if (canUseDOM) {
  window.addEventListener('message', handleEvents)
}
