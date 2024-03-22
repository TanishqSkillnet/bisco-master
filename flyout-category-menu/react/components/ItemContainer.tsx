import React from 'react'
import { Link } from 'vtex.render-runtime'
import { Container } from 'vtex.store-components'
import styles from '../flyoutMenu.css'
import categoryMenuPosition from '../utils/categoryMenuPosition'
import { Category } from '../utils/constants'
import classNames from 'classnames'

interface Props {
  categories: Category[]
  parentSlug?: string
  onCloseMenu: () => void
  showSecondLevel?: boolean
  menuPosition: any
  containerStyle: any
  noOfCategoriesVisible: number
  noOfSubcategoriesVisible: number
  parentCategory: Category
}

/**
 * Component responsible dor rendering an array of categories and its respective subcategories
 */
const ItemContainer = ({ containerStyle, categories, noOfCategoriesVisible, menuPosition, onCloseMenu, showSecondLevel, parentSlug, parentCategory, noOfSubcategoriesVisible }: Props) => {
  const renderLinkFirstLevel = (item: Category, showName: boolean = true, parentSlug?: string) => {
    let params: any
    params = {
      department: parentSlug || item.slug,
    }

    const firstLevelLinkClasses = classNames(
      `${
        styles.firstLevelLink
      } db pv4 link no-underline outline-0 tl t-small truncate c-on-base underline-hover`,
      {
        ph2: menuPosition === categoryMenuPosition.DISPLAY_CENTER.value,
        pl2: menuPosition === categoryMenuPosition.DISPLAY_RIGHT.value,
        pr2: menuPosition === categoryMenuPosition.DISPLAY_LEFT.value,
      },
    )

    if (parentSlug) {
      params = {
        department: parentSlug || item.slug,
        // tslint:disable-next-line:object-literal-sort-keys
        category: item.slug,
      }
    }
    return (
      <li className="list pa0">
        <Link
          onClick={onCloseMenu}
          page={parentSlug ? 'store.search#category' : 'store.search#department'}
          className={firstLevelLinkClasses}
          params={params}>
          {showName ? item.name : `See all ${item.name} Products`}
        </Link>
      </li>
    )
  }
  const renderLinkSecondLevel = (item: Category, subItem: Category, parentSlug?: string) => {
    let params: any
    params = {
      department: parentSlug || item.slug,
      // tslint:disable-next-line:object-literal-sort-keys
      category: parentSlug ? item.slug : subItem.slug,
    }

    const secondLevelLinkClasses = classNames(
      `${
        styles.secondLevelLink
      } db pv3 no-underline outline-0 tl link t-small truncate c-muted-1 underline-hover`,
      {
        ph3: menuPosition === categoryMenuPosition.DISPLAY_CENTER.value,
        pl3: menuPosition === categoryMenuPosition.DISPLAY_RIGHT.value,
        pr3: menuPosition === categoryMenuPosition.DISPLAY_LEFT.value,
      },
    )

    if (parentSlug && !subItem.hideName) {
      params = {
        department: parentSlug || item.slug,
        // tslint:disable-next-line:object-literal-sort-keys
        category: parentSlug ? item.slug : subItem.slug,
        subcategory: subItem.slug,
      }
    }
    return (
      <li key={subItem.id} className="list pa0">
        <Link
          onClick={onCloseMenu}
          page={parentSlug && !subItem.hideName ? 'store.search#subcategory' : 'store.search#category'}
          className={secondLevelLinkClasses}
          params={params}>
          {!subItem.hideName ? subItem.name : 'See all'}
        </Link>
      </li>
    )
  }
  const shouldRenderSecondLevel = (category: Category) => (category.children && category.children.length > 0 && showSecondLevel)
  const renderChildren = (category: Category) => {
    const children = [...category.children.slice(0, noOfSubcategoriesVisible), {
      children: [],
      hideName: true,
      id: parentCategory.id,
      name: 'See all',
      slug: parentCategory.slug,
    }]

    return (
      shouldRenderSecondLevel(category) &&
      children
        .map(subCategory => renderLinkSecondLevel(category, subCategory, parentSlug))
    )
  }
  const containerClasses = classNames('w-100 flex flex-wrap pa0 list mw9', {
    'justify-center': menuPosition === categoryMenuPosition.DISPLAY_CENTER.value,
    'justify-end': menuPosition === categoryMenuPosition.DISPLAY_RIGHT.value,
    'justify-start': menuPosition === categoryMenuPosition.DISPLAY_LEFT.value,
  })

  const columnItemClasses = classNames({
    'pl0 pr7': menuPosition === categoryMenuPosition.DISPLAY_LEFT.value,
    'pr0 pl7': menuPosition === categoryMenuPosition.DISPLAY_RIGHT.value,
  })

  return (
    <div
      className={`${styles.itemContainer} absolute w-100 left-0 bg-base pb2 bw1 bt bb b--muted-4`}
      style={containerStyle}>
      <Container className="justify-center w-100 flex">
        <ul className={containerClasses}>
          {categories.slice(0, noOfCategoriesVisible).map(category => (
            <li key={category.id}>
              <ul className={columnItemClasses}>
                {renderLinkFirstLevel(category, true, parentSlug)}
                {renderChildren(category)}
              </ul>
            </li>
          ))}
          <li key={parentCategory.id}>
            <ul className={columnItemClasses}>
              {renderLinkFirstLevel(parentCategory, false)}
            </ul>
          </li>
        </ul>
      </Container>
    </div>
  )
}

export default ItemContainer
