import { compose, contains, flip, map, prop, propOr, reject } from 'ramda'
import React, { useState } from 'react'
import { Query } from 'react-apollo'
import { useProductSummary } from 'vtex.product-summary-context/ProductSummaryContext'
import { Button, Modal, Table } from 'vtex.styleguide'
import productSpecifications from './queries/specifications.graphql'
import styles from './specifications.css'
import { useIntl, defineMessages } from 'react-intl'

interface Props {
  typeSpecifications: String
  specificationScope: String
}

const messages = defineMessages({
  specifications: {
    defaultMessage: 'Specifications',
    id: 'store/bisco-components.specifications',
  },
  error: {
    defaultMessage: 'Error',
    id: 'store/bisco-components.summary-specification.error',
  },
  noSpecificationFound: {
    defaultMessage: 'No Specification Found',
    id: 'store/bisco-components.summary-specification.no-specification',
  },
  specification: {
    defaultMessage: 'Specification',
    id: 'store/bisco-components.specification',
  },
  property: {
    defaultMessage: 'Property',
    id: 'store/bisco-components.property',
  },
},
)

const ProductSummarySpecifications = (props: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const intl = useIntl()

  const highlightsFromSpecifications = (properties: any[]) => {
    const { typeSpecifications } = props

    const specifications = typeSpecifications || ''
    const specificationNames = specifications.trim().split(',')
    const allSpecifications = properties || []
    const highlights = specificationNames.reduce((acc: any, item: String) => {
      const highlight = allSpecifications.filter(
        x => x.name.toLowerCase() === item.trim().toLowerCase()
      )
      return acc.concat(highlight)
    }, [])
    return highlights
  }

  const highlightsFromAllSpecifications = (properties: any[], generalSpecifications: any) => {
    const allSpecifications = properties || []
    const highlights = reject(
      compose(
        flip(contains)(map(x => x.name, generalSpecifications)),
        prop('name')
      ),
      allSpecifications
    )
    return highlights
  }

  const highlights = (properties: any[] = [], generalSpecifications: any) => {
    const { specificationScope } = props

    return specificationScope === 'field'
      ? highlightsFromSpecifications(properties)
      : highlightsFromAllSpecifications(properties, generalSpecifications)
  }

  const openSpecificationModal = (e: any) => {
    e.stopPropagation()
    e.preventDefault()
    setIsModalOpen(true)
  }

  const closeSpecificationModal = (e: any) => {
    e.stopPropagation()
    e.preventDefault()
    setIsModalOpen(false)
  }

  const clickPreventPropagation = (e: any) => {
    e.stopPropagation()
    e.preventDefault()
  }

  // const valuesFromContext = useProductSummary()
  // const itemId = path(['selectedItem'], valuesFromContext)

  // console.log(itemId)

  const { product } = useProductSummary()
  const { specificationScope } = props
  const showAllSpecifications = specificationScope === 'all'

  const defaultSchema = {
    properties: {
      property: {
        title: `${intl.formatMessage(messages.property)}`,
      },
      specifications: {
        title: `${intl.formatMessage(messages.specification)}`,
      },
    },
  }

  return (

    <Query
      query={productSpecifications}
      variables={{ identifier: { field: 'id', value: product.productId } }}
      fetchPolicy="cache-and-network">
      {({ data, loading, error }: any) => {
        if (error) {
          return <p>{intl.formatMessage(messages.error)}</p>
        }

        const listHighlights = highlights(
          data?.product?.properties,
          propOr([], 'generalProperties', product)
        )
        const tableItems = listHighlights.map((highlight: any) => ({
          property: highlight.name,
          specifications: highlight.values.join(', '),
        }))

        const specificationTable =
          tableItems.length > 0 ? (
            <div className={styles.specificationModal}>
              <Table
                schema={defaultSchema}
                items={tableItems}
                density="medium"
                emptyStateLabel={intl.formatMessage(messages.noSpecificationFound)}
              />
            </div>
          ) : (
            <div />
          )

        return !showAllSpecifications ? (
          specificationTable
        ) : (
          <div>
            <span className="mr4 db" onClick={clickPreventPropagation}>
              <Button
                variation="primary"
                size="small"
                disabled={loading || tableItems.length == 0}
                onClick={openSpecificationModal}>
                {intl.formatMessage(messages.specifications)}
              </Button>
            </span>
            <Modal isOpen={isModalOpen} onClose={closeSpecificationModal}>
              {specificationTable}
            </Modal>
          </div>
        )
      }}
    </Query>

  )
}

export default ProductSummarySpecifications
