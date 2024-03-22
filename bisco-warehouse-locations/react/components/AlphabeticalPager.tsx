import React, { FunctionComponent } from 'react'
import styles from '../warehouseLocations.css'

interface Props {
  chars: [string]
}

const AlphabeticalPager: FunctionComponent<Props> = (data: Props) => {
  const linkStyle = `link ba near-black bg-animate hover-bg-heavy-blue hover-near-white tc pa3 mr2 dib ${
    styles.pagerLink
  }`
  return data.chars && data.chars.length > 0 ? (
    <div className={`${styles.alphabeticalPager} tc cf mv2`}>
      {data.chars.map((char: string) => (
        <div className={`dib tl ${styles.linkWrapper}`}>
          <a key={`link-id-${char}`} className={linkStyle} rel="prev" href={`#id-${char}`}>
            {char}
          </a>
        </div>
      ))}
    </div>
  ) : (
    <div />
  )
}

export default AlphabeticalPager
