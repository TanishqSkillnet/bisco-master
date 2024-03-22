import React from 'react'
import { Query } from 'react-apollo'
import { path, pathOr } from 'ramda'
import { Link } from 'vtex.render-runtime'
import { NormalizedProduct, Product, ProductResult, Sku } from '../utils/interfaces'
import product from '../queries/ProductInfoBrandContent.graphql'
import styles from '../brandContent.css'
import classNames from 'classnames'
import ProductSliderItemLoader from './Loaders/ProductSliderItemLoader'

interface Props {
  productId: string
}

const DEFAULT_WIDTH = 'auto'
const DEFAULT_HEIGHT = 'auto'
const MAX_WIDTH = 3000
const MAX_HEIGHT = 4000

const baseUrlRegex = new RegExp(/.+ids\/(\d+)/)

const httpRegex = new RegExp(/http:\/\//)

const findAvailableProduct = (item: Sku) =>
  item.sellers.find(
    ({ commertialOffer = { AvailableQuantity: 0 } }) => commertialOffer.AvailableQuantity > 0
  )

const toHttps = (url: string) => {
  return url.replace(httpRegex, 'https://')
}

const cleanImageUrl = (imageUrl: string) => {
  const result = baseUrlRegex.exec(imageUrl)
  if (result && result.length > 0) {
    return result[0]
  }
  return null
}

function replaceLegacyFileManagerUrl(
  imageUrl: string,
  width: string | number,
  height: string | number
) {
  const legacyUrlPattern = '/arquivos/ids/'
  const isLegacyUrl = imageUrl.includes(legacyUrlPattern)
  if (!isLegacyUrl) return imageUrl
  return `${cleanImageUrl(imageUrl)}-${width}-${height}`
}

const changeImageUrlSize = (
  imageUrl: string,
  width: string | number = DEFAULT_WIDTH,
  height: string | number = DEFAULT_HEIGHT
) => {
  if (!imageUrl) return
  typeof width === 'number' && (width = Math.min(width, MAX_WIDTH))
  typeof height === 'number' && (height = Math.min(height, MAX_HEIGHT))

  const normalizedImageUrl = replaceLegacyFileManagerUrl(imageUrl, width, height)
  const queryStringSeparator = normalizedImageUrl.includes('?') ? '&' : '?'

  return `${normalizedImageUrl}${queryStringSeparator}width=${width}&height=${height}&aspect=true`
}

const normalizeProduct = (product: Product) => {
  if (!product) return null
  const items = product.items || []
  const sku = items.find(findAvailableProduct) || items[0]
  if (sku) {
    const [seller = { commertialOffer: { Price: 0, ListPrice: 0, AvailableQuantity: 0 } }] =
      path(['sellers'], sku) || []
    const [referenceId = { Value: '' }] = path(['referenceId'], sku) || []
    const [image = { imageUrl: '' }] = pathOr([], ['images'], sku)
    const resizedImage = changeImageUrlSize(toHttps(image.imageUrl), 500)
    const normalizedImage = { ...image, imageUrl: resizedImage }
    const normalizedProduct: NormalizedProduct = {
      ...product,
      sku: {
        ...sku,
        seller,
        referenceId,
        image: normalizedImage,
      },
    }
    return normalizedProduct
  }
  return null
}

/**
 * Normalizes the item received in the props to adapt to the extension point prop.
 */
const ProductSliderItem = ({ productId }: Props) => {
  const containerClasses = classNames(
    styles.productCardContainer,
    'overflow-hidden br3 h-100 w-100 flex flex-column justify-between center tc'
  )
  const elementClasses = classNames(`${styles.element} pointer pt3 pb4 flex flex-column h-100`)
  const imageOuterContainerClasses = classNames(styles.imageOuterContainer, 'db w-100 center')
  const imageInnerContainerClasses = classNames(styles.imageInnerContainer, 'dib h-100 relative')
  const imageClasses = classNames(styles.productImage, 'h-100')
  const infoContainerClasses = classNames(
    styles.infoContainer,
    'flex flex-column justify-between'
  )
  const nameContainerClasses = classNames(styles.nameContainer, 'flex items-start justify-center')
  const nameHeadingClasses = classNames(styles.nameHeading, 'mv0 overflow-hidden c-on-base')
  const nameClasses = classNames(styles.nameSpan, 't-body')

  return (
    <Query
      query={product}
      variables={{ identifier: { field: 'id', value: productId } }}
      errorPolicy="all">
      {({ data, loading, error }: ProductResult) => {
        if (loading) {
          return <ProductSliderItemLoader />
        }
        if (error) {
          return (
            <pre>
              Bad:{' '}
              {error.graphQLErrors.map(({ message }, i) => (
                <span key={i}>{message}</span>
              ))}
            </pre>
          )
        }

        const product = normalizeProduct(data.product)

        if (!product) {
          return <div />
        }
        return (
          <section className={containerClasses}>
            <Link
              className={`${styles.clearLink} h-100 flex flex-column`}
              page={'store.product'}
              params={{
                slug: product && product.linkText,
                id: product && product.productId,
              }}>
              <div className={elementClasses}>
                <div className={imageOuterContainerClasses}>
                  <div className={imageInnerContainerClasses}>
                    <img
                      className={imageClasses}
                      src={product.sku.image.imageUrl}
                      alt={product.productName}
                    />
                  </div>
                </div>
                <div className={infoContainerClasses}>
                  <div className={nameContainerClasses}>
                    <h2 className={nameHeadingClasses}>
                      <span className={nameClasses}>{product.productName}</span>
                    </h2>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )
      }}
    </Query>
  )
}

export default ProductSliderItem
