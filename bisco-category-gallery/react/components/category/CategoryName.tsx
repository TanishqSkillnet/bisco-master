import React from 'react'
import { pathOr } from 'ramda'
import { useCssHandles } from 'vtex.css-handles'
import CategoryCardContext from '../../CategoryCardContext'
import CategoryNamePlaceholder from './CategoryNamePlaceholder'

const CSS_HANDLES = ['categoryNameContainer', 'categoryName']

const CategoryName = () => {
  const cssHandles = useCssHandles(CSS_HANDLES)

  const { useCategoryState } = CategoryCardContext

  const { category, isLoading } = useCategoryState()

  return category && !isLoading ? (
    <div className={`${cssHandles.categoryNameContainer}`}>
      <span className={`${cssHandles.categoryName}`}>
        {pathOr('', ['name'], category)}
      </span>
    </div>
  ) : (
    <div className={`${cssHandles.categoryNameContainer}`}>
      <CategoryNamePlaceholder />
    </div>
  )
}

export default CategoryName
