import React, { Component } from 'react'
import supplierChain from './supplyChainServices.css'

interface Props {
  title: string
  listContent?: string
}

class SupplierChainDetails extends Component<Props> {
  public render() {
    const { title, listContent } = this.props

    const list: string[] = listContent ? listContent.split('|') : []

    return (
      <div className={`${supplierChain.supplierChainServiceDetailListContainer} fl w-100  pa2`}>
        <div
          className={`${supplierChain.supplierChainServiceDetailListHeaderContainer} bg-white pv4`}>
          <span className="t-heading-4">{title}</span>
        </div>
        <div className={`${supplierChain.supplierChainServiceDetailListWrapper} bg-white pv4`}>
          <ul className={supplierChain.supplierChainServiceDetailList}>
            {list &&
              list.length > 0 &&
              list.map(item => (
                <li className={supplierChain.supplierChainServiceDetailListItem}>{item}</li>
              ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default SupplierChainDetails
