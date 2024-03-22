import { pathOr } from 'ramda'
import React from 'react'
import { ContentWrapper } from 'vtex.my-account-commons'
import OrderDetails from './OrderDetails'

interface Params {
  id: string
}

interface PathParams {
  params: Params
}

interface Props {
  match: PathParams
}

const OrderDetailsWrapper = (props: Props) => {

  const headerConfig = () => {
    return { namespace: 'vtex-account__offline_order', titleId: 'offline.orders.order.title', backButton: { title: 'Return', path: '/offlineorders'} }
  }

  return (
    <ContentWrapper {...headerConfig()}>
      {() => <OrderDetails id={pathOr('', ['match', 'params', 'id'], props)} />}
    </ContentWrapper>
  )
}

export default OrderDetailsWrapper
