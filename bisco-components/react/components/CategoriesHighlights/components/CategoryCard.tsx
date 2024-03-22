import React, { FunctionComponent } from 'react'
import { Link } from 'vtex.render-runtime'

// import { SQUARED } from '../utils/Constants'
// import rectangularPlaceholder from '../images/rectangular-placeholder.svg'
// import squaredPlaceholder from '../images/squared-placeholder.svg'

import categoriesHighlights from '../categoriesHighlights.css'

enum Shape {
  RECTANGULAR = 'rectangular',
  SQUARED = 'squared',
}

interface Props {
  name: string
  image?: string
  shape: Shape
  page?: string
  params?: any
  query?: any
  to?: string
}

/**
 * CategoryCard is a component responsible to display an image of a category
 * and provides the link to the category specified by its name.
 */
const CategoryCard: FunctionComponent<Props> = ({
  name,
  image,
  shape,
  page,
  params,
  query,
  to,
}) => (
  <div className={`${categoriesHighlights[`${shape}Card`]} shadow-1 ma1 tc`}>
    <Link
      page={page}
      params={params}
      query={query}
      to={to}
      className={`${categoriesHighlights.cardLink}`}>
      {image ? (
        <img src={image} alt={name} className={`${categoriesHighlights[`${shape}CardImage`]}`} width="215" height="158"/>
      ) : (
        // <img
        //   src={shape === SQUARED ? squaredPlaceholder : rectangularPlaceholder}
        //   alt=""
        //   className={`${categoriesHighlights[`${shape}CardImage`]}`}
        //   width="215" height="158"
        // />
        ""
      )}
      <span className={`c-muted-1 ${categoriesHighlights.cardName}`}>{name}</span>
    </Link>
  </div>
)

export default CategoryCard
