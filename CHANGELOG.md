# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2024-03-22

## [0.3.63] - 2023-11-20

### Fixed

- Add content loader to fix mobile pdp price list shifting issue

## [0.3.62] - 2023-11-16

### Added 

- Add multi language translations for Button component
- Add missing language transaltions for ZIP code
- Remove show price functionalities in PDP 
- Fix bug in remove show price functionality

## [0.3.61] - 2023-09-11

### Added

- Add missing language transaltions
- Add brand description master data transaltions

## [0.3.60] - 2023-08-14

### Fixed

- Remove unwanted css property which cause bug 9801

## [0.3.59] - 2023-08-09

### Fixed

- Remove unwanted comma which was added mistakenly

## [0.3.58] - 2023-07-17

### Added

- Added missing multi language support for biscoind

## [0.3.57] - 2023-07-17

### Added

- Added missing multi language support for biscoind

## [0.3.56] - 2023-07-17

### Added

- Added multi language support for biscoind

## [0.3.55] - 2023-02-22

### Fixed

- Fixed price issue between PLP and PDP

## [0.3.54] - 2023-01-07

### Fixed

- Fixed loading effect dimentions

## [0.3.53] - 2022-10-21

### Fixed

- Show inventory available without price breaks table

## [0.3.52] - 2022-10-20

### Fixed

- Show product price breaks on desktop view all times

## [0.3.50] - 2022-08-29

### Fixed

- min order quantity correction

## [0.3.49] - 2022-08-02

## [0.3.48] - 2022-08-02

### Added

- Added extended pricing column in price tables

## [0.3.47] - 2022-03-10

### Fixed 

- Fixed issue on minicart not updating
- Fixed the issue on minicart not updating the quantity at the first time

## [0.3.46] - 2022-01-20

### Fixed 

- Modified MOQ for in quantity selector.

## [0.3.45] - 2021-09-27

### Fixed 

- Fixed decimal places in price breaks.

## [0.3.44] - 2021-09-25

## [0.3.43] - 2021-09-24

### Add

- Added quantitySelector

### Fixed 

- Removed duplicates in the request quote message.

## [0.3.42] - 2021-07-30

### Changed

- Price breaks lazy loading on mobile view

## [0.3.41] - 2021-06-25

### Changed

- Revert price breaks multiples change

## [0.3.40] - 2021-06-25

### Changed

- Avoid using multiples for price calculation

## [0.3.39] - 2021-05-10

### Changed

- Fix issue in product summary pricing table when multiples exists

## [0.3.38] - 2021-04-23

### Changed

- Add Product pricing table empty rows

## [0.3.37] - 2021-04-19

### Changed

- Performance improvements added

## [0.3.36] - 2021-04-08

### Changed

- Performance improvements added

## [0.3.35] - 2021-02-26

### Fixed

- Product summary hide specification if not exists

## [0.3.34] - 2020-12-05

### Fixed

- Fix bug on available quantity

## [0.3.33] - 2020-11-10

### Fixed

- Shipping simulator seller not found bug

## [0.3.32] - 2020-08-28

- styling for price tables
- remove empty price table rows

## [0.3.32] - 2020-07-27

### Added

- Styling product description display sections (links, titles, buttons)

## [0.3.31] - 2020-06-15

### Added

- revert 3.30 changes

## [0.3.29] - 2020-06-15

### Added

- Added mappings for subcategory tree in full text search

### Changed

- Edit price not found text
- hide inventory if no inventory
- Add postal code link in price tables
- Update version

## [0.3.28] - 2020-05-20

### Fixed

- Fix multiple price breaks filtering

## [0.3.27] - 2020-05-12

### Fixed

- Specification table column width adjustments

## [0.3.26] - 2020-05-12

### Fixed

- Wait until `itemId` is available to get prices
- Handle undefined node scenario in category tree

## [0.3.25] - 2020-04-29

- Remove category display from Brand Pages
- Implement Category Gallery view instead of slider

## [0.3.24] - 2020-03-31

### Fixed

- Remove price breaks without price in product details page

## [0.3.23] - 2020-03-31

### Fixed

- Fix issue in shipping simulator with entering zip code
- Remove price breaks without prices

## [0.3.22] - 2020-03-25

- pricing unavailable messages
- hide unavailable button
- increase width in specification modal column
- changed message in shipping estimate when no postal code entered

## [0.3.21] - 2020-03-05

### Added

- Changed messages in price breaks and shipping calculator

## [0.3.20] - 2020-03-05

