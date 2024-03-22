import React from 'react'
import styles from './productFieldHilights.css'
import { getField } from './utils/FieldMapper'
import { useIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
    referencehash: {
      defaultMessage: 'Reference # :',
      id: 'store/bisco-components.referencehash',
    },
    reference: {
      defaultMessage: 'Reference :',
      id: 'store/bisco-components.reference',
    },
    brand: {
      defaultMessage: 'Brand : ',
      id: 'store/bisco-components.brand',
    }
  },
)

const FieldHighlights = (props: any) => {
    const { fieldNames, selectedProduct } = props
    const intl = useIntl()

    return (
        <div className={`${styles.productFieldHighlightsContainer} flex flex-column`}>
          {fieldNames &&
            fieldNames.length > 0 &&
            fieldNames.map((field: string) => {
              const selectedField = getField(field, selectedProduct) as any
              return selectedField ? (
                <div className={styles.productFieldHighlightsFieldWrapper}>
                  <span className={styles.productFieldHighlightsFieldName}>
                    {selectedField.name === 'Reference # : ' && intl.formatMessage(messages.referencehash)}
                    {selectedField.name === 'Reference : ' && intl.formatMessage(messages.reference)}
                    {selectedField.name === 'Brand : ' && intl.formatMessage(messages.brand)}
                  </span>
                  <span className={styles.productFieldHighlightsFieldValue}>{selectedField.value}</span>
                </div>
              ) : (
                <div />
              )
            })}
        </div>
      )
}

export default FieldHighlights
