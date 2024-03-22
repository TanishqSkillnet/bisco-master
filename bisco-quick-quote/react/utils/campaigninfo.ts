const REFERRER = 'utm_referrer'
const campaignFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', REFERRER ]

export function setCampaignData() {
  const EXPIRE_COOKIE = 30
  const expireCookiesAfter = new Date()
  expireCookiesAfter.setTime(expireCookiesAfter.getTime() + (EXPIRE_COOKIE * 24 * 60 * 60 * 1000))

  const campaignInfo = decodeURIComponent(window.location.search.replace(/\+/g, '%20'))
  const clearedUrl = campaignInfo.substring(campaignInfo.indexOf('?') + 1)

  const splittedUrl = clearedUrl.split('&')

  splittedUrl.forEach(s => {
    const splittedField = s.split('=')

    if (campaignFields.includes(splittedField[0])) {
      document.cookie = splittedField[0] + '=' + splittedField[1] + '; expires=' + expireCookiesAfter
    }
  })

  // HTML Referrer Add
  document.cookie = REFERRER + '=' + (document.referrer ?? '') + '; expires=' + expireCookiesAfter
}

export function getCampaignData() {
  const campaignInfoInCookies = document.cookie?.split(`;`).filter(cookie => cookie.trim().startsWith(`utm_`))

  const campaignInfo = new Map()

  campaignInfoInCookies?.forEach(s => {
    const splittedFields = s.trim().split(`=`)
    campaignInfo.set(splittedFields[0], splittedFields[1])
  })

  console.log(`Cookies: `, campaignInfo)

  return campaignInfo.size > 0 ? campaignInfo : null
}
