import React, { useState } from 'react'
import { Link } from 'vtex.render-runtime'
import flyoutMenu from '../flyoutMenu.css'
import categoryMenuPosition from '../utils/categoryMenuPosition'
import { Category } from '../utils/constants'
import ItemContainer from './ItemContainer'
import classNames from 'classnames'

enum TreeLevel {
  Department = 0,
  Category,
  Subcategory,
}

interface Props {
  /** Category to be displayed */
  category: Category
  /** Set use of Link component */
  noRedirect?: boolean
  /** Number of subcategory levels */
  subcategoryLevels?: TreeLevel
  /** Defines the position of the category menu */
  menuPosition: any
  /** Menu category selection */
  isCategorySelected?: boolean
  noOfCategoriesVisible: number
  noOfSubcategoriesVisible: number
}

/**
 * Component that represents a single category displayed in the menu, also displays
 * the subcategories, if the provided category has them
 */
const CategoryItem = ({ noRedirect, isCategorySelected, menuPosition, category, subcategoryLevels, noOfCategoriesVisible, noOfSubcategoriesVisible }: Props) => {
  let item: HTMLLIElement | null = null
  const [isOnHover, setIsOnHover] = useState(false)
  const handleCloseMenu = () => setIsOnHover(false)
  const renderCategory = () => {
    const categoryClasses = classNames(
      'w-100 pv5 no-underline t-small outline-0 db tc link truncate bb bw1 c-muted-1',
      {
        'b--action-primary pointer': isOnHover || isCategorySelected,
        'b--transparent': !isOnHover && !isCategorySelected,
        mh6: menuPosition === categoryMenuPosition.DISPLAY_CENTER.value,
        ml8: menuPosition === categoryMenuPosition.DISPLAY_RIGHT.value,
        mr8: menuPosition === categoryMenuPosition.DISPLAY_LEFT.value,
      },
      flyoutMenu.departmentLink,
    )

    return noRedirect ? (
      <span className={categoryClasses}>{category.name}</span>
    ) : (
      <Link
        onClick={handleCloseMenu}
        page="store.search#department"
        params={{ department: category.slug }}
        className={categoryClasses}>
        {category.name}
      </Link>
    )
  }
  const renderChildren = () => {
    const containerStyle = {
      top: item && item.offsetTop + item.clientHeight,
    }

    return (
      subcategoryLevels &&
      subcategoryLevels > 0 &&
      category.children.length > 0 && (
        <ItemContainer
          menuPosition={menuPosition}
          containerStyle={containerStyle}
          categories={category.children}
          parentSlug={category.slug}
          onCloseMenu={handleCloseMenu}
          showSecondLevel={subcategoryLevels === 2}
          noOfCategoriesVisible={noOfCategoriesVisible}
          noOfSubcategoriesVisible={noOfSubcategoriesVisible}
          parentCategory={category}
        />
      )
    )
  }
  return (
    <li
      className={`${flyoutMenu.itemContainer} flex items-center db list`}
      ref={e => {
        item = e
      }}
      onMouseEnter={() => setIsOnHover(true)}
      onMouseLeave={handleCloseMenu}>
      {renderCategory()}
      {renderChildren()}
    </li>
  )
}

export default CategoryItem
