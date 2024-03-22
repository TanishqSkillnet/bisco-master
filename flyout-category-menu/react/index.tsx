import React, { useState } from 'react'
import { useLazyQuery } from 'react-apollo'
import { InjectedIntl, injectIntl } from 'react-intl'
import classNames from 'classnames'

import { IconMenu } from 'vtex.store-icons'
import SideBar from './components/SideBar'
import styles from './flyoutMenu.css'
import categoryQuery from './graphql/categoriesTreeQuery.graphql'
import LoaderDesktop from './LoaderDesktop'
import LoaderMobile from './LoaderMobile'
import categoryMenuPosition, {
  getMenuPositionNames,
  getMenuPositionValues,
} from './utils/categoryMenuPosition'
import { Category } from './utils/constants'
import { localeSelector} from './utils/localeSelector'

interface Props {
  intl: InjectedIntl
  /** Whether to show the promotion category or not */
  showPromotionCategory: boolean
  /** Whether to show the gift category or not */
  showGiftCategory: boolean
  /** Categories query data */
  data: {
    loading: boolean
    categoriesTree: Category[]
  }
  /** Set mobile mode */
  mobileMode: boolean
  /** Whether to show the departments category or not */
  showAllDepartments: boolean
  /** Whether to show subcategories or not */
  showSubcategories: boolean
  /** Defines the position of the category menu */
  menuPosition: string
  /** Departments to be shown in the desktop mode. */
  departments: Category[]
  menuVisible: boolean
  runtime: any
  noOfDepartmentsVisible: number
  noOfCategoriesVisible: number
  noOfSubcategoriesVisible: number
}

interface QueryData {
  categoriesTree: Category[]
}

const FlyoutCategoryMenu = ({
                              intl,
                              showSubcategories,
                              showAllDepartments,
                              menuPosition,
                              mobileMode,
                            }: Props) => {

  const [sideBarVisible, setSideBarVisible] = useState(false)

  // const { loading: departmentsLoading, error: departmentsError, data: departmentsData } = useQuery(categoryQuery)

  const userLocale = window.location?.href?.toString().split('/').reverse()[0]

  const [lazyFacetsQuery, { loading: departmentsLoading, error: departmentsError, data: departmentsData }] = useLazyQuery(categoryQuery)

  if (departmentsLoading || departmentsError) {
    return mobileMode ? <LoaderMobile/> : <LoaderDesktop/>
  }

  const getDepartments = (data: QueryData) => {

    if(!data || !data.categoriesTree) {
      return []
    }
    data.categoriesTree.sort((a, b) => a.name.toString().localeCompare(b.name.toString()))

    const departmentsIds = data.categoriesTree.map(dept => dept.id)
    const departmentsSelected = data.categoriesTree.filter((category: Category) =>
      departmentsIds.includes(category.id)
    )

    return (departmentsSelected.length && departmentsSelected) || data.categoriesTree
  }

  const handleSidebarToggle = () => {

    const languageprefix = localeSelector(userLocale)

    lazyFacetsQuery({
      variables: {
        treeLevel: 2,
        locale : languageprefix
      }
    })
    setSideBarVisible(s => !s)
  }

  const renderSideBar = (data: QueryData) => {

    return (
      <div className={`${styles.sidebarContainer} ${styles.mobile}`}>
        <SideBar
          visible={sideBarVisible}
          title={intl.formatMessage({ id: 'category-menu.departments.title' })}
          departments={getDepartments(data)}
          mobileMode={mobileMode}
          onClose={handleSidebarToggle}
          showSubcategories={showSubcategories}
        />
        <div className="flex pa4 pointer" onClick={handleSidebarToggle}>
          <IconMenu size={20}/>
        </div>
      </div>
    )
  }

  const renderMenu = (data: QueryData) => {
    const desktopClasses = classNames(`${styles.container} w-100 bg-base dn flex-m`, {
      'justify-center': menuPosition === categoryMenuPosition.DISPLAY_CENTER.value,
      'justify-end': menuPosition === categoryMenuPosition.DISPLAY_RIGHT.value,
      'justify-start': menuPosition === categoryMenuPosition.DISPLAY_LEFT.value,
    })

    return (
      <nav className={desktopClasses}>
        <section className="ph3 ph5-m ph2-xl mw9 w-100 justify-start flex">
          <ul className="pa0 list ma0 flex flex-wrap flex-row t-action overflow-hidden h3">
            <li>
              {showAllDepartments && (
                <div
                  className={`${styles.sidebarContainer} ${
                    styles.noMobile
                  } flex justify-center items-center`}>
                  <SideBar
                    visible={sideBarVisible}
                    title={intl.formatMessage({ id: 'category-menu.departments.title' })}
                    departments={getDepartments(data)}
                    onClose={handleSidebarToggle}
                    showSubcategories={showSubcategories}
                    mobileMode={mobileMode}
                  />
                  <div
                    className={`${styles.allDepartments} flex justify-center items-center pointer`}
                    onClick={handleSidebarToggle}>
                    <span>{intl.formatMessage({ id: 'category-menu.all-products' })}</span> <IconMenu size={20}/>
                  </div>
                </div>
              )}
            </li>
          </ul>
        </section>
      </nav>
    )
  }

  return mobileMode ? renderSideBar(departmentsData) : renderMenu(departmentsData)
}

FlyoutCategoryMenu.getSchema = () => {
  return {
    description: 'admin/editor.flyout-menu.description',
    properties: {
      menuPosition: {
        default: categoryMenuPosition.DISPLAY_CENTER.value,
        enum: getMenuPositionValues(),
        enumNames: getMenuPositionNames(),
        isLayout: true,
        title: 'admin/editor.flyout-menu.disposition-type.title',
        type: 'string',
      },
      noOfCategoriesVisible: {
        default: 5,
        title: 'admin/editor.flyout-menu.no-of-categories.title',
        type: 'number',
      },
      noOfDepartmentsVisible: {
        default: 4,
        title: 'admin/editor.flyout-menu.no-of-departments.title',
        type: 'number',
      },
      noOfSubcategoriesVisible: {
        default: 5,
        title: 'admin/editor.flyout-menu.no-of-subcategories.title',
        type: 'number',
      },
      showAllDepartments: {
        default: true,
        title: 'admin/editor.flyout-menu.show-departments-category.title',
        type: 'boolean',
      },
      showSubcategories: {
        default: true,
        title: 'admin/editor.flyout-menu.show-subcategories.title',
        type: 'boolean',
      },
    },
    title: 'admin/editor.flyout-menu.title',
    type: 'object',
  }
}

FlyoutCategoryMenu.defaultProps = {
  menuPosition: 'center',
  noOfCategoriesVisible: 5,
  noOfDepartmentsVisible: 4,
  noOfSubcategoriesVisible: 5,
  showAllDepartments: true,
  showSubcategories: true,
}

export default injectIntl(FlyoutCategoryMenu)
