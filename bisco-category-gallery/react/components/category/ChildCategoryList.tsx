import React from 'react'
import { pathOr, path } from 'ramda'
import { useQuery } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'
import CategoryCardContext from '../../CategoryCardContext'
import CATEGORIES_TREE from '../../queries/categoriesTree.graphql'
import { getChildCategories } from '../../utils/categoryTreeUtils'
import { getCategoryUrl } from '../../utils/urlBuilder'

import './category.css'

const CSS_HANDLES = [
  'childCategoryContainer',
  'childCategoryItem',
  'childCategoryItemName',
]

const ChildCategoryList = () => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  const { rootPath = '' } = useRuntime()

  const { useCategoryState } = CategoryCardContext

  const { category } = useCategoryState()

  const { data: categoryTree } = useQuery(CATEGORIES_TREE, {
    variables: { treeLevel: 3 },
  })

  const departments = pathOr([], ['categories'], categoryTree)
  const childCategories = getChildCategories(
    departments,
    1,
    path(['id'], category)
  )

  return (
    <div
      className={`${cssHandles.childCategoryContainer} flex flex-wrap w-100 mt3`}
    >
      {childCategories.map((c: Category) => {
        return (
          <a
            className={`${cssHandles.childCategoryItem} ma1 pa3 ba b--black-10`}
            href={getCategoryUrl(rootPath, c.href)}
            key={c.id}
          >
            <span className={`${cssHandles.childCategoryItemName}`}>
              {c.name}
            </span>
          </a>
        )
      })}
    </div>
  )
}

export default ChildCategoryList
