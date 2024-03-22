import React from 'react'
import ContentLoader from 'react-content-loader'
import style from './flyoutMenu.css'

const LoaderDesktop = () => (
  <ContentLoader
    height={64}
    width={186}
    style={{
      width: '100%',
    }}
    className={style.flyoutMenuContentLoader}>

    <rect x="2" y="22" width="140" height="24" />
    <rect x="150" y="23" rx="2" ry="2" width="22" height="4" />
    <rect x="150" y="32" rx="2" ry="2" width="22" height="4" />
    <rect x="150" y="41" rx="2" ry="2" width="22" height="4" />
  </ContentLoader>
)

export default LoaderDesktop
