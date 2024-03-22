import { pathOr } from 'ramda'
import React from 'react'
import { canUseDOM } from 'vtex.render-runtime'
import styles from './inventory.css'
import { useIntl, defineMessages } from 'react-intl'

const INFINITE_INVENTORY_SIZE = 1000000

const messages = defineMessages({
  itemsAvailable: {
    defaultMessage: 'Items Available: ',
    id: 'store/bisco-components.items-available',
  }
})

interface Props {
  sellers: Seller[]
}

const AvailableInventory = (props: Props) => {
  const { sellers } = props
  const intl = useIntl()

  const totalInventory: number = sellers
    .map((seller: Seller) => pathOr(0, ['commertialOffer', 'AvailableQuantity'], seller))
    .reduce((acc, quantity: number) => acc + quantity, 0)

  const finiteInventory: number = totalInventory % INFINITE_INVENTORY_SIZE

  return canUseDOM ? (
    <div className={`${styles.availableInventoryContainer} fl`}>
      { finiteInventory > 0 ? <span>{intl.formatMessage(messages.itemsAvailable)} {finiteInventory}</span>: <span /> }
    </div>
  ) : (
    <div className={`${styles.availableInventoryContainer} fl`} />
  )
}

export default AvailableInventory
