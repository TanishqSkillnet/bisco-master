import React, { useState } from 'react'
import { Button, Input } from 'vtex.styleguide'
import styles from './postalCodeSelector.css'
import { useIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
  update: {
    defaultMessage: 'Update',
    id: 'store/bisco-components.update',
  },
  postalCode: {
    defaultMessage: 'Postal Code',
    id: 'store/bisco-components.postal-code',
  },
  zip: {
    defaultMessage: 'ZIP',
    id: 'store/bisco-components.zip',
  },
  zipChange: {
    defaultMessage: 'Change',
    id: 'store/bisco-components.change',
  },
})
interface Props {
  postalCode: string
  updatePostalCode?: (e: any) => void
}

const PostalCodeSelector = ({ postalCode, updatePostalCode }: Props) => {
  const intl = useIntl()
  const [zipCode, setZipCode] = useState(postalCode)
  const [showUpdatePostalCode, setShowUpdatePostalCode] = useState(false)

  const onUpdatePostalCodeClicked = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    if (updatePostalCode) {
      updatePostalCode(zipCode)
    }
    setShowUpdatePostalCode(false)
  }

  const onPostalCodeChange = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setZipCode(e.target.value)
  }

  const showPostalCodePopup = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setShowUpdatePostalCode(true)
  }

  const hidePostalCodePopup = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setShowUpdatePostalCode(false)
  }

  const postalCodePopupClicked = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <section onClick={postalCodePopupClicked}>
      <div className={styles.postalCodeLink}>

        { postalCode && (<span className="b">{postalCode} </span>)}
        <a onClick={showPostalCodePopup}>{postalCode ? intl.formatMessage(messages.zipChange) : intl.formatMessage(messages.zip)}</a>
      </div>
      {showUpdatePostalCode && (
        <div className={`${styles.zipCodeEditBox}`}>
          <div>
            <span onClick={hidePostalCodePopup}>X</span>
          </div>
          <div className={`${styles.zipCodeInputEditBox}`}>
            <Input
              placeholder={intl.formatMessage(messages.postalCode)}
              dataAttributes={{ 'hj-white-list': true }}
              label={intl.formatMessage(messages.postalCode)}
              value={zipCode}
              onChange={onPostalCodeChange}
            />
            <Button onClick={onUpdatePostalCodeClicked}>{intl.formatMessage(messages.update)}</Button>
          </div>
        </div>
      )}
    </section>
  )
}

export default React.memo(PostalCodeSelector)
