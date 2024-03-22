import React, { Component } from 'react'
import styles from '../../manufacturer.css'

interface Props {
  chars: string[]
}

export class AlphabeticalPager extends Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  public render() {
    const { chars } = this.props
    const linkStyle = `link ba near-black bg-animate hover-bg-heavy-blue hover-near-white tc pa3 mr2 dib ${
      styles.pagerLink
    }`
    return (
      <div className={`tc cf mv2 ${styles.pagerWrapper}`}>
        {chars.map((char: string) => (
          <div className={`dib tl ${styles.linkWrapper}`}>
            <a key={`link-id-${char}`} className={linkStyle} rel="prev" href={`#id-${char}`}>
              {char}
            </a>
          </div>
        ))}
      </div>
    )
  }
}
