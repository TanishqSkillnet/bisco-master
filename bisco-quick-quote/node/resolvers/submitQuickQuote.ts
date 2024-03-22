import type { quickQuoteDataObjectInput } from '../typings/custom'

interface Args {
  dataObject: quickQuoteDataObjectInput
}

export const submitQuickQuote = async (
  _: any,
  { dataObject }: Args,
  ctx: any
) => {
  const {
    clients: { quickQuote },
  } = ctx
  try {
    const quickQuoteResponse = await quickQuote.quickQuote(dataObject)
    console.log(quickQuoteResponse)
    return {submitQuickQuoteResponse: true}
  } catch (e) {
    return {submitQuickQuoteResponse: false}
  }
}
