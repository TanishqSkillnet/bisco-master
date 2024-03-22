import {
  AppClient,
  InstanceOptions,
  IOContext,
  RequestConfig,
  SegmentData,
} from '@vtex/api'
import { stringify } from 'qs'
import VBaseClient from '../VBaseClient'

const inflightKey = ({ baseURL, url, params, headers }: RequestConfig) => {
  const segmentToken = headers['x-vtex-segment']
  const segmentQs = segmentToken ? `&segmentToken=${segmentToken}` : ''
  return (
    baseURL! +
    url! +
    stringify(params, { arrayFormat: 'repeat', addQueryPrefix: true }) +
    segmentQs
  )
}

/** Catalog API
 * Docs: https://documenter.getpostman.com/view/845/catalogsystem-102/Hs44
 */
export class Catalog extends AppClient {
  public constructor(ctx: IOContext, opts?: InstanceOptions) {
    super('vtex.catalog-api-proxy@0.x', ctx, opts)
  }

  notFound = (fallback = {}) => (error: any) => {
    if (error.response && error.response.status === 404) {
      return fallback
    }
    throw error
  }

  public categoriesfromvbase = async () => {
    //this.updateCategories()
    const vbase = VBaseClient(this.context)
    
    const response : any = await vbase.getFile().catch(this.notFound())
    if (response.data) {
      const result = JSON.parse(response.data)
      return result.categories
    }else {
    }
    return []
  }

  public updateCategories = async (treeLevel: number) => {
    const vbase = VBaseClient(this.context)
    const cat = await this.categoriesx(treeLevel)
    await vbase.saveFile({
      categories: cat
    })
  }

  public categoriesx = (treeLevel: number) => 
    this.get<Category[]>(`/pub/category/tree/${treeLevel}/`, {
      metric: 'catalog-categories-tree',
    })

  private get = <T = any>(url: string, config: RequestConfig = {}) => {
    const segmentData: SegmentData | undefined = (this
      .context! as CustomIOContext).segment
    const { channel: salesChannel = '' } = segmentData || {}

    config.params = {
      ...config.params,
      ...(!!salesChannel && { sc: salesChannel }),
    }

    config.inflightKey = inflightKey

    return this.http.get<T>(`/proxy/catalog${url}`, config)
  }
}
