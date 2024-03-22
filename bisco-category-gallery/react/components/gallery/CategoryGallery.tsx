import React from 'react'
import { path } from 'ramda'
import { useCssHandles } from 'vtex.css-handles'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import './styles.css'

interface Props {
  cardsPerPage?: number
  categories: Category[]
  treeLevel?: number
}

const CSS_HANDLES = ['categoryGalleryContainer']

const CategoryGallery = ({ categories, cardsPerPage }: Props) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  const { facetsLoading } = useSearchPage()

  return categories && !facetsLoading ? (
    <div
      className={`${cssHandles.categoryGalleryContainer} flex flex-row flex-wrap items-stretch bn ph1 w-100`}
    >
      {categories
        .filter(category => category && category !== null)
        .map(category => {
          const id = path(['id'], category)
          const name = path(['name'], category)
          return (
            <ExtensionPoint
              id="category-card-custom"
              key={`${id}-${name}`}
              category={category}
              cardsPerPage={cardsPerPage}
            />
          )
        })}
    </div>
  ) : (
    <div />
  )
}

export default CategoryGallery
