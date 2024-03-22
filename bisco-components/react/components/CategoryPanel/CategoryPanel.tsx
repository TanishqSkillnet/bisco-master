import React, { Component, Fragment } from 'react'
//import classNames from 'classnames'
//import { Link } from 'vtex.render-runtime'
import CategoryGallery from './components/CategoryGallery'
import { Category, CategoryItem, MDSearchResult, FacetImage } from './utils/interfaces'
import styles from './categoryPanel.css'
import { canUseDOM } from 'vtex.render-runtime'
import { withDevice } from 'vtex.device-detector'
import { FACET_IMAGE_ACRONYM, FACET_IMAGE_FIELDS, FACET_IMAGE_SCHEMA } from './utils/constants'
import { Query } from 'react-apollo'
import FACET_IMAGES from '../../queries/documents.graphql'
import Loader from './components/Loader'
import { documentSerializer } from './utils/DocumentSerializer'
import { FormattedMessage } from 'react-intl'

import { path } from 'ramda'

interface Props {
  tree: Category[]
  noOfCategories: number
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

const DEFAULT_MAX_ITEMS = 10
const DEFAULT_ITEMS_PER_PAGE = 5
const DEFAULT_MIN_ITEMS_PER_PAGE = 1

class CategoryPanel extends Component<Props> {
  public perPage: any

  public static defaultProps: Props = {
    tree: [],
    noOfCategories: 100,
    autoplay: false,
    autoplaySpeed: 5,
    showArrows: true,
    showDots: false,
    width: 1290,
    gap: 'ph3',
    maxItems: DEFAULT_MAX_ITEMS,
    minItemsPerPage: DEFAULT_MIN_ITEMS_PER_PAGE,
    itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    isMobile: false,
  }

  renderCategoryShelf(
    category: Category,
    noOfChildren: number,
    autoplay: boolean,
    autoplaySpeed: number,
    showArrows: boolean,
    showDots: boolean,
    facetImages: FacetImage[]
  ) {
    const items: CategoryItem[] = category.children.slice(0, noOfChildren).sort((a,b)=>a.name.localeCompare(b.name)).map(child => ({
      id: child.id,
      name: child.name,
      to: child.link,
      key: `item-${child.id}`,
    }))
   /* const headerClasses = classNames(
      styles.categoryPanelHeaderRow,
      'flex flex-row flex-wrap items-stretch pa3  mh4-ns bb b--muted-4'
    )*/

    const { gap, itemsPerPage, width, maxItems, minItemsPerPage, isMobile } = this.props

    return (

      <Fragment key={`parent-fragment-${category.id}`}>
        {category.name === 'Miscellaneous Products' ? <div></div>:
        <div className={styles.categoryGroup}>

        <div className={styles.categoryPanel}>
          <h4 className={styles.categoryHeader}>{category.name} </h4>
        <CategoryGallery
          items={items}
          parent={category.name}
          noOfCategories={noOfChildren}
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
          facetImages={facetImages}
        />

        {category.children.sort((a,b)=>a.name.localeCompare(b.name)).map(child => {
          if (child.children && child.children.length > 0) {
            return this.renderCategoryShelf(
              child,
              noOfChildren,
              autoplay,
              autoplaySpeed,
              showArrows,
              showDots,
              facetImages
            )
          }
          return
        })}
        </div>
        </div>
        }
      </Fragment>
    )
  }

  render() {
    const { tree, noOfCategories, autoplay, autoplaySpeed, showArrows, showDots } = this.props
    const facetProductParams = {
      acronym: FACET_IMAGE_ACRONYM,
      fields: FACET_IMAGE_FIELDS,
      schema: FACET_IMAGE_SCHEMA,
      page: 1,
      pageSize: 5000,
      where: `facetType=category`,
    }
    return canUseDOM ? (
      <Query query={FACET_IMAGES} variables={facetProductParams}>
        {({ loading, error, data }: MDSearchResult) => {
          if (loading) return <Loader />

          if (error) {
            return <div> <FormattedMessage id='store/bisco-components.category-gallery-images-error' defaultMessage='Failed to category images'/></div>
          }

          const facetImages: FacetImage[] = documentSerializer(path(['documents'], data))

          return (
            <div className={`${styles.categoryPanelContainer}`}>
              {tree.sort((a,b)=>a.name.localeCompare(b.name)).map(category => {
                return this.renderCategoryShelf(
                  category,
                  noOfCategories,
                  autoplay,
                  autoplaySpeed,
                  showArrows,
                  showDots,
                  facetImages
                )
              })}
            </div>
          )
        }}
      </Query>
    ) : (
      <span></span>
    )
  }
}

export default withDevice(CategoryPanel)
