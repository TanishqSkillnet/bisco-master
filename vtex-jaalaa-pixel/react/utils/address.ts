import { isEmpty, isNil } from 'ramda'

export const getAddress = (addressParts: string[]) =>
  addressParts
    .filter(addressPart => !isEmpty(addressPart) && !isNil(addressPart))
    .join(', ')
