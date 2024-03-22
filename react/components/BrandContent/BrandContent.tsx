import { VideoSlider } from 'biscoind.video-slider'
import { compose, equals, find, last, pathOr, prop, propEq, propOr } from 'ramda'
import React, { useState , useMemo} from 'react'
import { useQuery } from 'react-apollo'
import { useDevice } from 'vtex.device-detector'
import { Tab, Tabs } from 'vtex.styleguide'
import getDocuments from '../../queries/documents.graphql'
import getBrandList from '../../queries/getBrandList.graphql'
import styles from './brandContent.css'
import BrandImage from './components/BrandImage'
import BrandContentLoader from './components/Loaders/BrandContentLoader'
import ProductCarousel from './components/ProductCarousel'
import {
  Brand,
  BrandProduct,
  MDField,
  Video,
} from './utils/interfaces'
import { useIntl, defineMessages } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

interface Props {
  brandSlug: string
  noOfProducts: number
  autoplay: boolean
  autoplaySpeed: number
  showArrows: boolean
  showDots: boolean
  itemsPerPage: number
  width: number
  gap: string
  maxItems: number
  minItemsPerPage: number
  isMobile: boolean
}

const messages = defineMessages({
  brandListError: {
    defaultMessage: 'Error occurred while fetching the brand list',
    id: 'store/bisco-components.brand-list-error',
  },
  brandContentError: {
    defaultMessage: 'Error occurred while fetching brand data',
    id: 'store/bisco-components.brand-content-error',
  },
  brandContentAbout: {
    defaultMessage: 'About',
    id: 'store/bisco-components.brand-about',
  },
  brandContentVideo: {
    defaultMessage: 'Video',
    id: 'store/bisco-components.brand-video',
  },
  brandContentNewProducts: {
    defaultMessage: 'New Products',
    id: 'store/bisco-components.brand-new-products',
  },
})

const DEFAULT_MAX_ITEMS = 10
const DEFAULT_ITEMS_PER_PAGE = 5
const DEFAULT_MIN_ITEMS_PER_PAGE = 1




const BrandContent = ({
  brandSlug, noOfProducts, autoplay,
  autoplaySpeed,
  gap,
  itemsPerPage,
  showArrows,
  showDots,
  width,
  maxItems,
  minItemsPerPage,
}: Props) => {
  const [currentTab, setCurrentTab] = useState(1)
  const apolloClientOptions = useMemo(() => ({
    fetchPolicy: 'cache-and-network', // Specify the default fetch policy for all queries
  }), []);
  const { isMobile } = useDevice()
  const intl = useIntl()
  const handleTabChange = (tabIndex: number) => {
    setCurrentTab(tabIndex)
  }
  const {
    culture: { language },
  } = useRuntime()
  const { data: brandList, loading: brandListLoading, error: brandListError } = useQuery(getBrandList,apolloClientOptions)
  const brand: Brand | undefined = find(
    compose(
      equals(brandSlug),
      propOr('', 'slug')
    ),
    pathOr([], ['brands'], brandList)
  )
  const { data: brandContents, loading: brandContentsLoading, error: brandContentError } = useQuery(getDocuments, {
    ...apolloClientOptions,
    skip: !brand,
    variables: {
      acronym: 'BrandContent_v2',
      fields: ['brandId', 'description', 'newProducts', 'videos'],
      schema: 'brand-content-schema-v3',
      where: `(brandId=${brand ? brand.id : null}) AND (locale=${language})`,

    },
  })

  if (brandListLoading) {
    return <BrandContentLoader />
  }
  if (brandListError || !pathOr([], ['brands'], brandList)) {
    return <p>{intl.formatMessage(messages.brandListError)}</p>
  }

  if (brand === undefined) {
    return <div />
  }

  if (brandContentsLoading) {
    return <BrandContentLoader />
  }
  if (brandContentError || !brandContents) {
    return <p>{intl.formatMessage(messages.brandContentError)}</p>
  }

  const fields: MDField[] = prop('fields', last((brandContents.documents || []) as any[]))
  if (!fields) {
    return <div />
  }

  const description: string = pathOr('', ['value'], find(
    propEq('key', 'description'),
    fields
  ) as MDField)
  const newProducts: BrandProduct[] = JSON.parse(
    pathOr('[]', ['value'], find(propEq('key', 'newProducts'), fields))
  )
  const videos: Video[] = JSON.parse(
    pathOr('[]', ['value'], find(propEq('key', 'videos'), fields))
  )
  return (
    <section className={`${styles.brandGalleryContainer} pb5 bb b--muted-4`}>
      <div className="mw9 center ph3-ns">
        <div className="cf ph2-ns">
          <div className="fl w-100 pa2">
            <Tabs>
              <Tab label={intl.formatMessage(messages.brandContentAbout)} active={currentTab === 1} onClick={() => handleTabChange(1)}>
                <div className={`${styles.brandGalleryDescription} flex w-100 pa3 pa5-ns`}>
                  <div className="fl w-100 w-30-ns pa2 px-5 py-5">
                    <BrandImage brand={brand} />
                  </div>
                  {description && (
                    <div className="fl w-100 w-70-ns pa2">
                      <h2 className={styles.brandName}>{brand.name}</h2>
                      <p
                        className={`${styles.brandGalleryDescriptionTextContent
                          } lh-copy`}>
                        {description}
                      </p>
                    </div>
                  )}
                </div>
              </Tab>
              {videos.length > 0 ?
                <Tab label={intl.formatMessage(messages.brandContentVideo)} active={currentTab === 2} onClick={() => handleTabChange(2)}>
                  <div className={styles.brandGalleryVideos}>
                    {videos && (
                      <VideoSlider
                        videos={videos.map(video => ({
                          videoTitle: video.title,
                          videoUrl: video.url,
                        }))}
                        videoHeight={380}
                        videoMobileHeight={260}
                      />
                    )}
                  </div>
                </Tab> : <></>}
              {newProducts?.length > 0 ?
                <Tab label={intl.formatMessage(messages.brandContentNewProducts)} active={currentTab === 3} onClick={() => handleTabChange(3)}>
                  <div
                    className={`${styles.brandGalleryProductShelf
                      } flex flex-row flex-wrap items-stretch bn ph1`}>
                    {newProducts && (
                      <ProductCarousel
                        productIds={newProducts.map(product => product.productId)}
                        noOfProducts={noOfProducts}
                        autoplay={autoplay}
                        autoplaySpeed={autoplaySpeed}
                        showArrows={showArrows}
                        showDots={showDots}
                        width={width}
                        itemsPerPage={itemsPerPage}
                        gap={gap}
                        minItemsPerPage={minItemsPerPage}
                        maxItems={maxItems}
                        isMobile={isMobile}
                      />
                    )}
                  </div>
                </Tab> : <></>}
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}

BrandContent.defaultProps = {
  autoplay: false,
  autoplaySpeed: 5,
  brandSlug: '',
  gap: 'ph3',
  isMobile: false,
  itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
  maxItems: DEFAULT_MAX_ITEMS,
  minItemsPerPage: DEFAULT_MIN_ITEMS_PER_PAGE,
  noOfProducts: 1000,
  showArrows: true,
  showDots: false,
  width: 1290,
}

export default BrandContent
