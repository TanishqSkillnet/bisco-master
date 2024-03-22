import React, { Component, MouseEvent } from 'react'
import { ProductInfo } from '../utils/dataTypes'
import MediaLeadPopup from './MediaLead'
import { Button } from 'vtex.styleguide'
import styles from '../styles/mediaLinkStyles.css'

interface Props {
  productInfo: ProductInfo
  linkUrl: string
  linkText: string
  mediaType: string
}

interface State {
  openModal: boolean
}

class MediaLink extends Component<Props, State> {
  public state = { openModal: false }

  constructor(props: Props) {
    super(props)
    this.onMediaLinkClick = this.onMediaLinkClick.bind(this)
    this.onCloseMediaLinkPopup = this.onCloseMediaLinkPopup.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
  }

  public onMediaLinkClick(e: MouseEvent) {
    e.preventDefault()
    this.setState({ openModal: true })
  }

  public onCloseMediaLinkPopup() {
    this.setState({ openModal: false })
  }

  public onFormSubmit() {
    const { linkUrl } = this.props
    const win = window.open(linkUrl, '_blank')
    if (win) {
      win.focus()
    }
    this.onCloseMediaLinkPopup()
  }

  public render() {
    const { productInfo, linkText } = this.props

    return (
      <div>
        <div className={styles.MediaLinkStyle}>
          <Button onClick={(e: any) => this.onMediaLinkClick(e)}> {linkText}</Button></div>
        <MediaLeadPopup
          modalOpen={this.state.openModal}
          productInfo={productInfo}
          onCloseModal={this.onCloseMediaLinkPopup}
          onFormSubmit={this.onFormSubmit}
        />
      </div>
    )
  }
}

export default MediaLink
