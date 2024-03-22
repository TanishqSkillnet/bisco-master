import { resolvers as categoryResolvers } from './category'

export const fieldResolvers = {
  ...categoryResolvers,
}

export const queries = {
  categoriesTree: async (
    _: any,
    { treeLevel, locale }: { treeLevel: number; locale: string },
    { clients: { catalog } }: Context
  ) => {
    console.log(treeLevel)
    return catalog.categoriesfromvbase(locale)
  },
}

export const mutations = {
  updateVbaseCategoryTree: async (
    _: any,
    { treeLevel }: { treeLevel: number },
    { clients: { catalog } }: Context
  ) => {
    console.log(treeLevel)
    await catalog.updateCategories(treeLevel)
  },

  translateVbaseCategoryTree: async (
    _: any,
    { targetLocal }: { targetLocal: string },
    { clients: { catalog } }: Context
  ) => {
    await catalog.translateCategoryTree(targetLocal)
  },
}
