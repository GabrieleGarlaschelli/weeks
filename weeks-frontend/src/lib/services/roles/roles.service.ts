import { FetchBasedService } from "../base/fetchBased.service";
import { browser } from "$app/env";

export type Role = {
  id: number,
  name: string,
  cans?: any,
  createdAt: Date,
  updatedAt: Date
}

export type PaginatedRoles = {
  data: Role[],
  meta: PaginationData
}

export default class RolesService extends FetchBasedService {
  constructor(params: {
    fetch: any
  }) {
    super({
      fetch: params.fetch,
    })
  }

  public async create(params: {
    name?: string,
    cans?: any
  }): Promise<Role> {
    if (!browser) throw new Error('only available in browser')
    if (!params.name) throw new Error('name must be defined')

    let response = await this.post({
      url: '/roles',
      body: params
    })

    return response
  }

  public async list(params: {
    page?: number,
    perPage?: number,
    team: {
      id: number
    }
  }): Promise<PaginatedRoles> {
    if (!browser) throw new Error('only available in browser')
    if (!params.team || !params.team.id) throw new Error('team must be defined')
    if (!params.page) params.page = 1
    if (!params.perPage) params.perPage = 300

    let response = await this.get({
      url: `/teams/${params.team.id}/roles`,
      params: params
    })

    return response
  }

  public async show(params: {
    id: number
  }): Promise<Role> {
    let response = await this.get({
      url: '/roles/' + params.id
    })

    return response
  }

  public async update(params: {
    id: number,
    name?: string,
  }): Promise<Role> {
    let response = await this.put({
      url: '/roles/' + params.id,
      body: params
    })

    return response
  }

  public async destroy(params: {
    id: number,
  }): Promise<void> {
    let response = await this.delete({
      url: '/roles/' + params.id,
    })

    return response
  }
}