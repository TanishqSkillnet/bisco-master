import { isEmpty, isNil } from 'ramda'

export const buildAddress = (addressParts: string[]) => {
  return addressParts.filter(addressPart => !isEmpty(addressPart) && !isNil(addressPart)).join(', ')
}
