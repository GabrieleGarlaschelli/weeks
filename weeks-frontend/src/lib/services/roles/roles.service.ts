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

export const resources = ['Team', 'Invitation', 'Event', 'Convocation', 'EventSession', 'Role']
export type Resource =
  'Team' |
  'Invitation' |
  'Event' |
  'Convocation' |
  'EventSession' |
  'Role'

export const actionsForResources: {[key: string]: string[]} = {
  'Team': ['update', 'invite', 'removeUser', 'destroy'],
  'Event': [ 'create', 'update', 'destroy' ],
  'Role': [ 'update' ]
}

export type Action =
  'update' |
  'destroy' |
  'create' |
  'view' |
  'invite' |
  'removeUser' |
  'accept' |
  'reject' |
  'discard'

export type RoleCans = {
  [key: string]: {
    [key: string]: boolean
  }
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
    cans?: RoleCans
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

  public static getActionsForResource(resource: string): string[] {
    return actionsForResources[resource]
  }

  public static translateResource(resource: string): string {
    let translationMapping: {
      [key: string]: string
    } = {
      'Team': 'Team',
      'Invitation': 'Inviti',
      'Event': 'Eventi',
      'Convocation': 'Convocazioni',
      'EventSession': 'Sessioni',
      'Role': 'Ruoli'
    }
    return translationMapping[resource]
  }

  public static translateActions(action: string): string {
    let translationMapping: {
      [key: string]: string
    } = {
      'update': 'Modificare',
      'destroy': 'Eliminare',
      'create': 'Creare',
      'view': 'Visualizzare',
      'invite': 'Invitare',
      'removeUser': 'Rimuovere utenti',
      'accept': 'Accettare',
      'reject': 'Rifiutare',
      'discard': 'Annullare'
    }
    return translationMapping[action]
  }
}