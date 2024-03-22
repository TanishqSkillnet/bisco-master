import { RequestOptions } from 'apollo-datasource-rest'
import { forEachObjIndexed } from 'ramda'
import { RESTDataSource } from './RESTDataSource'

const getBaseUrl = () => `https://logistics.vtexcommercestable.com.br/api/logistics`

export class LogisticsDataSource extends RESTDataSource {

  public simulationSLA = (items: any) => {
    const { vtex: { account } } = this.context
    return this.post(
      `${getBaseUrl()}/pvt/shipping/simulation?an=${account}`,
      items,
      {metric: 'logistics-simulation-sla'}
    )
  }

  public inventoryBySku = (skuId: string) => {
    const { vtex: { account } } = this.context
    return this.get(
      `${getBaseUrl()}/pvt/inventory/skus/${skuId}?an=${account}`,
      {metric: 'logistics-inventory-by-sku'}
    )
  }

  protected willSendRequest(request: RequestOptions) {
    const {
      vtex: { authToken, production },
      cookies,
    } = this.context
    const segment = cookies.get('vtex_segment')
    const [appMajorNumber] = process.env.VTEX_APP_VERSION!.split('.')
    const appMajor = `${appMajorNumber}.x`

    forEachObjIndexed((value: string, param: string) => request.params.set(param, value), {
      __v: appMajor,
      production: production ? 'true' : 'false',
      ...(segment && { vtex_segment: segment }),
    })

    forEachObjIndexed((value: string, header: any) => request.headers.set(header, value), {
      'Accept-Encoding': 'gzip',
      Authorization: authToken,
      'Proxy-Authorization': authToken,
      VtexIdclientAutCookie: authToken,
      'X-Vtex-Proxy-To': `http://logistics.vtexcommercestable.com.br`,
      ...(segment && { Cookie: `vtex_segment=${segment}` }),
    })
  }
}
