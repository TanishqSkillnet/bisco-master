import { isEmpty, isNil, equals, startsWith } from 'ramda'

const getCorrectedCategoryUrl = (categoryUrl: string) => {
  if (isNil(categoryUrl) || isEmpty(categoryUrl)) {
    return ''
  }

  if (!startsWith('/', categoryUrl)) {
    return `/${categoryUrl}`
  }

  return categoryUrl
}

export const getCategoryUrl = (rootUrl: string, categoryUrl: string) => {
  if (isNil(rootUrl) || isEmpty(rootUrl) || equals('/', rootUrl)) {
    return getCorrectedCategoryUrl(categoryUrl)
  }
  return `${rootUrl}${getCorrectedCategoryUrl(categoryUrl)}`
}
