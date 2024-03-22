import React from 'react'
import styles from '../manufacturer.css'

interface State {
  hideButton: boolean
}

class ScrollUpButton extends React.Component<{}, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      hideButton: true,
    }
  }

  public scrollStep = () => {
    if (window.pageYOffset < 100) {
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
    window.scroll(0, 0)
  }

  public render() {
    return (
      !this.state.hideButton && (
        <a href="javascript:;" onClick={this.backToTopClicked} className={styles.backToTop}><span></span></a>
      )
    )
  }
}

export default ScrollUpButton
