export interface PixelMessage extends MessageEvent {
  data: PageViewData
}

export interface EventData {
  event: string
  eventName: string
  currency: string
}

export interface PageViewData extends EventData {
  event: 'pageView'
  eventName: 'vtex:pageView'
  pageTitle: string
  pageUrl: string
  referrer: string
}
