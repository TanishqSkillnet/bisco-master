import React from 'react'
import { pathOr } from 'ramda'
import { useCssHandles } from 'vtex.css-handles'
import CategoryCardContext from '../../CategoryCardContext'
import { Tooltip } from 'vtex.styleguide'
import CategoryDescriptionPlaceholder from './CategoryDescriptionPlaceholder'

const MAX_SIZE_DESCRIPTION = 120
const CSS_HANDLES = ['descriptionContainer']

const CategoryDescription = () => {
  const cssHandles = useCssHandles(CSS_HANDLES)

  const { useCategoryState } = CategoryCardContext

  const { category, isLoading } = useCategoryState()

  const description = pathOr('', ['description'], category)
  const descriptionTruncated =
    description.length > MAX_SIZE_DESCRIPTION
      ? `${description.substring(0, MAX_SIZE_DESCRIPTION)}...`
      : description

  return category && !isLoading ? (
    description.length > MAX_SIZE_DESCRIPTION ? (
      <Tooltip label={description} position="bottom">
        <div className={`${cssHandles.descriptionContainer}`}>
          {descriptionTruncated && descriptionTruncated !== 'null'
            ? descriptionTruncated
            : ''}
        </div>
      </Tooltip>
    ) : (
      <div className={`${cssHandles.descriptionContainer}`}>{description}</div>
    )
  ) : (
    <div className={`${cssHandles.descriptionContainer}`}>
      <CategoryDescriptionPlaceholder />
    </div>
  )
}

export default CategoryDescription
