import {
  ExternalClient,
  InstanceOptions,
  IOContext,
  RequestConfig,
  UserInputError,
} from '@vtex/api'
import { path } from 'ramda'

import { statusToError } from '../utils'

export class MasterData extends ExternalClient {
  public constructor(ctx: IOContext, options?: InstanceOptions) {
    super(`http://api.vtex.com/${ctx.account}/dataentities`, ctx, {
      ...options,
      headers: {
        ...(options && options.headers),
        ...{ Accept: 'application/vnd.vtex.ds.v10+json' },
        ...(ctx.adminUserAuthToken
          ? { VtexIdclientAutCookie: ctx.adminUserAuthToken }
          : null),
        ...(ctx.storeUserAuthToken
          ? { VtexIdclientAutCookie: ctx.storeUserAuthToken }
          : null),
      },
    })
  }

  public searchDocuments = async <T>(
    acronym: string,
    fields: string[],
    where: string,
    pagination: PaginationArgs,
    schema?: string
  ) => {
    const rowData = await this.getRaw<T[]>(MasterData.routes.search(acronym), {
      headers: paginationArgsToHeaders(pagination),
      metric: 'masterdata-searchDocuments',
      params: {
        _fields: generateFieldsArg(fields),
        _where: where,
        ...schema ? { _schema: schema } : null,
      },
    })
    const headerData = path(['headers'], rowData) as any
    const resourceHeader = path(['rest-content-range'], headerData)
    const pagingInfoSplit = (resourceHeader as string).split(' ')[1].split('/')
    return {
      data: path(['data'], rowData),
      pageInfo: {
        from: pagingInfoSplit && pagingInfoSplit.length > 0 ? pagingInfoSplit[0].split('-')[0] : 0,
        page: pagination ? pagination.page : 1,
        perPage: pagination ? pagination.pageSize : 0,
        to: pagingInfoSplit && pagingInfoSplit.length > 0 ? pagingInfoSplit[0].split('-')[1] : 0,
        total: pagingInfoSplit && pagingInfoSplit.length > 1 ? pagingInfoSplit[1] : 0,
      },
    }
  }

  protected getRaw = <T>(url: string, config?: RequestConfig) => {
    return this.http.getRaw<T>(url, config).catch(statusToError)
  }

  private static get routes() {
    return {
      search: (acronym: string) => `${acronym}/search`,
    }
  }
}

function paginationArgsToHeaders({ page, pageSize }: PaginationArgs) {
  if (page < 1) {
    throw new UserInputError('Smallest page value is 1')
  }

  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize

  return {
    'REST-Range': `resources=${startIndex}-${endIndex}`,
  }
}

function generateFieldsArg(fields: string[]) {
  return fields.join(',')
}

interface PaginationArgs {
  page: number
  pageSize: number
}
