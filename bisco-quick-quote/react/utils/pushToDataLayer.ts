window.dataLayer = window.dataLayer || []

export default function pushToDataLayer(event: any) {
  window.dataLayer.push(event)
}
