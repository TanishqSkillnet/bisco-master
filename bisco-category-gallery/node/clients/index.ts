import { IOClients } from '@vtex/api'
import { Catalog } from './catalog'
import SchedulerClient from './scheduler'

export class Clients extends IOClients {
  public get catalog() {
    return this.getOrSet('catalog', Catalog)
  }

  public get scheduler() {
    return this.getOrSet('scheduler', SchedulerClient)
  }
}
