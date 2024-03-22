import RouteParser from 'route-parser'

export const getHref = (
  page: any,
  params: any,
  pages?: any,
  query?: any,
  to?: string,
  rootPath?: string
) => {
  if (to) {
    // Prefix any non-absolute paths (e.g. http:// or https://) with runtime.rootPath
    if (rootPath && !to.startsWith('http') && !to.startsWith(rootPath)) {
      return rootPath + to
    }
    return to
  }
  if (page) {
    const path = pathFromPageName(page, pages, params)
    const qs = query ? `?${query}` : ''
    if (path) {
      return rootPath + path + qs
    }
  }
  return '#'
}

export function pathFromPageName(page: string, pages: any, params: any) {
  const validTemplate = getValidTemplate(page, pages)
  if (!validTemplate) {
    return null
  }
  return new RouteParser(validTemplate).reverse(params) || null
}

function getValidTemplate(page: string, pages: any) {
  const pageDescriptor = pages[page]

  if (!pageDescriptor) {
    console.error(`Page ${page} was not found`)
    return null
  }

  const { path: template, canonical } = pageDescriptor
  if (!template) {
    console.error(`Page ${page} has no path`)
    return null
  }

  return adjustTemplate(canonical || template)
}

function adjustTemplate(template: string) {
  // make last splat capture optional
  return trimEndingSlash(template).replace(/(\/\*\w+)$/, '($1)')
}

function trimEndingSlash(token: string) {
  return token.replace(/\/$/, '') || '/'
}
