import { path, range, values } from 'ramda'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { canUseDOM } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'
import FACET_PRODUCTS from '../../queries/documents.graphql'
import PRODUCT_IMAGE from './queries/ProductCategoryImages.graphql'
import categoriesHighlights from './categoriesHighlights.css'
import CategoryCard from './components/CategoryCard'
import {
  FACET_IMAGE_ACRONYM,
  FACET_PRODUCT_FIELDS,
  FACET_PRODUCT_SCHEMA,
  ITEMS_PER_ROW,
  RECTANGULAR,
  SQUARED,
} from './utils/constants'
import { documentSerializer } from './utils/DocumentSerializer'
import { MDSearchResult, ProductResult } from './utils/interfaces'
import { getItemInfo } from './utils/ProductSerializer'
import { FormattedMessage } from 'react-intl'

enum Shape {
  RECTANGULAR = 'rectangular',
  SQUARED = 'squared',
}

interface Props {
  categoriesHighlighted: any
  showCategoriesHighlighted?: boolean
  quantityOfItems: number
  cardShape: Shape
  fillRowWithEmptyCards?: boolean
}

class CategoriesHighlights extends Component<Props> {

  public static defaultProps = {
    cardShape: Shape.RECTANGULAR,
  }

  public static getSchema = ({ quantityOfItems }: { quantityOfItems: number }) => {
    return {
      description: 'editor.categoriesHighlighted.description',
      properties: {
        cardShape: {
          default: SQUARED,
          enum: [SQUARED, RECTANGULAR],
          enumNames: [
            'editor.categoriesHighlighted.cardShape.squared',
            'editor.categoriesHighlighted.cardShape.rectangular',
          ],
          isLayout: true,
          title: 'editor.categoriesHighlighted.cardShape',
          type: 'string',
          widget: {
            'ui:options': {
              inline: true,
            },
            'ui:widget': 'radio',
          },
        },
        categoriesHighlighted: {
          items: {
            properties: {
              image: {
                default: '',
                isLayout: false,
                title: 'editor.categoriesHighlighted.item.categoryImage',
                type: 'string',
                widget: {
                  'ui:widget': 'image-uploader',
                },
              },
              name: {
                default: '',
                isLayout: false,
                title: 'editor.categoriesHighlighted.item.categoryName',
                type: 'string',
              },
              to: {
                default: '#',
                isLayout: false,
                title: 'editor.categoriesHighlighted.item.categoryLink',
                type: 'string',
              },
            },
            title: 'editor.categoriesHighlighted.categoriesHighlighted',
            type: 'object',
          },
          maxItems: quantityOfItems,
          minItems: 1,
          title: 'editor.categoriesHighlighted.categoriesHighlighted',
          type: 'array',
        },
        fillRowWithEmptyCards: {
          default: true,
          isLayout: false,
          title: 'editor.categoriesHighlighted.fillRowWithEmptyCards',
          type: 'boolean',
        },
        quantityOfItems: {
          default: 2,
          enum: [2, 4, 6, 8],
          isLayout: true,
          title: 'editor.categoriesHighlighted.quantityOfItems',
          type: 'number',
          widget: {
            'ui:options': {
              inline: true,
            },
            'ui:widget': 'radio',
          },
        },
        showCategoriesHighlighted: {
          default: false,
          isLayout: false,
          title: 'editor.categoriesHighlighted.showCategoriesHighlighted',
          type: 'boolean',
        },
      },
      title: 'editor.categoriesHighlighted.title',
      type: 'object',
    }
  }

  public getCardWithImages(category: any, cardShape: Shape, key: number) {

    if(!category || !category.id) {
      return <div />
    }

    const facetProductParams = {
      acronym: FACET_IMAGE_ACRONYM,
      fields: FACET_PRODUCT_FIELDS,
      page: 1,
      pageSize: 1,
      schema: FACET_PRODUCT_SCHEMA,
      where: `facetId=${category.id} AND facetType=category`,
    }

    return (
      <Query query={FACET_PRODUCTS} variables={facetProductParams}>
        {({ loading, error, data }: MDSearchResult) => {
          if (loading) { return <Spinner /> }
          if (error) { return <div> <FormattedMessage id= 'store/bisco-components.category-gallery-category-error' defaultMessage='Failed to load category'/></div> }

          const refId = path([0, 'refId'], documentSerializer(path(['documents'], data)))
          const queryParams = {
            identifier: {
              field: 'reference',
              value: refId,
            },
          }

          return refId? (
              <Query query={PRODUCT_IMAGE} variables={queryParams}>
                {({ loading, error, data }: ProductResult) => {
                  if (loading) { return <Spinner /> }
                  if (error) { return <div><FormattedMessage id= 'store/bisco-components.category-gallery-image-error' defaultMessage='Failed to load category image'/></div> }
                  const productInfo = getItemInfo(
                    path(['product'], data),
                    refId ? (refId as string) : ''
                  )
                  category.image =
                    productInfo && productInfo.imageUrl ? productInfo.imageUrl : ''
                  return this.showCategoryCard(category, cardShape, key)
                }}
              </Query>
            ): this.showCategoryCard(category, cardShape, key)
        }}
      </Query>
    )
  }

  public showCategoryCard(category: any, cardShape: string, key: number){
    return (
      <CategoryCard
        key={key}
        shape={cardShape}
        {...category}
      />
    )
  }

  public render() {
    const {
      categoriesHighlighted,
      showCategoriesHighlighted,
      quantityOfItems,
      cardShape,
      fillRowWithEmptyCards,
    } = this.props

    if (!showCategoriesHighlighted) {
      return null
    }

    const categories = values(categoriesHighlighted).map((category: any) => category)
    if (fillRowWithEmptyCards) {
      range(categories.length, quantityOfItems).forEach(() => {
        categories.push({
          image: '',
          name: '',
        })
      })
    }

    return canUseDOM? (
      <div className={`${categoriesHighlights[`${cardShape}CategoriesHighlights`]} relative`}>
        <div className="flex flex-row flex-wrap items-center justify-center">
          {range(0, quantityOfItems / ITEMS_PER_ROW).map((indexRow: number) => (
            <div
              key={`row${indexRow}`}
              className={`flex flex-row flex-wrap items-center justify-center ${
                categoriesHighlights.rowBlock
              }`}>
              {range(0, ITEMS_PER_ROW).map(
                (indexCol: number) =>{

                  const category = categories[2 * indexRow + indexCol]

                  return category && category.image ?
                  this.showCategoryCard(category, cardShape, (2 * indexRow + indexCol))
                  : this.getCardWithImages(category, cardShape, (2 * indexRow + indexCol))
                }
              )}
            </div>
          ))}
        </div>
      </div>
    ): <div className={`${categoriesHighlights[`${cardShape}CategoriesHighlights`]} relative`}/>
  }
}

export default CategoriesHighlights
