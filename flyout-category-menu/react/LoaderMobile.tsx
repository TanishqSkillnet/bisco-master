import React from 'react'
import ContentLoader from 'react-content-loader'
import style from './flyoutMenu.css'

const LoaderMobile = () => (
  <ContentLoader
    height={64}
    width={50}
    style={{
      width: '100%',
    }}
    className={style.flyoutMenuContentLoaderMobile}>

    <rect x="8" y="23" rx="2" ry="2" width="22" height="4" />
    <rect x="8" y="32" rx="2" ry="2" width="22" height="4" />
    <rect x="8" y="41" rx="2" ry="2" width="22" height="4" />
  </ContentLoader>
)

export default LoaderMobile
