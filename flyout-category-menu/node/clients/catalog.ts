import { AppClient, InstanceOptions, IOContext, RequestConfig, SegmentData } from '@vtex/api'
import { stringify } from 'qs'
import VBaseClient from '../VBaseClient'

const inflightKey = ({ baseURL, url, params, headers }: RequestConfig) => {
  const segmentToken = headers['x-vtex-segment']
  const segmentQs = segmentToken ? `&segmentToken=${segmentToken}` : ''
  return (
    baseURL! + url! + stringify(params, { arrayFormat: 'repeat', addQueryPrefix: true }) + segmentQs
  )
}

/** Catalog API
 * Docs: https://documenter.getpostman.com/view/845/catalogsystem-102/Hs44
 */
export class Catalog extends AppClient {
  array: any = []
  public constructor(ctx: IOContext, opts?: InstanceOptions) {
    super('vtex.catalog-api-proxy', ctx, opts)
  }

  notFound =
    (fallback = {}) =>
    (error: any) => {
      if (error.response && error.response.status === 404) {
        return fallback
      }
      throw error
    }

  public categoriesfromvbase = async (locale?: string) => {
    //this.updateCategories()
    const vbase = VBaseClient(this.context, locale)

    const response: any = await vbase.getFile().catch(this.notFound())
    if (response.data) {
      const result = JSON.parse(response.data)
      return result.categories
    } else {
    }
    return []
  }

  public updateCategories = async (treeLevel: number) => {
    const vbase = VBaseClient(this.context)
    const cat = await this.categoriesx(treeLevel)
    console.log('---> Vbase updated with categories count : ' + cat.length)
    await vbase.saveFile({
      categories: cat,
    })
  }

  public categoriesx = (treeLevel: number) =>
    this.get<Category[]>(`/pub/category/tree/${treeLevel}/`, {
      metric: 'catalog-categories-tree',
    })

  public translateCategoryTree = async (targetLocale: string) => {
    const vbase = VBaseClient(this.context, targetLocale)

    let arr: any[] = []

    const response: any = await this.categoriesx(3)

    if (response) {
      this.recursiveIterate(response)
      arr = this.array
      const translatedRes = await Promise.all(
        arr.map((itm) => this.translateText(targetLocale, Object.values(itm).toString()))
      )
      arr = arr.map((itm, index) => {
        return {
          [Object.keys(itm)[0]]: translatedRes[index].response,
        }
      })
      await vbase.saveTranslatedFile(
        {
          categories: response,
        },
        arr
      )
    }
  }

  private recursiveIterate(response: any) {
    response.forEach((element: { children: any; hasChildren: boolean; id: any; name: any }) => {
      if (element.hasChildren) {
        this.recursiveIterate(element.children)
      }
      this.array.push({ [element.id]: element.name })
    })
  }

  private get = <T = any>(url: string, config: RequestConfig = {}) => {
    const segmentData: SegmentData | undefined = (this.context! as CustomIOContext).segment
    const { channel: salesChannel = '' } = segmentData || {}

    config.params = {
      ...config.params,
      ...(!!salesChannel && { sc: salesChannel }),
    }

    config.inflightKey = inflightKey

    return this.http.get<T>(`/proxy/catalog${url}`, config)
  }

  private translateText(targetLanguage: string, text: any): Promise<any> {
    try {
      const res = this.http.post(
        `http://main.d3fiq7syoyp0m1.amplifyapp.com/api/translate/21`,
        {
          targetLanguage,
          text,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Vtex-Use-Https': 'true',
          },
          metric: 'biscoind-translations',
        }
      )
      return res
    } catch (err) {
      return Promise.resolve('')
    }
  }
}
