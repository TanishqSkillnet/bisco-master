import { IOClients } from '@vtex/api'
import {SubmitQuickQuote} from './submitQuickQuote'

export class Clients extends IOClients {

  public get quickQuote() {
    return this.getOrSet('quickQuote', SubmitQuickQuote)
  }
}
