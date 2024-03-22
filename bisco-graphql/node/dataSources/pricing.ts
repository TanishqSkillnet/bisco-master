import { RequestOptions } from 'apollo-datasource-rest'
import { forEachObjIndexed } from 'ramda'
import { RESTDataSource } from './RESTDataSource'

export class PricingDataSource extends RESTDataSource {
  constructor() {
    super()
  }

  public fixedPrices = (itemId: string = '') => {
    return this.get(`/${itemId}/fixed`)
  }

  get baseURL() {
    const {
      vtex: { account },
    } = this.context
    return `https://${account}.vtexcommercestable.com.br/api/pricing/prices`
  }

  protected willSendRequest(request: RequestOptions) {
    const {
      vtex: { authToken, production, account },
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
      'Authorization': authToken,
      'Proxy-Authorization': authToken,
      'X-Vtex-Proxy-To': `http://${account}.vtexcommercestable.com.br`,
      ...(segment && { Cookie: `vtex_segment=${segment}` }),
    })
  }
}
