import React from 'react'
import styles from './scrollUpButton.css'
import { withDevice } from 'vtex.device-detector'

interface State {
  hideButton: boolean
}

interface Props {
  device: string
  location: string
}

class ScrollUpButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      hideButton: true,
    }
    //console.log(props.device)
  }

  public scrollStep = () => {
    const { device } = this.props
    const visibilityPoint = device == 'phone' ? 1600 : 700
    if (window.pageYOffset < visibilityPoint) {
      this.setState({ hideButton: true })
    } else {
      this.setState({ hideButton: false })
    }
  }

  public componentDidMount() {
    window.addEventListener('scroll', this.scrollStep)
  }

  public componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollStep)
  }

  public backToTopClicked = () => {
    window.scroll(0, 650)
  }

  public render() {
    const { location } = this.props
    return (
      !this.state.hideButton && (
        <a href={location} className={styles.backToTop}>
          <span />
        </a>
      )
    )
  }
}

export default withDevice(ScrollUpButton)
