import React, { Fragment } from 'react'
import { Collapsible } from 'vtex.styleguide'
import warehouse from '../warehouseLocations.css'
import ReactHtmlParser from 'react-html-parser'

interface State {
  isOpen1: boolean
  isOpen2: boolean
}
interface Props {
  locationName: string
  warehouseLogo?: string
  mapUrl?: string
  addressHtml?: string
  localPhone?: string
  tollFreePhone?: string
  majorMarket?: string
}

class WarehouseLocation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isOpen1: false,
      isOpen2: false,
    }
  }

  getLine = () => {
    const { warehouseLogo, locationName, majorMarket} = this.props
    return (
      <div className={`${warehouse.listItemContainer} w-100-ns pa2 `}>
        <span className="fl bg-white pv4">{`${locationName} - ${majorMarket}`}</span>
        <img src={warehouseLogo} className={`${warehouse.listItemImage} fr`} />
      </div>
    )
  }

  render() {
    const { mapUrl, addressHtml, tollFreePhone, localPhone } = this.props

    return (
      <div className={warehouse.collapsibleWrapper}>
        <Collapsible
          header={this.getLine()}
          onClick={(e: any) => this.setState({ isOpen1: e.target.isOpen })}
          isOpen={this.state.isOpen1}>
          <div className={`${warehouse.iframeContainer} fl w-100 w-75-ns pa4 `}>
            <iframe className={`${warehouse.iframeContent}`} src={mapUrl} />
          </div>
          <div className={`${warehouse.listItemAddressContainer} fl w-100 w-25-ns pa4 `}>
            <address>
              <Fragment>{ReactHtmlParser(addressHtml)}</Fragment>
              <div>  {`Toll Free: ${tollFreePhone}`}</div>
              <div>{`Phone: ${localPhone}`}</div>
            </address>
            
          </div>
        </Collapsible>
      </div>
    )
  }
}

export default WarehouseLocation
