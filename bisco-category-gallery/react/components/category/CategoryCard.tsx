import React, { ReactChildren, ReactChild } from 'react'
import { pathOr, path, set, lensProp, last } from 'ramda'
import { useQuery } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'

import GET_DOCUMENTS from '../../queries/documentsWithPagination.graphql'

import CategoryCardContext from '../../CategoryCardContext'
import {
  FACET_IMAGE_ACRONYM,
  FACET_IMAGE_FIELDS,
  FACET_IMAGE_SCHEMA,
  FACET_TYPE,
} from '../../utils/constants'
import { documentSerializer } from '../../utils/documentSerializer'
import { getCategoryUrl } from '../../utils/urlBuilder'

import './category.css'

const CSS_HANDLES = ['cardContainer', 'cardLink', 'cardNotClickable']

interface Props {
  isClickable: boolean
  cardsPerPage: number
  category: Category
  children: ReactChildren | ReactChild
}

const CategoryCard = ({
  children,
  category,
  // cardsPerPage = 4,
  isClickable = true,
}: Props) => {
  const { rootPath = '' } = useRuntime()
  const cssHandles = useCssHandles(CSS_HANDLES)
  const { CategoryProvider } = CategoryCardContext

  const { data: categoryData, loading: categoryImageLoading } = useQuery(
    GET_DOCUMENTS,
    {
      skip: !category || !category.id,
      variables: {
        acronym: FACET_IMAGE_ACRONYM,
        fields: FACET_IMAGE_FIELDS,
        page: 1,
        pageSize: 100,
        schema: FACET_IMAGE_SCHEMA,
        where: `facetId=${category.id} AND facetType=${FACET_TYPE}`,
      },
    }
  )
  const categoryImage = last(
    documentSerializer(
      pathOr([], ['documentsWithPagination', 'items'], categoryData)
    )
  )

  const imageUrlLens = lensProp('imageUrl')

  const categoryWithImage = set(
    imageUrlLens,
    path(['url'], categoryImage),
    category
  )

  // const width = { width: `${100 / cardsPerPage}%` }

  const modifiedUrl = getCategoryUrl(
    rootPath,
    pathOr('', ['href'], categoryWithImage)
  )

  const cardCss = `${
    cssHandles.cardLink
  } h-100 flex flex-column no-underline color-inherit ${
    isClickable ? '' : cssHandles.cardNotClickable
  }`

  return (
    <CategoryProvider
      category={categoryWithImage}
      isLoading={categoryImageLoading}
    >
      <div
        className={`${
          cssHandles.cardContainer
        } w-25 ma4 flex flex-column items-center ${
          isClickable ? '' : 'inactiveLink '
        }`}
        // style={width}
      >
        <a
          className={cardCss}
          href={isClickable ? modifiedUrl : 'javascript:void(0)'}
        >
          {children}
        </a>
      </div>
    </CategoryProvider>
  )
}

CategoryCard.schema = {
  title: 'admin/category-gallery.category-card.title',
  description: 'admin/category-gallery.category-card.description',
  type: 'object',
  properties: {
    isClickable: {
      type: 'boolean',
      title: 'admin/category-gallery.category-card.isClickable.title',
      default: true,
    },
  },
}

export default CategoryCard
