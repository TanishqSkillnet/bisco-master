'use client'
import React, { Component , Fragment } from 'react'
import { CategoryItem, FacetImage } from '../utils/interfaces'
import CategoryPanelItem from './CategoryPanelItem'

import styles from '../categoryPanel.css'
// import { NoSSR } from 'vtex.render-runtime'
// import { Container } from 'vtex.store-components'

interface Props {
  items: CategoryItem[]
  parent: string
  noOfCategories: number
  autoplay: boolean
  autoplaySpeed: number
  showArrows: boolean
  showDots: boolean
  itemsPerPage: number
  width: number
  gap: string
  maxItems: number
  minItemsPerPage: number
  isMobile: boolean
  facetImages: FacetImage[]
}

class CategoryGallery extends Component<Props> {
  public perPage: any

  public constructor(props: Props) {
    super(props)
    this.state = {
      currentSlide: 0,
      firstRender: true,
    }
  }

  componentDidMount() {
    this.setState({ firstRender: false })
  }

 public roundHalf = (num: number) => Math.round(num * 2) / 2

  public render() {
    const {
      items,
      parent,
      facetImages,
    } = this.props

    return (
      items.length !== 0 && (
        <>
          <div className={styles.categoryGroup}>
          {items.sort((a, b) => a.name.localeCompare(b.name)).map((item,index)=> (
                <Fragment key= {item.id}>
                  <CategoryPanelItem category={item} parent={parent} index={index} facetImages={facetImages}/>
                </Fragment>
              ))}
          </div>
        </>
      )
    )
  }
}

export default CategoryGallery
