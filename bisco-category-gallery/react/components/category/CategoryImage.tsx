import React from 'react'
import { pathOr } from 'ramda'
import { useCssHandles } from 'vtex.css-handles'
import CategoryCardContext from '../../CategoryCardContext'
import './category.css'
import ImagePlaceholder from './CategoryImagePlaceholder'

const CSS_HANDLES = [
  'categoryImageContainer',
  'categoryImage',
  'imagePlaceholder',
]

interface Props {
  placeholderImage: string
}

const CategoryImage = ({ placeholderImage }: Props) => {
  const cssHandles = useCssHandles(CSS_HANDLES)

  const { useCategoryState } = CategoryCardContext

  const { category, isLoading } = useCategoryState()

  const imageUrl = pathOr('', ['imageUrl'], category)

  return category && !isLoading ? (
    <div className={`${cssHandles.categoryImageContainer} flex items-center`}>
      {imageUrl && imageUrl !== '' ? (
        <img
          className={`${cssHandles.categoryImage} w-100`}
          alt={`actual-${pathOr('image', ['name'], category)}`}
          src={imageUrl}
        />
      ) : placeholderImage && placeholderImage !== '' ? (
        <img
          className={`${cssHandles.categoryImage} w-100`}
          alt={`placeholder-${pathOr('image', ['name'], category)}`}
          src={placeholderImage}
        />
      ) : (
        <ImagePlaceholder cssHandle={cssHandles.imagePlaceholder} />
      )}
    </div>
  ) : (
    <div className={cssHandles.categoryImageContainer}>
      <ImagePlaceholder cssHandle={cssHandles.imagePlaceholder} />
    </div>
  )
}

CategoryImage.schema = {
  title: 'admin/editor.category-gallery.title',
  description: 'admin/editor.category-gallery.description',
  type: 'object',
  properties: {
    placeholderImage: {
      title: 'admin/editor.category-gallery.image-placeholder.title',
      type: 'string',
    },
  },
}

export default CategoryImage
