import React, { Component } from 'react'
import { Collapsible } from 'vtex.styleguide'
import styles from '../common.css'
import { COLLAPSIBLE_PANELS } from '../utils/constants'

interface Props {
  sectionTitle: string
  sampleText: string
  toggleAccordion: Function
  openedTab: number
}

class WhyChoose extends Component<Props> {

  render(){
    const { sectionTitle, sampleText, toggleAccordion, openedTab } = this.props
    return (
      <Collapsible
        header={<div className={`${styles.collapsibleHeader} pv6 hover-c-on-action-secondary`}>{sectionTitle}</div>}
        onClick={toggleAccordion(COLLAPSIBLE_PANELS.WHY_CHOOSE)}
        isOpen={openedTab === COLLAPSIBLE_PANELS.WHY_CHOOSE}>
        <div className="bg-muted-5 pa6">{sampleText}</div>
      </Collapsible>
    )
  }

  static getSchema() {
    return {
      title: 'editor.whyChoose.title',
      description: 'editor.whyChoose.description',
      type: 'object',
      properties: {
        sectionTitle: {
          type: 'string',
          title: 'editor.about.sectionTitle',
          isLayout: false,
        },
        sampleText: {
          type: 'string',
          title: 'editor.whyChoose.sampleText',
          isLayout: false,
        },
      },
    }
  }
}

export default WhyChoose
