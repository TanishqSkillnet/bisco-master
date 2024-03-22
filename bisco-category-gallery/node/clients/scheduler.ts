import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

const routes = {
  scheduler: (workspace: string, account: string) =>
    `/api/scheduler/${workspace}/${account}?version=4`,
  getSchedule: (workspace: string, account: string, id: string) =>
    `/api/scheduler/${workspace}/${account}/${id}?version=4`,
}

export default class SchedulerClient extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...options?.headers,
        VtexIdclientAutCookie: ctx.authToken,
      },
    })
  }

  public createCatalogSyncSchedule = (
    schedulerData: CreateSchedulerArgs
  ): Promise<CreateSchedulerResponse> => {
    return this.http.post(
      routes.scheduler(this.context.workspace, this.context.account),
      schedulerData,
      { metric: 'category-tree-update-scheduler-create-schedule' }
    )
  }

  public viewCatalogSyncSchedule = async (
    id: string
  ): Promise<ViewSchedulerResponse> => {
    return this.http.get(
      routes.getSchedule(this.context.workspace, this.context.account, id),
      { metric: 'category-tree-update-scheduler-view-schedule' }
    )
  }

  public deleteCatalogSyncSchedule = async (id: string) => {
    return this.http.delete(
      routes.getSchedule(this.context.workspace, this.context.account, id),
      { metric: 'category-tree-update-scheduler-delete-schedule' }
    )
  }
}
