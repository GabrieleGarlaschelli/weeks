import { FetchBasedService } from "../base/fetchBased.service";
import { browser } from "$app/env";

export type Team = {
  id: string
  name: string,
  notes: string,
  createdAt: Date
  updatedAt: Date
}

export default class TeamsService extends FetchBasedService {
  constructor(params: {
    fetch: any
  }) {
    super({
      fetch: params.fetch,
    })
  }

  async create(params: {
    name?: string,
    notes?: string
  }): Promise<Team> {
    if (browser) {
      if(!params.name) throw new Error('name must be defined')

      let response = await this.post({
        url: '/teams',
        body: params
      })

      console.log(response)
    }

    // @ts-ignore
    return {}
  }
}