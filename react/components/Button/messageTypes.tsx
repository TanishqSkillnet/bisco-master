import { FormattedMessage } from 'react-intl'
import React from 'react'

const descriptionMessage = () => {
  return (
    <FormattedMessage id='store/bisco-components.button-array.description'/>
  )
}

const documentMediaMessage = () => {
  return (
    <FormattedMessage id='store/bisco-components.button-array.documents-media'/>
  )
}

const specificationMessage = () => {
  return (
    <FormattedMessage id='store/bisco-components.button-array.specifications'/>
  )
}

export {descriptionMessage, documentMediaMessage, specificationMessage}
