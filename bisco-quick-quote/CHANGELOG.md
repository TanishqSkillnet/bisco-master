
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Add korean translated country list

## [0.2.22] - 2023-07-17

### Added

- Add supporting for other languages

## [0.2.21] - 2022-10-19

### Added

- Push quote to the data layer

## [0.2.20] - 2022-05-31

### Fixed

- Add referrer information to the campaign data
- Refactored the campaign information format send at the QuickQuote
- Fixing the referrer field not sent issue

## [0.2.19] - 2022-05-11

## [0.2.18] - 2022-05-11

### Fixed 

- Quote address not populated

## [0.2.17] - 2022-05-10

### Fixed

- Hardcode the unitOfMeasure to 'E' in quote creation

## [0.2.16] - 2022-04-29

### Fixed

- Add handling for non-campaign urls
- Add campaign information to the quick quote
- Campaign information were saved to the cookies using Pixel Builder

## [0.2.15] - 2021-09-08

### Changed

- Changed the quote form labels text (Target Price & Quantity)
### Removed 

- Removed address fields from quote form

## [0.2.14] - 2021-08-31

### Changed

- Add address fields to quote form


## [0.2.13] - 2021-04-19

### Changed

- Performance improvements added

## [0.2.12] - 2021-04-08

### Changed

- Performance improvements added

## [0.2.11] - 2020-07-09

### Fixed

- Fixed displaying errors on `targetPrice`, `competitor` and `quantity`

## [0.2.10] - 2020-06-08

### Added

- Added a user alert

## [0.2.9] - 2020-06-08

### Fixed

- Used `quick-quote-schema-v1` when saving the quote

## [0.2.8] - 2020-06-05

### Fixed

- Stopped sending Jaalaa event in case of failure

## [0.2.7] - 2020-04-22

### Fixed

- Sent SKU to the Jaala event

## [0.2.6] - 2020-04-21

### Fixed

- Added `totalPrice` to Jaala event

## [0.2.5] - 2020-04-17

### Fixed

- Used company from `profile` query as default for saving

## [0.2.4] - 2020-04-17

### Fixed

- Added the complete country list

## [0.2.3] - 2020-04-17

### Fixed

- Added missing defaults for logged in user

### Added

- Sent quote add event data to `jaala-pixel`

## [0.2.2] - 2019-11-29
### Fixed
- Fixed product details not appearing on summary
- Used a two column layout for the form

## [0.2.0] - 2019-11-13
### Added 
- product summary quick quote wrapper

## [0.1.2] - 2019-10-11
### Fixed
- Fixed empty phone number for logged in user

## [0.1.1] - 2019-08-15
### Fixed
- Fixed styling issues
- Fixed product details not appearing on detail page

## [0.1.0] - 2019-04-18
### Added
- Added quick quote component
