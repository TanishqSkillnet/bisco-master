import React, { SyntheticEvent } from 'react'
import { Button as VTEXButton } from 'vtex.styleguide'
import styles from './button.css'
import { generateBlockClass } from '@vtex/css-handles'
import {descriptionMessage, documentMediaMessage, specificationMessage} from './MessageTypes'

type Props = {
  location: string
  text?: string
  blockClass?: string
  block?: boolean
}

const navigateToPage = (url: string, _event: SyntheticEvent) => {
  if (url.indexOf('#') === 0 && url.indexOf('?') === -1) {
    window.location.hash = url
    return
  }
  window.location.href = url
  return
}

const messageSelector = {
  description: descriptionMessage,
  documentMedia: documentMediaMessage,
  specification: specificationMessage
}

const Button = ({ block, blockClass, location, text }: Props) => {
  const classes = generateBlockClass(styles.buttonContainer, blockClass)

  const CurrentMessage = text === 'Description' ? messageSelector.description
   : text === 'Specifications' ? messageSelector.specification
    : text === 'Documents & Media' ? messageSelector.documentMedia
     : messageSelector.description

  return (
    <div className={`w-100 ${classes}`}>
      <VTEXButton
        variation="primary"
        block={block}
        onClick={(e: SyntheticEvent) => navigateToPage(location, e)}>
         <CurrentMessage/>
      </VTEXButton>
    </div>
  )
}

Button.defaultProps = {
  block: true,
}

Button.schema = {
  title: 'custom button wrapper component',
  description: 'custom button wrapper component',
  type: 'object',
  properties: {
    text: {
      title: 'button text',
      description: 'button text',
      type: 'string'
    },
  }
}

export default Button
