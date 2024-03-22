import React from 'react'
import ContentLoader from 'react-content-loader'

const Loader = () => (
  <ContentLoader
    height={246}
    width={180}
    style={{
      width: '100%',
      height: '100%',
      padding: '0.25rem'
    }}>
    <rect width="180" height="246" />
  </ContentLoader>
)

export default Loader
