import { json } from 'co-body'

export async function synchronizeCategoryTree(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { catalog: catalogClient },
  } = ctx

  const body = await json(ctx.req)
  await catalogClient.updateCategories(body.treeLevel ?? 3)

  ctx.status = 200
  await next()
}
