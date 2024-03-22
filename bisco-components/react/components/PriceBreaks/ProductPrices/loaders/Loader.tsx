import React from 'react'
import ContentLoader from 'react-content-loader'

const Loader = () => (
  <ContentLoader
    height={195}
    width={180}
    style={{
      width: '100%'
    }}>
    <rect width="180" height="195" />
  </ContentLoader>
)

export default React.memo(Loader)
