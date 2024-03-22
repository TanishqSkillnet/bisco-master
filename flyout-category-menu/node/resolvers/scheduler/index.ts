export const SCHEDULER_NAME = 'biscoind-flyout-menu-synchronizer'

interface SchedulerArgs {
  treeLevel: number
  expression: string
  endDate: string
}

export const fieldResolvers = {
  Schedule: {
    nextExecution: (schedule: ViewSchedulerResponse) => schedule.NextExecution,
  },
}

export const queries = {
  viewSynchronizerSchedule: async (
    _: void,
    _args: void,
    ctx: Context
  ): Promise<ViewSchedulerResponse> => {
    const {
      clients: { scheduler },
    } = ctx

    return scheduler.viewCatalogSyncSchedule(SCHEDULER_NAME)
  },
}

export const mutations = {
  createSynchronizerSchedule: async (
    _: void,
    { treeLevel = 3, expression = '0 0 * * *', endDate = '2030-11-26T23:29:00' }: SchedulerArgs,
    ctx: Context
  ): Promise<CreateSchedulerResponse> => {
    const {
      clients: { scheduler },
      vtex: { workspace, account },
    } = ctx

    const schedulerData = {
      id: SCHEDULER_NAME,
      scheduler: {
        expression,
        endDate,
      },
      request: {
        method: 'POST',
        uri: `https://${workspace}--${account}.myvtex.com/_v/api/flyout-menu-tree/synchronize`,
        body: { treeLevel },
      },
    }

    return scheduler.createCatalogSyncSchedule(schedulerData)
  },
  deleteSynchronizerSchedule: async (_: void, _args: void, ctx: Context): Promise<boolean> => {
    const {
      clients: { scheduler },
    } = ctx

    await scheduler.deleteCatalogSyncSchedule(SCHEDULER_NAME)

    return true
  },
}
