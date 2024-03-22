import React from 'react'
import { ContentWrapper } from 'vtex.my-account-commons'
import OrderList from './OrderList'

const OfflineOrdersPageWrapper = () => {

  const headerConfig = () => {
    return { namespace: 'vtex-account__offline_orders', titleId: 'offline.orders.title' }
  }

  return <ContentWrapper {...headerConfig()}>{() => <OrderList />}</ContentWrapper>
}

export default OfflineOrdersPageWrapper
