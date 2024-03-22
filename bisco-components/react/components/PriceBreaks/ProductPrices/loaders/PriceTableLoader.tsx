import React from 'react'
import ContentLoader from 'react-content-loader'

const PriceTableLoader = () => (
  <ContentLoader
    height={235}
    width={200}
    style={{
      width: '100%',
      height: '100%',
      padding: '0.25rem',
    }}>
    <rect x="0" y="0" rx="5" ry="5" width="400" height="235" />
  </ContentLoader>
)


export default PriceTableLoader
