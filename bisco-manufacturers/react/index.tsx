import React from 'react'
import { graphql } from 'react-apollo'
import { withRuntimeContext } from 'vtex.render-runtime'
import ListContent from './components/list/ListContent'
import { AlphabeticalPager } from './components/paginator/AlphabeticalPager'
import ScrollUpButton from './components/ScrollUpButton'
import styles from './manufacturer.css'
import brandsQuery from './queries/brands.gql'
// import styles from './manufacturer.css'
import { ALPHABETIC_CHARS } from './utils/constants'
import { sortManufacturersByName } from './utils/manufacturerSortUtil'

interface ListProps {
  numberOfRows: number
  numberOfColumns: number
  showMoreButton: boolean
}

interface Props {
  data: { brands: any[] }
  list?: ListProps
}

class Manufacturers extends React.Component<Props> {
  public static defaultProps = {
    list: {
      numberOfColumns: 3,
      numberOfRows: 1000,
      showMoreButton: false,
    },
  }

  constructor(props: Props) {
    super(props)
  }

  public listFilteredManufacturers = (char: string) => {
    const {
      data: { brands = [] },
      list,
    } = this.props

    const filteredBrands =
      char === '#'
        ? brands.filter((brand: any) => brand.active === true && brand.name.toLowerCase().match(/^\d/))
        : brands.filter((brand: any) => brand.active === true && brand.name.toLowerCase().startsWith(char.toLowerCase()))

    const listContentProps = {
      brands: sortManufacturersByName(filteredBrands),
      ...list,
    }

    return (
      <div className="pv2">
        <div className="pt2 bb b--dark-gray mb2">
          <div className="white bg-dark-gray w2 pl4">
            <span id={`id-${char}`} className={`${styles.letterClass} pl3`}>
              {char}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center pl4">
          <ListContent {...listContentProps} />
        </div>
      </div>
    )
  }

  public render() {
    return (
      <div className="center pt6 pb6 w-90 mw9">
        <AlphabeticalPager chars={ALPHABETIC_CHARS} />
        {ALPHABETIC_CHARS.map((char: string) => this.listFilteredManufacturers(char))}
        <ScrollUpButton />
      </div>
    )
  }
}

export default graphql(brandsQuery)(withRuntimeContext(Manufacturers))
