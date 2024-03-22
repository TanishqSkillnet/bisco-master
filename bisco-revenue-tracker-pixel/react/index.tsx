import { canUseDOM } from 'vtex.render-runtime'

import { PixelMessage } from './typings/events'

export function handleEvents(e: PixelMessage | any) {
  switch (e.data.eventName) {
    case 'vtex:orderPlaced': {
      const {
        transactionTotal, transactionCurrency
      } = e.data

      window.uetq = window.uetq || [];
      window.uetq.push('event', 'order_placed', { 'event_category': 'track_revenue', 'revenue_value': transactionTotal, 'currency': transactionCurrency });
      break
    }case 'vtex:quoteAdd': {

      window.uetq = window.uetq || [];
      window.uetq.push('event', 'quick_quote', {});
      break
    }
    default: {
      break
    }
  }
}

if (canUseDOM) {
  window.addEventListener('message', handleEvents)
}
