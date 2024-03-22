import { isEmpty, isNil, path } from 'ramda'
import React, { Component } from 'react'
import { Link, withRuntimeContext } from 'vtex.render-runtime'
import styles from '../../manufacturer.css'

interface Props {
  brand: any
  link?: string
  linkText?: string
  columnsCount?: number
  runtime: {
    hints: {
      mobile: boolean
      phone: boolean
      tablet: boolean
      desktop: boolean
    }
  }
}

class ListItem extends Component<Props> {
  public render() {
    const {
      brand,
      link,
      linkText,
      columnsCount,
      runtime: {
        hints: { mobile, phone },
      },
    } = this.props
    const linkStyles = 'grow no-underline ba br1 b--black-10 ph3 pv2 mb2 dib dark-gray '
    const maxColumns = (mobile && phone) ? 1 : 3
    const columnClass = `brandw${Math.min(columnsCount || 3, maxColumns)}`
    const linkBackgroundStyles = `${styles.brand} ${styles[columnClass]} fl pl3 pr3 pb2 pt2`
    return (
      <div className={`${linkBackgroundStyles}`}>
        {' '}
        {isNil(link) || isEmpty(link) ? (
          <Link
            page={path(['page'], brand)}
            params={path(['pageParams'], brand)}
            className={linkStyles}>
            {brand.name.split('/').join('/ ')}
          </Link>
        ) : (
          <a href={link} className={linkStyles}>
            {linkText && linkText.split('/').join('/ ')}
          </a>
        )}
      </div>
    )
  }
}

export default withRuntimeContext(ListItem)
