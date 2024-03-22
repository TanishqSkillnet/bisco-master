import React from 'react'
import { path } from 'ramda'
import styles from '../brandContent.css'
import Placeholder from './Placeholder'
import { Brand } from '../utils/interfaces'
import { useRuntime } from 'vtex.render-runtime'

const getVTEXImgHost = (account: string) => {
  return `https://${account}.vteximg.com.br`
}

const BrandImage = ({ brand }: { brand: Brand }) => {
  const runtime = useRuntime()
  return (
    <div className="tc">
      {path(['imageUrl'], brand) ? (
        <img
          src={`${getVTEXImgHost(runtime.account)}/arquivos/ids${path(['imageUrl'], brand)}`}
          alt={brand.name}
          className={`${styles.brandImage}`}
        />
      ) : (
        <Placeholder width={200} height={200} title="No preview" />
      )}
    </div>
  )
}

export default BrandImage
