import React, { Component } from 'react'
import { values } from 'ramda'
import SupplierChainDetails from './SupplierChainDetails'
import supplierChain from './supplyChainServices.css'

interface Props {
  serviceTitle: string
  image: string
  supplierChainDetails?: any
}

class SupplierChainService extends Component<Props> {
  public static defaultProps = {
    numberOfLists: 3,
  }

  public render() {
    const { serviceTitle, image, supplierChainDetails } = this.props

    const supplierChainDetailsList: any = values(supplierChainDetails).map(
      supplierChainDetail => supplierChainDetail
    )

    return (
      <div className={`${supplierChain.supplyChainServiceContainer} mw9 center ph3-ns pv4`}>
        <div className={`${supplierChain.supplierChainServiceTitleContainer}  bg-white pv4 w-25`}>
          <span>{serviceTitle}</span>
        </div>
        <div
          className={`${supplierChain.supplierChainServiceBodyContainer} cf ph2-ns bg-white pv4`}>
          <div className="w-100 ">
            <div className={`${supplierChain.supplierChainServiceImageContainer} fl w-100  pa2`}>
              <img src={image} />
            </div>
            {supplierChainDetailsList &&
              supplierChainDetailsList.length > 0 &&
              supplierChainDetailsList.map((supplierChainDetail: any) => (
                <SupplierChainDetails {...supplierChainDetail} />
              ))}
          </div>
        </div>
      </div>
    )
  }
}

export default SupplierChainService
