import { resolvers as categoryResolvers } from './category'

export const fieldResolvers = {
  ...categoryResolvers
}

export const queries = {
  categoriesTree: async (
    _: any,
    { treeLevel }: { treeLevel: number },
    { clients: { catalog } }: Context
  ) => {
    console.log(treeLevel)
    return catalog.categoriesfromvbase()
  }
}

export const mutations = {
  updateVbaseCategoryTree: async (
    _: any,
    { treeLevel }: { treeLevel: number },
    { clients: { catalog } }: Context
  ) => {
    console.log(treeLevel)
    await catalog.updateCategories(treeLevel)
  }
}