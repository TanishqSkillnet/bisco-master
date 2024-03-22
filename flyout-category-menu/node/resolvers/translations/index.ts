interface translateArgs {
  targetLanguage: string
  text: string
}

export const mutations = {
  googleTranslation: async (
    _: void,
    { targetLanguage, text }: translateArgs,
    ctx: Context
  ): Promise<string> => {
    const {
      clients: { translations },
    } = ctx

    const { response } = await translations.translateText(targetLanguage, text)
    return response
  },
}
