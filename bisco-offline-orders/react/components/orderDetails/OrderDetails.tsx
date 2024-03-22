import { pathOr, path } from 'ramda'
import React from 'react'
import { useQuery } from 'react-apollo'
// import { IconClose, IconPlus } from 'vtex.store-icons'
import { Spinner, Tag } from 'vtex.styleguide'
import styles from '../../offline-order.css'
import DOCUMENTS from '../../queries/documents.graphql'
import {
  OFFLINE_ORDER_ACRONYM,
  OFFLINE_ORDER_FIELDS,
  OFFLINE_ORDER_ITEM_ACRONYM,
  OFFLINE_ORDER_ITEM_FIELDS,
  OFFLINE_ORDER_ITEM_SCHEMA,
  OFFLINE_ORDER_SCHEMA,
} from '../../utils/consts'
import { documentSerializer } from '../../utils/DocumentSerializer'
import { addressSplitter, costForItems } from '../../utils/orderDetailsUtil'
import OrderDetailListItem from './OrderDetailListItem'

interface Props {
  id: string
}
const OrderDetailsWrapper = ({ id }: Props) => {
  const {
    data: dataOfflineOrders,
    loading: offlineOrderLoading,
    error: offlineOrderError,
  } = useQuery(DOCUMENTS, {
    skip: id === undefined || id === '',
    variables: {
      acronym: OFFLINE_ORDER_ACRONYM,
      fields: OFFLINE_ORDER_FIELDS,
      schema: OFFLINE_ORDER_SCHEMA,
      where: `orderId=${id}`,
    },
  })

  const offlineOrders: OfflineOrder[] = documentSerializer(
    pathOr([], ['documents'], dataOfflineOrders)
  ) as OfflineOrder[]

  const offlineOrder = offlineOrders.length > 0 ? offlineOrders[0] : {}

  const {
    data: offlineOrderItemData,
    loading: offlineOrderItemLoading,
    error: offlineOrderItemError,
  } = useQuery(DOCUMENTS, {
    skip: pathOr('', ['orderId'], offlineOrder) === '',
    variables: {
      acronym: OFFLINE_ORDER_ITEM_ACRONYM,
      fields: OFFLINE_ORDER_ITEM_FIELDS,
      schema: OFFLINE_ORDER_ITEM_SCHEMA,
      where: `orderId=${id}`,
    },
  })

  const offlineOrderItems: OfflineOrderItem[] = documentSerializer(
    pathOr([], ['documents'], offlineOrderItemData)
  ) as OfflineOrderItem[]

  const itemCost = costForItems(offlineOrderItems)
  const shippingCost = 0
  const totalCost = pathOr('', ['totalCost'], offlineOrder) // itemCost + shippingCost

  return offlineOrderLoading || offlineOrderItemLoading ? (
    <Spinner />
  ) : offlineOrderError || offlineOrderItemError ? (
    <div>Error loading offline order</div>
  ) : (
    <div className="flex flex-column f6 no-underline db">
      <div className="flex-row w-100 pa2">
        <div className="fl flex-column w-50 ">
          <span>
            Created on:{' '}
            {pathOr('', ['createdDate'], offlineOrder) !== '' &&
            path(['createdDate'], offlineOrder) !== 'null'
              ? new Date(pathOr('', ['createdDate'], offlineOrder)).toLocaleDateString()
              : ''}
          </span>
          <span className="pl4">
            {pathOr('', ['status'], offlineOrder) !== '' &&
            path(['status'], offlineOrder) !== 'null' &&
            path(['status'], offlineOrder) === 'shipped' ? (
              <Tag type="success" variation="low">
                {pathOr('', ['status'], offlineOrder)}
              </Tag>
            ) : (
              <Tag variation="low">{pathOr('', ['status'], offlineOrder)}</Tag>
            )}
          </span>
        </div>
        {/* <div className="fl flex-column w-20 ">
          <ButtonWithIcon
            icon={
              <span className="pr2 pl2 c-action-primary">
                <IconPlus />
              </span>
            }
            variation="tertiary"
            size="small"
            noUpperCase={true}
            block>
            Order again
          </ButtonWithIcon>
        </div>
        <div className="fl flex-column w-30 ">
          <ButtonWithIcon
            icon={
              <span className="pr2 pl2 red">
                <IconClose />
              </span>
            }
            variation="danger-tertiary"
            size="small"
            noUpperCase={true}
            block>
            Request cancellation
          </ButtonWithIcon>
        </div> */}
      </div>
      <div className="flex-row pt5 pl2 pr2 pb2 w-100">
        <div
          className={`${
            styles.detailSummaryColumn
          } fl flex-column pa2 ba b--black-10 hover-near-black`}>
          <div className="pa2 ">
            <div className="pa3 b ttu tracked">Billing Address</div>
            <div className="flex flex-column pl3 pr3">
              {pathOr('', ['billingAddress'], offlineOrder) !== '' &&
              path(['billingAddress'], offlineOrder) !== 'null'
                ? addressSplitter(pathOr('', ['billingAddress'], offlineOrder)).map(
                    (line: string) => <span className="pa1">{line}</span>
                  )
                : ''}
            </div>
          </div>
        </div>
        <div
          className={`${
            styles.detailSummaryColumn
          } fl flex-column pa2 mr3 ml3 ba b--black-10 hover-near-black`}>
          <div className="pa2 ">
            <div className="pa3 b ttu tracked">Shipping Address</div>
            <div className="flex flex-column pl3 pr3">
              {pathOr('', ['shippingAddress'], offlineOrder) !== '' &&
              path(['shippingAddress'], offlineOrder) !== 'null'
                ? addressSplitter(pathOr('', ['shippingAddress'], offlineOrder)).map(
                    (line: string) => <span className="pa1">{line}</span>
                  )
                : ''}
            </div>
          </div>
        </div>
        <div
          className={`${
            styles.detailSummaryColumn
          } fl flex-column pa2 ba b--black-10 hover-near-black`}>
          <div className="pa2 ">
            <div className="pa3 b ttu tracked">Summary</div>
            <div className="flex flex-column pl3 pr3">
              <div className="flex-row pa2">
                <div className="fl w-60">
                  <span>Cost for items </span>
                </div>
                <div className="fl w-40 tr">
                  <span>${itemCost}</span>
                </div>
              </div>
              <div className="flex-row pa2 bt  b--black-10">
                <div className="fl w-60">
                  <span>Shipping </span>
                </div>
                <div className="fl w-40 tr">
                  <span>${shippingCost}</span>
                </div>
              </div>
              <div className="flex-row pa2 bt  b--black-10">
                <div className="fl w-60">
                  <span>Total </span>
                </div>
                <div className="fl w-40 tr">
                  <span>${totalCost}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-row pt5 pl2 pr2 pb2 w-100">
        <h3 className="">Package</h3>
        <div className="fl flex-column w-50 ">
          <span>
            Delivery within:{' '}
            {pathOr('', ['createdDate'], offlineOrder) !== '' &&
            path(['createdDate'], offlineOrder) !== 'null'
              ? new Date(pathOr('', ['createdDate'], offlineOrder)).toLocaleDateString()
              : ''}
          </span>
          <span className="pl4">
            <Tag variation="low">Express Worldwide Saver</Tag>
          </span>
        </div>
      </div>
      <div className="flex-row pt5 pl2 pr2 pb2 w-100">
        <h3 className="">Products</h3>
        <div>
          {offlineOrderItems.map((order: any) => (
            <OrderDetailListItem {...order} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsWrapper
