import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { Button, Collapsible, Spinner, Tag } from 'vtex.styleguide'
import styles from '../../offline-order.css'

// import { IconClose, IconPlus } from 'vtex.store-icons'
import DOCUMENTS from '../../queries/documents.graphql'
import {
  OFFLINE_ORDER_ITEM_ACRONYM,
  OFFLINE_ORDER_ITEM_FIELDS,
  OFFLINE_ORDER_ITEM_SCHEMA,
} from '../../utils/consts'
import { documentSerializer } from '../../utils/DocumentSerializer'
import OrderItem from './OrderItem'

const OrderListItem = ({ orderId, status, createdDate, totalCost }: OfflineOrder) => {
  const [isOpen, setIsOpen] = useState(false)

  const orderContent = () => {
    return (
      <div className="flex center ph3-ns pa2">
        <div className="flex-row w-100  cf ph2-ns">
          <div className="fl w-30 pa2">
            <div className="pt2 ttu">
              <span>Order Date</span>
            </div>
            <div className="pt3">
              <span>
                {createdDate && createdDate !== 'null'
                  ? new Date(createdDate).toLocaleDateString()
                  : ''}
              </span>
            </div>
          </div>
          <div className="fl w-40 pa2">
            <div className="pt2 ttu">
              <span>Total</span>
            </div>
            <div className="pt3">
              <span>${totalCost}</span>
            </div>
          </div>
          <div className="fl w-30 pa2">
            <div className="pt2">
              <span>{orderId}</span>
            </div>
            <div className="pt3">
              <span>
                {status === 'shipped' ? (
                  <Tag type="success" variation="low">
                    {status}
                  </Tag>
                ) : (
                  <Tag variation="low">
                    {status}
                  </Tag>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { data, loading, error } = useQuery(DOCUMENTS, {
    variables: {
      acronym: OFFLINE_ORDER_ITEM_ACRONYM,
      fields: OFFLINE_ORDER_ITEM_FIELDS,
      schema: OFFLINE_ORDER_ITEM_SCHEMA,
      where: `orderId=${orderId}`,
    },
  })

  const toggleOpen = (e: any) => {
    setIsOpen(e.target.isOpen)
  }
  return (
    <div className={`${styles.collapsibleWrapper} bg-muted-5 ma3 ba b--black-10`}>
      <Collapsible
        header={orderContent()}
        onClick={toggleOpen}
        isOpen={isOpen}
        align="right"
        caretColor="muted">
        {loading ? (
          <Spinner />
        ) : error ? (
          <div>Error loading data</div>
        ) : data && data.documents ? (
          <div className="center bg-white bt b--black-10 pt3">
            <div className="flex cf ph2-ns">
              <div className="flex-column fl w-70">
                {documentSerializer(data.documents).map((order: any) => (
                  <OrderItem {...order} />
                ))}
              </div>
              <div className="flex-column fl w-30">
                <div className="pt5 pb5 pr3">
                  {/* <div className="pa2 w-100">
                    <span className="" />
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
                  <div className="pa2 w-100">
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
                  <div className="pa2 w-100">
                    <Button
                      variation="tertiary"
                      size="small"
                      href={`/account#/offlineorder/${orderId}/order`}
                      noUpperCase={true}
                      block>
                      View order details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div />
        )}
      </Collapsible>
    </div>
  )
}

export default OrderListItem
