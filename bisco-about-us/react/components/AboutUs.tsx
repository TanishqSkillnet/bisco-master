import React from 'react'
import styles from '../aboutUs.css'
import commonStyles from '../common.css'
import { PageBlock, Collapsible } from 'vtex.styleguide'
import { ExtensionPoint } from 'vtex.render-runtime'
import { COLLAPSIBLE_PANELS } from '../utils/constants'

interface Props {
  sectionTitle: string
  aboutUsVideo: string
  aboutUsImage: string
  toggleAccordion: Function
  openedTab: number
  openPanelStartup: Function
}

class AboutUs extends React.Component<Props> {

  openPanel(){
    const { openPanelStartup } = this.props
    openPanelStartup(COLLAPSIBLE_PANELS.ABOUT_US)
  }

  onImageLoaded(){
    this.openPanel()
  }

  onImageLoadError(){
    this.openPanel()
  }

  render() {
    const { sectionTitle, aboutUsVideo, aboutUsImage, toggleAccordion, openedTab } = this.props

    return (
      <Collapsible
        header={<div className={`${commonStyles.collapsibleHeader} pv6 hover-c-on-action-secondary`}>
        {sectionTitle}</div>}
        onClick={toggleAccordion(COLLAPSIBLE_PANELS.ABOUT_US)}
        isOpen={openedTab === COLLAPSIBLE_PANELS.ABOUT_US}>
        <div className={`${styles.aboutUsPageBlockContainer} bg-muted-5`}>
          <PageBlock variation="half">
            <div className={styles.aboutUsCollapsibleContainer}>
              <iframe
                className={styles.aboutUsIframe}
                src={aboutUsVideo}
              />
              <div className={styles.aboutUsTextContent}>
                <ExtensionPoint id="rich-text" />
              </div>
            </div>
            <div className={styles.aboutUsImageContainer}>
            <img
                className={styles.aboutUsImage}
                src={aboutUsImage}
                onLoad={this.onImageLoaded.bind(this)}
                onError={this.onImageLoadError.bind(this)} />
            </div>
          </PageBlock>
        </div>
      </Collapsible>
    )
  }

  static getSchema() {
    return {
      title: 'editor.aboutUs.title',
      description: 'editor.aboutUs.description',
      type: 'object',
      properties: {
        sectionTitle: {
          type: 'string',
          title: 'editor.about.sectionTitle',
          isLayout: false,
        },
        aboutUsVideo: {
          type: 'string',
          title: 'editor.aboutUs.video',
          isLayout: false,
        },
        aboutUsImage: {
          type: 'string',
          title: 'editor.aboutUs.image',
          default: '',
          widget: {
            'ui:widget': 'image-uploader',
          },
        },
      },
    }
  }
}

export default AboutUs
