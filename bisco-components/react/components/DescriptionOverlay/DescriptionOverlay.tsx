import React, { Fragment } from 'react'
import style from './descriptionOverlay.css'
import { FormattedMessage } from 'react-intl';

const MAX_SIZE_DESCRIPTION = 120

interface Props{
    description: String
}

interface State{
    expanded: Boolean
}

class DescriptionOverlay extends React.Component<Props, State> {
  state = { expanded: false }
  toggleDescription(e: any) {
    e.preventDefault()
    e.stopPropagation()

    this.setState(oldState => {
      return { expanded: !oldState.expanded }
    })
  }

  render() {
    const { description } = this.props
    const { expanded } = this.state
    const descriptionTruncated = description.length > MAX_SIZE_DESCRIPTION
    return (
      <Fragment>
        {descriptionTruncated && (
          <Fragment>
            {expanded && (
              <Fragment>
                <div
                  className={style.descriptionExpandedOverlay}
                  onClick={(e) => this.toggleDescription(e)}
                />
                <div className={style.descriptionExpanded}>
                  <div className={style.descriptionExpandedText}>
                    {description}
                  </div>
                  <a
                    onClick={(e) => this.toggleDescription(e)}
                    className={style.descriptionLessButton}
                  >
                     <FormattedMessage id={"store/bisco-components.less"}/> &#9650;
                  </a>
                </div>
              </Fragment>
            )}
            {!expanded && (
              <div className={style.descriptionSidebarBox}>
                <p className={style.descriptionAllContent}>{description}</p>
                <p className={style.descriptionReadMore}>
                  <a
                    onClick={(e) => this.toggleDescription(e)}
                    className={style.descriptionMoreButton}
                  >
                      <FormattedMessage id={"store/bisco-components.more"}/> &#9660;
                  </a>
                </p>
              </div>
            )}
          </Fragment>
        )}
        {!descriptionTruncated && (
          <h2 className={style.descriptionSimple}>{description}</h2>
        )}
      </Fragment>
    )
  }
}

export default DescriptionOverlay
