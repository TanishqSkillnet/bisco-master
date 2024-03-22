import React from 'react'
import ContentLoader from 'react-content-loader'

const CategoryNamePlaceholder = () => (
  <ContentLoader
    height={40}
    width="100%"
    style={{
      width: '100%',
    }}
  >
    <rect x="0" y="10" rx="4" ry="4" width="100%" height="30" />
  </ContentLoader>
)

export default CategoryNamePlaceholder
