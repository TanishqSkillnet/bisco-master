import { lensPath, pathOr, view } from 'ramda'

export const getItemInfo = (product: any, referenceId: string) => {
  
  if(!product || !referenceId) { return null }

  const items: any[] = pathOr([], ['items'], product) as any[]
  
  const relatedSku = items.filter((item: any) => {
    const referenceIds: any[] = pathOr([], ['referenceId'], item) as any[]
    return referenceIds && referenceIds.filter((refId: any) => refId.Key ==='RefId' && refId.Value===referenceId).length > 0
  })

  return {
    imageUrl: view(lensPath([0, 'images', 0, 'imageUrl']), relatedSku),
  }
}
