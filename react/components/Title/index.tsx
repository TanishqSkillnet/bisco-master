import React from 'react'
import classNames from 'classnames'
import { LEFT, RIGHT, CENTER, LEVELS } from './constants'
import styles from './title.css'

interface Props {
  content: string
  level: number
  alignment: string
}

class Title extends React.Component<Props> {

  defaultProps = {
    level: 3,
    alignment: CENTER,
  }

  constructor(props: Props) {
    super(props)
  }

  getHeaderContentByLevel(level: number, content: string, titleClasses: string){
    switch (level) {
      case 1:
        return <h1 className={titleClasses}>{content}</h1>
      case 2:
        return <h2 className={titleClasses}>{content}</h2>
      case 3:
        return <h3 className={titleClasses}>{content}</h3>
      case 4:
        return <h4 className={titleClasses}>{content}</h4>
      case 5:
        return <h5 className={titleClasses}>{content}</h5>
      case 6:
        return <h6 className={titleClasses}>{content}</h6>
      default:
        return <h6 className={titleClasses}>{content}</h6>
    }
  }

  render() {
    const { content, level, alignment } = this.props
    const titleClasses = classNames(styles.title, `t-heading-${level}`, {
      tl: alignment === LEFT,
      tc: alignment === CENTER,
      tr: alignment === RIGHT,
    })

    return (
      <div className={`flex justify-between`}>
        <div className={`w-100 ma1 c-muted-1 bb b--muted-4`}>
          {this.getHeaderContentByLevel(level, content, titleClasses)}
        </div>
      </div>
    )
  }

  static getSchema() {
    return {
      title: 'editor.title.title',
      description: 'editor.title.description',
      type: 'object',
      properties: {
        content: {
          type: 'string',
          title: 'editor.title.content',
          isLayout: false,
        },
        level: {
          type: 'number',
          title: 'editor.title.level',
          enum: LEVELS,
          default: 3,
          widget: {
            'ui:widget': 'radio',
            'ui:options': {
              inline: true,
            },
          },
          isLayout: false,
        },
        alignment: {
          type: 'string',
          title: 'editor.title.alignment',
          enum: [LEFT, RIGHT, CENTER],
          enumNames: [
            'editor.title.alignment.left',
            'editor.title.alignment.right',
            'editor.title.alignment.center',
          ],
          default: CENTER,
          widget: {
            'ui:widget': 'radio',
            'ui:options': {
              inline: true,
            },
          },
          isLayout: true,
        },
      },
    }
  }
}

export default Title
