import { head, path, pathOr } from 'ramda'
import React, { useContext } from 'react'
import { Query, compose } from 'react-apollo'
import { ProductContext } from 'vtex.product-context'
import { canUseDOM, withRuntimeContext } from 'vtex.render-runtime'
import MediaLink from './components/MediaLink'
import DOCUMENTS from './graphql/documents.graphql'
import styles from './productMediaLink.css'
import { MEDIA_LINK_FIELDS, MEDIA_LINK_SCHEMA, MEDIA_LINKS_ACRONYM } from './utils/consts'
import { ProductInfo } from './utils/dataTypes'
import { Spinner } from 'vtex.styleguide'
import { injectIntl } from 'react-intl'

const ProductMediaLinks = (props: any) => {
  const {
    intl,
    runtime: {
      culture: { locale },
    },
  } = props
  const valuesFromContext = useContext(ProductContext)
  const selectedProduct = path(['selectedItem'], valuesFromContext)

  const referenceIds = (pathOr([], ['referenceId'], selectedProduct) as any[])
    .filter(referenceId => referenceId.Key === 'RefId')
    .map(referenceId => referenceId.Value)

  const product = path(['product'], valuesFromContext) as any

  const productInfo: ProductInfo = {
    brandId: product ? product.brandId : '',
    brandName: product ? product.brand : '',
    productId: product ? product.productId : '',
    productName: product ? product.productName : '',
    productRefId: referenceIds ? encodeURI(head(referenceIds)) : '',
  }

  const selectedLocale = locale === 'es-MX' ? locale : locale === 'ko-KR' ? locale : locale === 'fr-CA' ? locale : 'en-US'

  const queryParams = {
    acronym: MEDIA_LINKS_ACRONYM,
    fields: MEDIA_LINK_FIELDS,
    page: 1,
    pageSize: 100,
    schema: MEDIA_LINK_SCHEMA,
    where: `productRefId='${referenceIds}' AND locale='${selectedLocale}'`
  }

  console.log('locale', locale)

  return canUseDOM ? (
    <div className={styles.mediaLinkContainer}>
      <Query query={DOCUMENTS} variables={queryParams}>
        {({ loading, error, data }: any) => {

          console.log('data', data)
          console.log('error', error)
          if (loading) {
            return <Spinner />
          }
          if (error) {
            return (
              <div>
                {intl.formatMessage({
                  id: 'store/media-links.ProductMediaLinks.graphqlErrorMessage',
                })}
              </div>
            )
          }
          return (
            <div>
              {data &&
                data.getMediaLeadDocuments.map((link: any) => (
                  <MediaLink {...link} productInfo={productInfo} />
                ))}
            </div>
          )
        }}
      </Query>
    </div>
  ) : (
    <div className={styles.mediaLinkContainer} />
  )
}

export default compose(
  withRuntimeContext,
  injectIntl
)(ProductMediaLinks)