### Added

- Added `biscoind.zip-code-context` application to the project
- Used zip code context in price breaks and shipping calculator sections

## [0.3.19] - 2020-02-27

### Fixed

- Removed padding of category panel container

## [0.3.17] - 2020-02-19

### Fixed

- Left aligned inventory block

## [0.3.16] - 2020-02-19

### Fixed

- Showed the total finite inventory from all sellers

### Changed

- handle errors in shipping calculator

## [0.3.15] - 2020-02-19

### Fixed

- Fixed errors in brand content

### Changed

- Used tabbed layout for brand content
- Used functional components for brand content

## [0.3.14] - 2020-02-07

### Fixed

- code refactoring in `Shipping Calculator`, `Price Breaks` and `Available Inventory`

## [0.3.13] - 2020-01-17

### Fixed

- Fixed typo

## [0.3.12] - 2020-01-17

### Fixed

- Fixed category panel item bottom border invisibility

## [0.3.11] - 2020-01-03

### Changed

- Used search queries from `search-graphql`

## [0.3.10] - 2019-12-27

### Removed

- remove product query from categories hilighetd and added custom graphql query with required fields
- remove product query from specifications
- remove product query from brand content

## [0.3.9] - 2019-12-13

### Fixed

- Removed left padding of brand content for large screens

## [0.3.8] - 2019-12-13

### Fixed

- Fixed brand content styling issues

## [0.3.7] - 2019-12-13

### Fixed

- Used the last document for brand content

## [0.3.6] - 2019-12-10

### Fixed

- Fixed `categories-highlights` schema

## [0.3.5] - 2019-12-05

### Fixed

- Fixed summary pricing alignment

## [0.3.4] - 2019-12-02

### Added

- product summary name wrapper added to change html element to h3 tag

## [0.3.3] - 2019-11-25

### Fixed

- Renamed `FacetProduct` to `FacetImage`
- Changed double quotes to single quotes

### Removed

- Removed unused fields from `FacetImage` query
- Removed unused `Constants.ts` file

## [0.3.2] - 2019-11-22

### Fixed

- Fetch all facet images once and then filter to gain speed

## [0.3.1] - 2019-11-15

### Fixed

- product highlights wrapper for search results
- brand content wrapper for search results

## [0.3.0] - 2019-11-07

### Added

- Product summary specifications
- Product summary field highlights
- Product summary available inventory
- Product summary price breaks
- Product summary description
- Product summary buy button wrapper
- Product summary quantity selector

## [0.2.11] - 2019-10-01

### Fixed

- Fixed empty category panel items

## [0.2.10] - 2019-09-09

### Fixed

- Fixed styling issues in brand content

## [0.2.9] - 2019-09-03

### Fixed

- Reduced size of content loader for price breaks
- Added content loader to available inventory

## [0.2.8] - 2019-08-30

### Fixed

- Changed data format of lead time

## [0.2.7] - 2019-08-22

### Fixed

- Limited category panel width for different screens

## [0.2.6] - 2019-08-19

### Fixed

- Added new changes to product slider in `BrandContent` and `CategoryPanel`
- Fixed mobile/non-mobile height of video slider
- Added a fixed height to the sections

## [0.2.5] - 2019-08-19

### Changed

- price breaks in search result graphql query moved from `product-summary` to `bisco-components`
- price breaks user interface changes and code refactoring

## [0.2.4] - 2019-08-15

### Added

- Added `scroll-up-button` component.

## [0.2.3] - 2019-08-13

### Fixed

- price breaks table fixes

##[0.2.2] - 2019-08-13

### Fixed

- Stripped pricing table for search results
- Show placeholder if image not available in category panel
- Use the last image for a category in category panel
- Use image from brand to show in the brand panel
- Fix styling issues of brand panel
- Set a fixed height for brand content description

### Changed

- Used a content loader for category panel, brand content and price breaks

## [0.2.1] - 2019-08-05

### Fixed

- Fixed user interface issues in price breaks table (product details)
- Fixed postal code not shared among gallery and product details views

## [0.2.0] - 2019-08-01

### Added

- Created component for product details price breaks

## [0.1.3] - 2019-07-30

### Fixed

- Fixed categories hilighted ui fixes

## [0.1.2] - 2019-07-30

### Fixed

- Fixed index button responsiveness issues

## [0.1.1] - 2019-07-23

### Added

- Added manufacturer list component

## [0.1.0] - 2019-05-30

### Added

- Added supplier chain services component
- Added categories highlights component
