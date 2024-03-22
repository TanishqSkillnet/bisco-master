import { startsWith, toLower } from 'ramda'
import React, { FunctionComponent } from 'react'
import { Query } from 'react-apollo'
import { Spinner } from 'vtex.styleguide'
import AlphabeticalPager from './components/AlphabeticalPager'
import ScrollUpButton from './components/ScrollUpButton'
import WarehouseLocation from './components/WarehouseLocation'
import warehouseLocationsQuery from './graphql/warehouseLocationsQuery.graphql'
import {
  ALPHABETIC_CHARS,
  MASTER_DATA_FIELD_NAMES,
  MASTER_DATA_TABLE_NAME,
  PAGE,
  PAGESIZE,
  SCHEMA_NAME,
} from './utils/constants'
import warehouse from './warehouseLocations.css'

const getFields = (location: any) => {
  let obj = {} as any

  if (location && location.fields && location.fields.length > 0) {
    obj.id = location.id
    location.fields.map((field: any) => (obj[field.key] = field.value))
  }
  return obj
}

const getLocations = (data: [any]) => {
  return data && data.length > 0 ? data.map(loc => getFields(loc)) : []
}

const renderAlphabeticSection = (char: string, data: [any]) => {
  const locations = getLocations(data)
  return (
    <div id={char} className={`${warehouse.letterSection} pv2`}>
      <div id={`id-${char}`} className={`${warehouse.letterWithBorder} ${warehouse.scrollOffset} white`}>
        <span  className={`${warehouse.boxLetter} bg-dark-gray w2 h2`}>
          {char}
        </span>
      </div>

      <div className={`${warehouse.collapseItemWrapper} flex w-100 flex-wrap items-center pa4`}>
        {locations && locations.length > 0 ? (
          locations
            .filter(location => startsWith(toLower(char), toLower(location.locationName as string)))
            .sort((a,b)=> a.locationName.localeCompare(b.locationName))
            .map(location => (
              <WarehouseLocation
                locationName={location.locationName}
                warehouseLogo={location.warehouseLogo}
                mapUrl={location.mapUrl}
                addressHtml={location.addressHtml}
                localPhone={location.localPhone}
                tollFreePhone={location.tollFreePhone}
                majorMarket={location.majorMarket}
              />
            ))
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}

const WarehouseLocations: FunctionComponent<{}> = () => {
  const queryParams = {
    acronym: MASTER_DATA_TABLE_NAME,
    fields: MASTER_DATA_FIELD_NAMES,
    page: PAGE,
    pageSize: PAGESIZE,
    schema: SCHEMA_NAME,
    where: '',
  }

  return (
    <Query query={warehouseLocationsQuery} variables={queryParams}>
      {({ loading, data }: any) => {
        return loading ? (
          <Spinner />
        ) : (
          <div>
            <div className={`${warehouse.container} center pt6 pb6 w-90 mw9`}>
              <AlphabeticalPager chars={ALPHABETIC_CHARS as [string]} />
              {ALPHABETIC_CHARS.map(char => renderAlphabeticSection(char, data.documents))}
            </div>
            <ScrollUpButton />
          </div>
        )
      }}
    </Query>
  )
}

export default WarehouseLocations
