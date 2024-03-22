import React from 'react'
import ContentLoader from 'react-content-loader'

const CategoryDescriptionPlaceholder = () => (
  <ContentLoader
    height={70}
    width="100%"
    style={{
      width: '100%',
    }}
  >
    <rect x="0" y="10" rx="4" ry="4" width="100%" height="20" />
    <rect x="0" y="40" rx="3" ry="3" width="100%" height="20" />
  </ContentLoader>
)

export default CategoryDescriptionPlaceholder
