import { FetchBasedService } from "../base/fetchBased.service";
import { browser } from "$app/environment";
import type { User } from "../users/user.service";
import type { Role } from "../roles/roles.service";
import type { Invitation } from "../invitations/invitations.service";

export type Teammate = {
  id: number,
  roleId?: number
  role?: Role,
  teamId: number
  uid?: string
  userId: number,
  user: User,
  alias?: string,
  createdAt: Date,
  updatedAt: Date,
}

export type Team = {
  id: number
  name: string,
  notes: string,
  ownerId?: number,
  invitations?: Invitation[],
  owner?: User,
  teammates: Teammate[]
  roles?: Role[],
  createdAt: Date,
  updatedAt: Date,
}

export type PaginatedTeams = {
  data: Team[],
  meta: PaginationData
}

export default class TeamsService extends FetchBasedService {
  constructor(params: {
    fetch: any
  }) {
    super({
      fetch: params.fetch,
    })
  }

  public async create(params: {
    name?: string,
    notes?: string
  }): Promise<Team> {
    if (!browser) throw new Error('only available in browser')
    if(!params.name) throw new Error('name must be defined')

    let response = await this.post({
      url: '/teams',
      body: params
    })

    return response
  }

  public async list(params?: {
    page?: number,
    perPage?: number
  }): Promise<PaginatedTeams> {
    if (!browser) throw new Error('only available in browser')
    if(!params) params = {
      page: 1,
      perPage: 300
    }
    if (!params.page) params.page = 1
    if (!params.perPage) params.perPage = 300

    let response = await this.get({
      url: '/teams',
      params: params
    })

    return response
  }

  public async show(params: {
    id: number
  }): Promise<Team> {
    let response = await this.get({
      url: '/teams/' + params.id
    })

    return response
  }

  public async update(params: {
    id: number,
    name?: string,
    notes?: string
  }): Promise<Team> {
    let response = await this.put({
      url: '/teams/' + params.id,
      body: params
    })

    return response
  }
}