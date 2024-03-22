import React from 'react'
import styles from './aboutUs.css'
import { ExtensionPoint } from 'vtex.render-runtime'
import { COLLAPSIBLE_PANELS } from './utils/constants'


interface State {
  openedPanel?: number
}

interface Props {
  pageTitle: string
}

class About extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      openedPanel: COLLAPSIBLE_PANELS.NONE,
    }
  }

  toggleAccordion = (panelNumber: number) => {
    return () =>
      this.setState((prevState: State) => ({
        openedPanel: prevState.openedPanel !== panelNumber ? panelNumber : COLLAPSIBLE_PANELS.NONE,
      }))
  }

  render() {
    return (
      <div className={`${styles.container} mw9 center ph3-ns pa8`}>
        <ExtensionPoint
          id="about-us-section"
          toggleAccordion={this.toggleAccordion}
          openedTab={this.state.openedPanel}
          openPanelStartup={(panelNumber: number) => this.setState({openedPanel: panelNumber})}
        />

        <hr className="ma0 bb bb-0 b--black-10" />
        <ExtensionPoint
          id="history-section"
          toggleAccordion={this.toggleAccordion}
          openedTab={this.state.openedPanel}
        />

        <hr className="ma0 bb bb-0 b--black-10" />
        <ExtensionPoint
          id="news-section"
          toggleAccordion={this.toggleAccordion}
          openedTab={this.state.openedPanel}
        />

        <hr className="ma0 bb bb-0 b--black-10" />
        <ExtensionPoint
          id="why-choose-section"
          toggleAccordion={this.toggleAccordion}
          openedTab={this.state.openedPanel}
        />

        <hr className="ma0 bb bb-0 b--black-10" />
        <ExtensionPoint
          id="executive-team"
          toggleAccordion={this.toggleAccordion}
          openedTab={this.state.openedPanel}
        />
      </div>
    )
  }

  static getSchema() {
    return {
      title: 'editor.about.title',
      description: 'editor.about.description',
      type: 'object',
      properties: {
        pageTitle: {
          type: 'string',
          title: 'editor.about.sectionTitle',
          isLayout: false,
        },
      },
    }
  }
}

export default About
