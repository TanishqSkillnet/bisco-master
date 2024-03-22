import React from 'react'
import ContentLoader from 'react-content-loader'

const CategorySelectorPlaceholder = () => (
  <div className="flex flex-row">
    <div className="mw5 pa5">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-testid="image-placeholder"
      >
        <rect width="512" height="512" fill="#F2F2F2" />
        <rect
          x="183.857"
          y="180.2"
          width="144.286"
          height="150.474"
          stroke="#CACBCC"
          strokeWidth="2"
        />
        <path d="M183.78 303.688H328.214" stroke="#CACBCC" strokeWidth="2" />
        <path
          d="M205.082 279.563L223.599 240.507L242.116 260.035L269.892 220.979L306.926 279.563H205.082Z"
          stroke="#CACBCC"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M252.225 213.939C252.225 219.822 247.66 224.52 242.114 224.52C236.569 224.52 232.004 219.822 232.004 213.939C232.004 208.057 236.569 203.359 242.114 203.359C247.66 203.359 252.225 208.057 252.225 213.939Z"
          stroke="#CACBCC"
          strokeWidth="2"
        />
      </svg>
    </div>
    <div className="pa5 w-100">
      <ContentLoader
        height={200}
        width="100%"
        style={{
          width: '100%',
        }}
      >
        <rect x="0" y="10" rx="4" ry="4" width="100%" height="30" />
        <rect x="0" y="50" rx="4" ry="8" width="100%" height="150" />
      </ContentLoader>
    </div>
  </div>
)

export default CategorySelectorPlaceholder
