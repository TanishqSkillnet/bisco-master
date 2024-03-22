import React, { Component } from 'react'
import ListItem from './ListItem'

interface Props {
  brands: any[]
  showMoreButton?: boolean
  numberOfRows?: number
  numberOfColumns?: number
}

export default class ListContent extends Component<Props> {
  public static defaultProps = {
    numberOfColumns: 10,
    numberOfRows: 4,
    showMoreButton: true,
  }

  constructor(props: Props) {
    super(props)
  }

  public getManufacturerListItem = (brand: any, index: number, maxItemsInShelf: number) => {
    const { brands, showMoreButton, numberOfColumns } = this.props

    let itemProps = {
      brand: {
        ...brand,
        ...{ page: 'store.search#brand', pageParams: { brand: encodeURIComponent(brand.slug) } },
      },
      columnsCount: numberOfColumns,
    }

    if (showMoreButton && brands.length > maxItemsInShelf && index + 1 == maxItemsInShelf) {
      itemProps = {
        ...itemProps,
        ...{ brand: { slug: '' }, link: '/manufacturers', linkText: 'See More' },
      }
    }

    return <ListItem {...itemProps} />
  }

  public render() {
    const { brands = [], numberOfRows = 0, numberOfColumns = 0 } = this.props
    const maxItemsInShelf = numberOfRows * numberOfColumns
    return brands
      .slice(0, maxItemsInShelf)
      .map((brand: any, index: number) =>
        this.getManufacturerListItem(brand, index, maxItemsInShelf)
      )
  }
}

// ListContent.getSchema = () => {
//   return {
//     title: 'editor.manufacturer.listContainer.title',
//     description: 'editor.manufacturer.listContainer.description',
//     type: 'object',
//     properties: {
//       numberOfColumns: {
//         title: 'editor.manufacturer.listContainer.numberOfColumns',
//         type: 'number',
//         enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//         default: ListContent.defaultProps.numberOfColumns,
//         isLayout: true,
//       },
//       numberOfRows: {
//         title: 'editor.manufacturer.listContainer.numberOfRows',
//         type: 'number',
//         isLayout: true,
//       },
//       showMoreButton: {
//         title: 'editor.manufacturer.listContainer.showMoreButton',
//         type: 'boolean',
//         enum: [true, false],
//         default: true,
//         isLayout: true,
//       },
//     },
//   }
// }
