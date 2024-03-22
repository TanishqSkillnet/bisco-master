import { pathOr } from 'ramda'
import React from 'react'
import { useQuery } from 'react-apollo'
import { Spinner } from 'vtex.styleguide'
import styles from '../../offline-order.css'
import PRODUCT_BY_REFID from '../../queries/productByRefId.graphql'
import { getItemInfo } from '../../utils/ProductSerializer'
import { NO_IMAGE } from '../../utils/consts'

interface Props {
  itemNo: string
  refId: string
  deliveryDate: string
  orderId: string
  quantity: string
  cost: string
}

const OrderDetailListItem = ({ itemNo, deliveryDate, quantity, cost }: Props) => {
  const { data, loading, error } = useQuery(PRODUCT_BY_REFID, {
    variables: {
      identifier: {
        field: 'reference',
        value: itemNo,
      },
    },
  })

  const productInfo = getItemInfo(pathOr({}, ['product'], data), itemNo)

  return (
    <div className={`${styles.listItemBlock} flex-row w-100`}>
      <div className="fl w-30 pt6 pb6 pl6 pr7">
        {loading ? (
          <Spinner />
        ) : error ? (
          <img src={NO_IMAGE} />
        ) : (
          <img src={pathOr('', ['imageUrl'], productInfo)} />
        )}
      </div>
      <div className="fl w-60 pa6">
        <div className="pa2 c-action-primary b f5">
          <span>{itemNo}</span>
        </div>
        <div className={`${styles.deliveryDate} pa2 f10`}>
          <span>Delivery within:</span>
          <span>
            {deliveryDate && deliveryDate !== 'null'
              ? new Date(deliveryDate).toLocaleDateString()
              : ''}
          </span>
        </div>
        <div className="flex-column pt5">
          <div className="pa2">
            <span> Quantity: </span>
            <span className="b">{quantity && quantity != 'null' ? quantity : ''}</span>
          </div>
          <div className="pa2">
            <span> Unite Price: </span>
            <span className="b">${cost && cost != 'null' ? cost : ''}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailListItem
