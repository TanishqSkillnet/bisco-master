import React from 'react'
import ContentLoader from 'react-content-loader'
import { useRuntime } from 'vtex.render-runtime'

const Loader = () => {
  const runtime = useRuntime()
  const { hints: { mobile, phone } } = runtime

  return (mobile && phone) ? (
    <ContentLoader
      height={100}
      width={200}
      style={{
        width: '100%',
        height: '100%',
        padding: '0.25rem',
        textAlign: 'center'
      }}>
      <rect x="0" y="10" rx="0" ry="0" width="200" height="50" />
      <rect x="0" y="70" rx="0" ry="0" width="200" height="10" />
      <rect x="0" y="82" rx="0" ry="0" width="200" height="10" />
    </ContentLoader>
  ) : (
    <ContentLoader
      height={50}
      width={200}
      style={{
        width: '100%',
        height: '100%',
        padding: '0.25rem',
      }}>
      <rect x="10" y="10" rx="0" ry="0" width="50" height="50" />
      <rect x="70" y="10" rx="0" ry="0" width="115" height="10" />
      <rect x="70" y="22" rx="0" ry="0" width="115" height="10" />
    </ContentLoader>
  )
}

export default Loader
