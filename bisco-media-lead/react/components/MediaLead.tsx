import { head } from 'ramda'
import React from 'react'
import { compose, graphql } from 'react-apollo'
import { session } from 'vtex.store-resources/Queries'
import { Modal } from 'vtex.styleguide'
import DocumentQuery from '../graphql/documents.graphql'
import { MEDIA_LEAD_ACRONYM, MEDIA_LEAD_FIELDS, MEDIA_LEAD_SCHEMA } from '../utils/consts'
import { ProductInfo } from '../utils/dataTypes'
import { documentSerializer } from '../utils/documentSerializer'
import LeadForm from './LeadForm'
import { injectIntl } from 'react-intl'

import styles from '../productMediaLink.css'


interface InputProps {
  productInfo: ProductInfo
  modalOpen: boolean
  onCloseModal: any
  session?: SessionData
  onFormSubmit?: any
}

interface SessionData extends InputProps {
  sessionInfo?: any
  isSessionLoading: boolean
}

interface LeadInfo extends InputProps {
  cachedLead?: any
  isCachedLeadLoading: boolean
}

const MediaLeadPopup = (props: any) => {
  const {
    modalOpen,
    productInfo,
    onCloseModal,
    onFormSubmit,
    cachedLead,
    sessionInfo,
    intl,
  } = props

  return (
    <Modal isOpen={modalOpen} onClose={onCloseModal}>
      <div className={styles.modalContiner}>
        <h4 className="t-heading-4 mt0">{intl.formatMessage({ id: 'store/media-links.components.MediaLead.mediaLead' })}</h4>

        <LeadForm
          profile={sessionInfo? sessionInfo.profile : null}
          existingLead={cachedLead}
          productInfo={productInfo}
          onAfterFormSubmit={onFormSubmit}
        />
      </div>
    </Modal>
  )
}

const withLead = graphql<InputProps, LeadInfo>(DocumentQuery, {
  name: 'cachedLead',
  options: (props: any) => {
    const savedLeadId = sessionStorage.getItem(props.productInfo.productRefId)
    return {
      ssr: false,
      variables: {
        acronym: MEDIA_LEAD_ACRONYM,
        fields: MEDIA_LEAD_FIELDS,
        page: 1,
        pageSize: 10,
        schema: MEDIA_LEAD_SCHEMA,
        where: `id=${savedLeadId ? savedLeadId : '_'}`,
      },
    }
  },
  props: ({ cachedLead, ownProps }: any) => {
    const leads =
      !cachedLead.loading && cachedLead.documents && cachedLead.documents.length > 0
        ? documentSerializer(cachedLead.documents)
        : []
    return { cachedLead: head(leads), isCachedLeadLoading: cachedLead.loading, ...ownProps }
  },
})

const withSession = graphql<InputProps, SessionData>(session, {
  name: 'sessionInfo',
  options: () => ({ ssr: false }),
  props: ({ sessionInfo, ownProps }: any) => {
    return { sessionInfo: sessionInfo.getSession, isSessionLoading: sessionInfo.loading, ...ownProps }
  },
})

export default compose(
  injectIntl,
  withLead,
  withSession
)(MediaLeadPopup)
