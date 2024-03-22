import { lensPath, view } from 'ramda'

 export const getItemInfo = (product: any, referenceId: string) => {

   if(!product || !referenceId) return null

   return {
    imageUrl: view(lensPath(['items', 0, 'images', 0, 'imageUrl']), product),
  }
}