import { FetchBasedService } from "../base/fetchBased.service";
import { browser } from "$app/environment";
import type { Team } from "$lib/services/teams/teams.service"
import type { User } from "$lib/services/users/user.service"
import type { Convocation } from "$lib/services/convocations/convocations.service";

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
  convocations: Convocation[],
  createdAt: Date,
  updatedAt: Date,
  createdBy: User
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
      team?: {
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
    },
    convocations: {
      teammateId: number
    }[]
  }): Promise<Event[]> {
    if (!browser) throw new Error('only available in browser')

    let response = await this.post({
      url: '/events',
      body: {
        event: params
      }
    })

    return response
  }

  public async copyWeek(params: {
    fromWeekNumber: number,
    fromWeekYear: number,
    toWeekNumber: number,
    toWeekYear: number,
    team: { id: number }
  }): Promise<Event[]> {
    let response = await this.post({
      url: '/events/copyWeek',
      body: params
    })

    return response.map((el: any) => {
      el.start = new Date(el.start)
      el.end = new Date(el.end)
      return el
    })
  }

  public async show(params: {
    id: number
  }): Promise<Event> {
    let response = await this.get({
      url: '/events/' + params.id
    })

    response.start = new Date(response.start)
    response.end = new Date(response.end)

    return response
  }

  public async update(params: {
    id: number,
    name?: string,
  }): Promise<Event> {
    let response = await this.put({
      url: '/events/' + params.id,
      body: params
    })

    return response
  }

  public async destroy(params: {
    id: number,
  }): Promise<void> {
    let response = await this.delete({
      url: '/events/' + params.id,
    })

    return response
  }
}