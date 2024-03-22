import React from 'react'
import { last, pathOr } from 'ramda'
import { Link } from 'vtex.render-runtime'

import { CategoryItem, FacetImage } from '../utils/interfaces'
import styles from '../categoryPanel.css'
import Placeholder from './Placeholder.png'
import classNames from 'classnames'
import { ApolloError } from 'apollo-client'

interface Props {
  category: CategoryItem
  facetImages: FacetImage[]
  parent: string
  index : number
}

/**
 * Normalizes the item received in the props to adapt to the extension point prop.
 */
const CategoryPanelItem = ({ category, facetImages, parent, index }: Props) => {
  
  
  const itemCardClasses = classNames(styles.itemCard)
  
  const imageCard = (image?: string, error?: ApolloError) => (
      <div className={itemCardClasses}>
        { index===9999 ? <div className={styles.galleryParent}><h4>{parent}</h4></div> : ''}
      <Link className={`${styles.clearLink}`} to={category.to}>
        
             
              {!error && image ? (
                <img className={styles.categoryImage} src={image} alt={category.name} />
                
              ) : (
                <img className={styles.categoryImage} src={Placeholder} alt={category.name} />
              )}
           <span className= {styles.galleryChild}>{category.name}</span>
          
      </Link>
      </div>
    
  )

  const facetImage: FacetImage | undefined = last(
    facetImages.filter((facetImage: FacetImage) => facetImage.facetId == category.id)
  )
  

  if (!facetImage) {
    return imageCard()
  }
  if(category.name === 'Miscellaneous Products'){
    return imageCard()
  }

  const image: any = pathOr('', ['url'], facetImage)
  return imageCard(image)
}

export default CategoryPanelItem
