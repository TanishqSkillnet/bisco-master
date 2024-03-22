import React, { Fragment, useEffect } from 'react'

import { Animation } from 'vtex.store-components'
import { IconClose } from 'vtex.store-icons'
import styles from '../flyoutMenu.css'
import { Category } from '../utils/constants'
import SideBarItem from './SideBarItem'
import classNames from 'classnames'

const OPEN_SIDEBAR_CLASS = styles.sidebarOpen

interface Props {
  title: string
  departments: Category[]
  onClose: () => void
  visible: boolean
  showSubcategories: boolean
  mobileMode: boolean
}

const SideBar = ({ onClose, visible, mobileMode, showSubcategories, departments }: Props) => {
  useEffect(() => {
    if (visible) {
      document.body.classList.add(OPEN_SIDEBAR_CLASS)
    } else {
      document.body.classList.remove(OPEN_SIDEBAR_CLASS)
    }
    return () => {
      document.body.classList.remove(OPEN_SIDEBAR_CLASS)
    }
  })
  const scrimClasses = classNames(
    `${styles.sidebarScrim} fixed dim bg-base--inverted top-0 z-1 vw-100 vh-100 o-40`,
    {
      dn: !visible,
    },
  )

  const animClasses = classNames(`fixed top-0 z-max`, {
    'w-30': !mobileMode,
    'w-80': mobileMode,
  })

  return (
    <Fragment>
      <div className={scrimClasses} onClick={onClose}/>
      <Animation
        isActive={visible}
        type="drawerRight"
        className={`${styles.animation} ${animClasses}`}>
        <aside
          className={`${styles.sidebar} w-100 bg-base z-max vh-100 shadow-5 overflow-scroll`}>
          <div
            className={`${styles.sidebarHeader} flex justify-between items-center pa2 pointer`}
            onClick={onClose}>
            {/* <div className="w-25"></div>
              <div className="w-25"></div>
              <div className="w-25"></div> */}
            <IconClose size={24} type="line" activeClassName={`${styles.iconClose}`}/>
          </div>
          <ul className={`${styles.sidebarContent} pb7 list ma0 pa0`}>
            {departments.map(department => (
              <li key={department.id} className="list ma0 pa0">
                <SideBarItem
                  item={department}
                  linkValues={[department.slug]}
                  onClose={onClose}
                  showSubcategories={showSubcategories}
                  mobileMode={mobileMode}
                />
              </li>
            ))}
          </ul>
        </aside>
      </Animation>
    </Fragment>
  )
}

SideBar.defaultProps = {
  departments: [],
  // tslint:disable-next-line:no-empty
  onClose: () => {
  },
  title: 'Departments',
}

export default SideBar
