import React from 'react'
import { pathOr, lensProp, path, set, propEq, find, last } from 'ramda'
import { useQuery } from 'react-apollo'
import { Dropdown } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'
import CATEGORIES_TREE from '../../queries/categoriesTree.graphql'
import GET_DOCUMENTS from '../../queries/documentsWithPagination.graphql'
import {
  FACET_IMAGE_ACRONYM,
  FACET_IMAGE_FIELDS,
  FACET_IMAGE_SCHEMA,
  FACET_TYPE,
} from '../../utils/constants'
import { documentSerializer } from '../../utils/documentSerializer'
import { getChildCategoriesUnderSameParent } from '../../utils/categoryTreeUtils'
import { getCategoryUrl } from '../../utils/urlBuilder'
import './selector.css'
import CategorySelectorPlaceholder from './CategorySelectorPlaceholder'

const CSS_HANDLES = [
  'categorySelectorContainer',
  'categorySelectorImageContainer',
  'categorySelectionImage',
  'categorySelectorContent',
  'categorySelectorDropDown',
  'categoryDescription',
]
interface Props {
  treeLevel: number
  currentCategory: Category
  defaultImage: string
}

const CategorySelector = ({
  currentCategory,
  defaultImage = '',
  treeLevel = 3,
}: Props) => {
  const cssHandles = useCssHandles(CSS_HANDLES)
  const { rootPath = '/' } = useRuntime()

  const { data: categoryTree, loading: categoryTreeLoading } = useQuery(
    CATEGORIES_TREE,
    { variables: { treeLevel: 3 } }
  )

  const departments = pathOr([], ['categories'], categoryTree)
  const childCategories = getChildCategoriesUnderSameParent(
    departments,
    pathOr('', ['id'], currentCategory),
    treeLevel
  )

  const { data: categoryData, loading: categoryLoading } = useQuery(
    GET_DOCUMENTS,
    {
      skip: !currentCategory || pathOr('', ['id'], currentCategory) === '',
      variables: {
        acronym: FACET_IMAGE_ACRONYM,
        fields: FACET_IMAGE_FIELDS,
        page: 1,
        pageSize: 100,
        schema: FACET_IMAGE_SCHEMA,
        where: `facetId=${pathOr(
          '',
          ['id'],
          currentCategory
        )} AND facetType=${FACET_TYPE}`,
      },
    }
  )

  const searchedCategories = last(
    documentSerializer(
      pathOr([], ['documentsWithPagination', 'items'], categoryData)
    )
  )

  const imageUrlLens = lensProp('imageUrl')
  const imageLabelLens = lensProp('imageLabel')
  const description = lensProp('description')

  const categoryWithImage = set(
    imageUrlLens,
    path(['imageUrl'], searchedCategories),
    set(
      imageLabelLens,
      path(['imageLabel'], searchedCategories),
      set(
        description,
        path(['description'], searchedCategories),
        currentCategory
      )
    )
  )

  const dropDownOptions = childCategories.map((category: Category) => {
    return { value: category.id.toString(), label: category.name }
  })
  // const dropDownOptions = [
  //   {
  //     value: pathOr('', ['id'], categoryWithImage).toString(),
  //     label: pathOr('', ['name'], categoryWithImage),
  //   },
  // ]

  const onSelectionChanged = (e: any) => {
    const categoryId = parseInt(pathOr('0', ['target', 'value'], e))
    const selectedCategory = find(propEq('id', categoryId))(childCategories)

    const path = getCategoryUrl(
      rootPath,
      pathOr('', ['href'], selectedCategory)
    )
    window.location.replace(path)
  }

  return !currentCategory ? (
    <div />
  ) : categoryTreeLoading || categoryLoading ? (
    <CategorySelectorPlaceholder />
  ) : (
    <div className={`${cssHandles.categorySelectorContainer} flex flex-row`}>
      <div
        className={`${cssHandles.categorySelectorImageContainer} pa3 w-25 flex flex-column items-center justify-center`}
      >
        <img
          alt={pathOr('', ['id'], categoryWithImage)}
          src={pathOr(defaultImage, ['imageUrl'], categoryWithImage)}
          className={`${cssHandles.categorySelectionImage} w-100`}
        ></img>
      </div>
      <div
        className={`${cssHandles.categorySelectorContent} flex w-75 flex-column pa3`}
      >
        <div className={`${cssHandles.categorySelectorDropDown}`}>
          <div className="pa5 f3 fw5">
            {// eslint-disable-next-line no-constant-condition
            true ? (
              <div className="b f3">
                {pathOr('', ['name'], categoryWithImage)}
              </div>
            ) : (
              <Dropdown
                variation="inline"
                size="large"
                options={dropDownOptions}
                value={path(['id'], currentCategory)}
                onChange={onSelectionChanged}
              />
            )}
          </div>
        </div>
        <div className={`${cssHandles.categoryDescription}`}>
          {pathOr('', ['description'], categoryWithImage)}
        </div>
      </div>
    </div>
  )
}

export default CategorySelector
