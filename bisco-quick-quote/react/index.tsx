import { canUseDOM } from 'vtex.render-runtime'
import { PixelMessage } from './typings/events'
import { setCampaignData } from './utils/campaigninfo'

function handleMessages(e: PixelMessage) {
  switch (e.data.eventName) {
    case 'vtex:pageView': {
      setCampaignData()
      break
    }
    default:
      break
  }
}

if (canUseDOM) {
  window.addEventListener('message', handleMessages)
}
