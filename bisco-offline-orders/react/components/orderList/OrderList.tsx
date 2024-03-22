import { pathOr } from 'ramda'
import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { Pagination, Spinner } from 'vtex.styleguide'
import DOCUMENTS_WITH_PAGING from '../../queries/documentsWithPaging.graphql'
import PROFILE from '../../queries/getProfile.graphql'
import { OFFLINE_ORDER_ACRONYM, OFFLINE_ORDER_FIELDS, OFFLINE_ORDER_SCHEMA } from '../../utils/consts'
import { documentSerializer } from '../../utils/DocumentSerializer'
import OrderListItem from './OrderListItem'

const OrderList = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)

  const nextClicked = () => {
    setPage(page + 1)
  }

  const previousClicked = () => {
    setPage(page - 1)
  }

  const pageSizeChanged = ({target}: any) => {
    setPage(1)
    const size = parseInt(target.value)
    setPageSize(size)
  }

  const { data: profileData, loading: loadingProfile, error: errorProfile } = useQuery(PROFILE)
  const email = pathOr('', ['profile', 'email'], profileData)

  const {
    data: dataOfflineOrders,
    loading: offlineOrderLoading,
    error: offlineOrderError,
  } = useQuery(DOCUMENTS_WITH_PAGING, {
    skip: loadingProfile || email === '',
    variables: {
      acronym: OFFLINE_ORDER_ACRONYM,
      fields: OFFLINE_ORDER_FIELDS,
      schema: OFFLINE_ORDER_SCHEMA,
      page,
      pageSize,
      where: `email=${email}`,
    },
  })

  const documents: MDSearchDocumentResult[] = pathOr(
    [],
    ['documentsWithPagination', 'items'],
    dataOfflineOrders
  )
  const paging: MDPaging = pathOr(
    {},
    ['documentsWithPagination', 'pagination'],
    dataOfflineOrders
  ) as MDPaging

  return loadingProfile || offlineOrderLoading ? (
    <Spinner />
  ) : errorProfile ? (
    <div>Error occurred while querying user information</div>
  ) : offlineOrderError ? (
    <div>Error loading offline orders</div>
  ) : (
    <div className="pa5 f6 no-underline db hover-near-black">
      <div>
        {documents &&
          documentSerializer(documents).map((order: any) => <OrderListItem {...order} />)}

        {paging && (
          <Pagination
            rowsOptions={[1, 2, 3, 4, 5, 10, 15, 20]}
            currentItemFrom={paging.from + 1}
            currentItemTo={paging.to}
            textOf="of"
            textShowRows="Show Rows"
            totalItems={paging.total}
            selectedOption={paging.perPage}
            onNextClick={nextClicked}
            onPrevClick={previousClicked}
            onRowsChange={pageSizeChanged}
          />
        )}
      </div>
    </div>
  )
}

export default OrderList
