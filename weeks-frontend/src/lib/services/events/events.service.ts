import { FetchBasedService } from "../base/fetchBased.service";
import { browser } from "$app/env";
import type { Team } from "$lib/services/teams/teams.service"

export type Event = {
  id: number,
  start: Date,
  end: Date,
  name: string,
  description: string,
  status: 'confirmed' | 'notConfirmed',
  frequencyId: number,
  teamId: number,
  team: Team,
  createdAt: Date,
  updatedAt: Date,
}

export default class EventsService extends FetchBasedService {
  constructor(params: {
    fetch: any
  }) {
    super({
      fetch: params.fetch,
    })
  }

  public async list(params: {
    filters: { 
      from: Date,
      to: Date,
      team: {
        id: number
      }
    },
  }): Promise<Event[]> {
    if (!browser) throw new Error('only available in browser')

    let response = await this.get({
      url: '/events',
      params: params
    })

    return response.map((el: any) => {
      el.start = new Date(el.start)
      el.end = new Date(el.end)
      return el
    })
  }

  public async create(params: {
    start: Date,
    end: Date,
    name: string,
    description?: string
    team: {
      id: number
    }
  }): Promise<Event[]> {
    if (!browser) throw new Error('only available in browser')
    console.log(params)

    let response = await this.post({
      url: '/events',
      body: {
        event: params
      }
    })

    return response
  }
}