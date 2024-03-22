import { range, values } from 'ramda'
import React, { Component } from 'react'
import {
  NUMBER_OF_SUPPLIER_CHAIN_SERVICES,
  MAX_NUMBER_OF_SUPPLIER_CHAIN_DETAIL_LISTING,
} from './constants'
import SupplierChainService from './SupplierChainService'
import supplierChain from './supplyChainServices.css'

interface Props {
  pageTitle?: string
  pageTitleDescription?: string
  supplierChainServices?: any
  numberOfSupplierChainServices: number
  maxNumberOfDetailListing: number
}

/**
 * Supply chain services are responsible for displaying static content given by `/admin/storefront` about value added services
 */
class SupplyChainServices extends Component<Props> {
  public static defaultProps = {
    supplierChainServices: {},
    numberOfSupplierChainServices: NUMBER_OF_SUPPLIER_CHAIN_SERVICES,
    maxNumberOfDetailListing: MAX_NUMBER_OF_SUPPLIER_CHAIN_DETAIL_LISTING,
  }

  public static uiSchema = {
    supplierChainServices: {
      items: {
        image: {
          'ui:widget': 'image-uploader',
        },
      },
    },
  }

  public static getSchema = ({
    numberOfSupplierChainServices,
    maxNumberOfDetailListing,
  }: {
    numberOfSupplierChainServices: number
    maxNumberOfDetailListing: number
  }) => {
    let supplierChainServicesProps: any = {}
    let supplierChainList: any = {}

    range(0, maxNumberOfDetailListing || MAX_NUMBER_OF_SUPPLIER_CHAIN_DETAIL_LISTING).forEach(
      (index: number) => {
        supplierChainList[`supplierChainList${index}`] = {
          type: 'object',
          title: 'editor.supplierChainServices.supplierChainServiceDetailsTitle',
          properties: {
            title: {
              type: 'string',
              default: '',
              title: 'editor.supplierChainServices.detailTitle',
            },
            listContent: {
              type: 'string',
              default: '',
              widget: {
                'ui:widget': 'textarea',
              },
              title: 'editor.supplierChainServices.listContent',
            },
          },
        }
      }
    )

    range(0, numberOfSupplierChainServices || NUMBER_OF_SUPPLIER_CHAIN_SERVICES).forEach(
      (index: number) => {
        supplierChainServicesProps[`supplierChainService${index}`] = {
          type: 'object',
          title: 'editor.supplierChainServices.supplierChainServicesTitle',
          properties: {
            serviceTitle: {
              type: 'string',
              default: '',
              title: 'editor.supplierChainServices.item.serviceTitle',
            },
            image: {
              type: 'string',
              title: 'editor.supplierChainServices.item.supplierChainImage',
              default: '',
              widget: {
                'ui:widget': 'image-uploader',
              },
            },
            supplierChainDetails: {
              type: 'object',
              title: 'editor.supplierChainServices.supplierChainDetails',
              isLayout: false,
              properties: supplierChainList,
            },
          },
        }
      }
    )

    return {
      title: 'editor.supplierChainServices.title',
      description: 'editor.supplierChainServices.description',
      type: 'object',
      properties: {
        pageTitle: {
          type: 'string',
          title: 'editor.supplierChainServices.pageTitle',
          isLayout: false,
        },
        pageTitleDescription: {
          type: 'string',
          title: 'editor.supplierChainServices.pageTitleDescription',
          isLayout: false,
        },
        numberOfSupplierChainServices: {
          type: 'number',
          title: 'editor.supplierChainServices.numberOfSupplierChainServices',
          enum: [1, 2, 3, 4, 5, 6],
          default: 2,
          isLayout: false,
        },
        maxNumberOfDetailListing: {
          type: 'number',
          title: 'editor.supplierChainServices.maxNumberOfDetailListing',
          enum: [1, 2, 3],
          default: 3,
          isLayout: false,
        },
        supplierChainServices: {
          type: 'object',
          title: 'editor.supplierChainServices.supplierChainServices',
          properties: supplierChainServicesProps,
          isLayout: false,
        },
      },
    }
  }

  public render() {
    const { pageTitle, pageTitleDescription, supplierChainServices } = this.props

    let supplierChainServiceList: any = values(supplierChainServices).map(
      supplierChainService => supplierChainService
    )

    return (
      <div className={`${supplierChain.supplyChainContainer} w-100 pa8`}>
        <div className={`${supplierChain.supplyChainTitleContainer} mw9 center ph3-ns`}>
          <h2 className="t-heading-2">{pageTitle}</h2>
          <p className="t-body lh-copy mw9">{pageTitleDescription}</p>
        </div>
        {supplierChainServiceList &&
          supplierChainServiceList.length > 0 &&
          supplierChainServiceList.map((supplierChainService: any) => (
            <SupplierChainService {...supplierChainService} />
          ))}
      </div>
    )
  }
}

export default SupplyChainServices
