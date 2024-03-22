export function resolvePaginationDotsVisibility(visibility: string, isMobile: boolean) {
  return !!(
    visibility === 'visible' ||
    (visibility === 'mobileOnly' && isMobile) ||
    (visibility === 'desktopOnly' && !isMobile)
  )
}
