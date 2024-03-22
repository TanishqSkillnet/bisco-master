import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

import { quickQuoteDataObjectInput } from '../typings/custom'

export class SubmitQuickQuote extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('http://api.biscoind.jaalaa.net', context, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'x-vtex-use-https': 'true',
      },
    })
  }

  public quickQuote = (quickQuoteDataObjectInput: quickQuoteDataObjectInput) => {
    const URL = `/v1/web-touchpoint`
    return this.http
      .post(
        URL,
        quickQuoteDataObjectInput,
        {
          metric: 'jaala-quick-quote',
        }
      )
      .catch((e) => {
        throw new Error(e)
      })
  }
}
