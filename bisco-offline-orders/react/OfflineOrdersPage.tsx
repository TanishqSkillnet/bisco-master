import React, { Fragment } from 'react'
import { Route } from 'react-router-dom'

import OrderDetailsWrapper from './components/orderDetails/OrderDetailsWrapper'
import OfflineOrdersPageWrapper from './components/orderList/OfflineOrdersPageWrapper'

const OfflineOrdersPage = () => {
  return (
    <Fragment>
      <Route path="/offlineorders" exact component={OfflineOrdersPageWrapper} />
      <Route path="/offlineorder/:id/order" component={OrderDetailsWrapper}/>
    </Fragment>
  )
}

export default OfflineOrdersPage
