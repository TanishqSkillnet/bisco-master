import React, { useEffect, useState } from 'react'
import { pathOr } from 'ramda'
import { useMutation } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import updateVbaseMutation from './graphql/updateVbaseCategoryTree.graphql'

const UpdateVbaseCategoryTree = () => {
  const {
    route: { params },
  } = useRuntime()

  const [isCompleted, setIsCompleted] = useState(false)
  const [updateVbase] = useMutation(updateVbaseMutation)

  const param = pathOr('', ['treeLevel'], params)

  useEffect(() => {
    updateVbase({ variables: { treeLevel: param } }).then(() => {
      setIsCompleted(true)
    })
  }, [param])

  return <div className="mw9 center ma5">{isCompleted? "Successfully updated": "Loading..."}</div>
}

export default UpdateVbaseCategoryTree
