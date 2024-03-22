import { InstanceOptions, IOContext, ExternalClient } from '@vtex/api'

export class GoogleTranslate extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('', context, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public translateText(targetLanguage: string, text: string): Promise<any> {
    return this.http.post(
      `http://main.d3fiq7syoyp0m1.amplifyapp.com/api/translate/213`,
      {
        targetLanguage,
        text,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        metric: 'biscoind-translations',
        timeout: 3000,
      }
    )
  }
}
