import React from 'react'
import ContentLoader from 'react-content-loader'

const Loader = () => (
  <ContentLoader
    height={18}
    width={180}
    style={{
      width: '100%',
    }}>
    <rect width="180" height="18" />
  </ContentLoader>
)

export default Loader
