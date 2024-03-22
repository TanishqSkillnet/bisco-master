import classNames from 'classnames'
import React, { Fragment, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Link, withRuntimeContext } from 'vtex.render-runtime'
import { IconMinus, IconPlus } from 'vtex.store-icons'
import styles from '../flyoutMenu.css'
import { Category, Runtime } from '../utils/constants'

interface Props {
  item: Category
  linkValues: string[]
  onClose: () => void
  runtime: Runtime
  treeLevel: number
  showSubcategories: boolean
  mobileMode: boolean
}

const SideBarItem = ({ item: { children, name }, showSubcategories, onClose, linkValues, runtime, treeLevel, mobileMode }: Props) => {
  const [open, setOpen] = useState(false)

  const showSubCategories = () => (showSubcategories && children && children.length > 0)
  const navigateToPage = () => {
    const [department, category, subcategory] = linkValues
    const params = { department, category: '', subcategory: '' }

    if (category) {
      params.category = category
    }
    if (subcategory) {
      params.subcategory = subcategory
    }

    const page = category
      ? subcategory
        ? 'store.search#subcategory'
        : 'store.search#category'
      : 'store.search#department'

    runtime.navigate({
      fallbackToWindowLocation: false,
      page,
      params,
    })
    onClose()
  }
  const handleItemClick = () => {
    if (showSubCategories()) {
      setOpen(!open)
    } else {
      navigateToPage()
    }
  }
  const handleItemClickForNonMobile = () => {
    if (showSubCategories()) {
      setOpen(!open)
    }
  }
  const handleDepartmentClick = () => {
    const [department] = linkValues
    const params = { department }
    const page = 'store.search#department'
    runtime.navigate({
      fallbackToWindowLocation: false,
      page,
      params,
    })
    onClose()
  }
  const renderCategory = () => {
    const sideBarContainerClasses = classNames(
      styles.sidebarItemContainer,
      'flex justify-between items-center pv3 ph6 pointer list ma0',
    )
    const sideBarItemTitleClasses = classNames('', {
      't-body lh-solid': treeLevel === 1,
    })

    const sideBarSpanClasses = classNames(treeLevel === 1 ? 'c-on-base' : 'c-muted-3')

    if (!mobileMode) {

      const [department, category, subcategory] = linkValues
      const params = { department, category: '', subcategory: '' }

      if (category) {
        params.category = category
      }
      if (subcategory) {
        params.subcategory = subcategory
      }

      const page = category
        ? subcategory
          ? 'store.search#subcategory'
          : 'store.search#category'
        : 'store.search#department'
      return (
        <li className={sideBarContainerClasses} onClick={handleItemClickForNonMobile}>
          <Link
            page={page}
            params={params}
            className={`${sideBarItemTitleClasses} ${styles.sidebarLink}`}>
            {name}
          </Link>
          {showSubCategories() && (
            <span className={sideBarSpanClasses}>
              {open ? <IconMinus size={16}/> : <IconPlus size={16}/>}
            </span>
          )}
        </li>
      )
    }
    return (
      <li className={sideBarContainerClasses} onClick={handleItemClick}>
        <span className={sideBarItemTitleClasses}>{name}</span>
        {showSubCategories() && (
          <span className={sideBarSpanClasses}>
            {open ? <IconMinus size={16}/> : <IconPlus size={16}/>}
          </span>
        )}
      </li>
    )
  }
  const renderChildren = () => (
    showSubCategories() && open && (
      <Fragment>
        {mobileMode && (
          <li
            className="pa5 pointer t-body c-muted-2 ma0 list"
            onClick={handleDepartmentClick}>
            <FormattedMessage id="category-menu.all-category.title">
              {txt => <span className="pl4">{txt}</span>}
            </FormattedMessage>
          </li>
        )}
        {(children.sort((a, b) => a.name.toString().localeCompare(b.name.toString()))).map(child => (
          <li key={child.id} className="list ma0 pa0">
            <SideBarItem
              showSubcategories={showSubcategories}
              item={child}
              linkValues={[...linkValues, child.slug]}
              onClose={onClose}
              treeLevel={treeLevel + 1}
              runtime={runtime}
              mobileMode={mobileMode}
            />
          </li>
        ))}
      </Fragment>
    )
  )
  const sideBarItemClasses = classNames(`${styles.sidebarItem} list pa0 ma0`, {
    'c-muted-2 t-body pl4': treeLevel > 1,
    'c-on-base': treeLevel === 1,
  })

  return (
    <ul className={sideBarItemClasses}>
      {renderCategory()}
      {renderChildren()}
    </ul>
  )
}

SideBarItem.defaultProps = {
  treeLevel: 1,
}

export default withRuntimeContext(SideBarItem)
