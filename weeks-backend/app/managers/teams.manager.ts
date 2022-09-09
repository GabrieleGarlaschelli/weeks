import { DateTime } from 'luxon';
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { CreateTeamValidator, UpdateTeamValidator } from 'App/Validators/teams'
import { validator } from "@ioc:Adonis/Core/Validator"
import TeamModel from 'App/Models/Team'
import UserModel from 'App/Models/User'
import TeammateModel from 'App/Models/Teammate';
import type Team from 'App/Models/Team'
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';
import HttpContext from '@ioc:Adonis/Core/HttpContext'
import AuthorizationManager from './authorization.manager';

export type Context = {
  user?: {
    id: number
  },
  trx?: TransactionClientContract
}

export type CreateParams = {
  data: {
    name: string,
    notes: string,
  },
  context?: Context
}

export type UpdateParams = {
  data: {
    id: number,
    name?: string,
    notes?: string,
  },
  context?: Context
}

export type AddUserParams = {
  data: {
    team: {
      id: number
    }
    user: {
      id: number
    },
    role?: {
      id: number
    }
  },
  context?: Context
}

export type ListParams = {
  data: {
    page?: number,
    perPage?: number
  },
  context?: Context
}

export type GetParams = {
  data: {
    id: number
  },
  context?: Context
}

export type DestroyParams = {
  data: {
    id: number
  },
  context?: Context
}

export default class TeamsManager {
  constructor() {
  }

  public async list(params: ListParams): Promise<{ data: ModelObject[], meta: any }> {
    if (!params.data.page) params.data.page = 1
    if (!params.data.perPage) params.data.perPage = 100

    const user = await this._getUserFromContext(params.context)
    let query = TeamModel
      .query()

    if(!!user) {
      query = query.whereHas('teammates', (teammateQuery) => {
        teammateQuery.whereHas('user', (userQuery) => {
          userQuery.where('id', user.id)
        })
      })
    }

    const results = await query
      .preload('teammates', (teammateQuery) => {
        teammateQuery.preload('user')
      })
      .preload('roles')
      .paginate(params.data.page, params.data.perPage)

    return results.toJSON()
  }

  public async create(params: CreateParams): Promise<Team> {
    const user = await this._getUserFromContext(params.context)
    if(!user) throw new Error('user must be defined to create team')

    let trx = params.context?.trx
    if (!trx) trx = await Database.transaction()

    try {
      await validator.validate({
        schema: new CreateTeamValidator().schema,
        data: {
          ...params.data,
          owner: {
            id: user.id
          }
        }
      })

      const createdTeam = await TeamModel.create(params.data, {
        client: trx
      })

      await createdTeam.related('owner').associate(user)

      await TeammateModel.create({
        userId: user.id,
        teamId: createdTeam.id
      }, {
        client: trx
      })

      if (!params.context?.trx) await trx.commit()
      return createdTeam
    } catch(error) {
      if (!params.context?.trx) await trx.rollback()
      throw error
    }
  }

  public async get(params: GetParams): Promise<ModelObject> {
    const user = await this._getUserFromContext(params.context)
    if (!user) throw new Error('user must be update a team')

    let query = TeamModel
      .query({
        client: params.context?.trx
      });

    await AuthorizationManager.canOrFail({
      data: {
        actor: user,
        action: 'view',
        resource: 'Team',
        entities: {
          team: {
            id: params.data.id
          }
        }
      }
    })

    const results = await query
      .preload('teammates', (teammateQuery) => {
        teammateQuery.preload('user').preload('role')
      })
      .preload('owner')
      .preload('roles')
      .preload('invitations', (invitationBuilder) => {
        invitationBuilder
          .where('status', 'pending')
          .preload('invitedBy')
          .preload('invite')
          .preload('role')
      })
      .where('id', params.data.id)

    return results[0]
  }

  public async update(params: UpdateParams): Promise<Team> {
    const user = await this._getUserFromContext(params.context)
    if (!user) throw new Error('user must be update a team')

    let trx = params.context?.trx
    if (!trx) trx = await Database.transaction()

    try {
      await AuthorizationManager.canOrFail({
        data: {
          actor: user,
          action: 'update',
          resource: 'Team',
          entities: {
            team: {
              id: params.data.id
            }
          }
        },
        context: {
          trx: trx
        }
      })

      await validator.validate({
        schema: new UpdateTeamValidator().schema,
        data: params.data
      })

      const team = await TeamModel.findOrFail(params.data.id, {
        client: trx
      })

      team.merge({
        name: params.data.name,
        notes: params.data.notes
      })

      const results = await team.save()
      if (!params.context?.trx) await trx.commit()
      return results
    } catch(error) {
      if (!params.context?.trx) await trx.rollback()
      throw error
    }
  }

  public async addUser(params: AddUserParams): Promise<void> {
    const user = await this._getUserFromContext(params.context)
    if (!user) throw new Error('user must be defined to add user to a team')

    let trx = params.context?.trx
    if (!trx) trx = await Database.transaction()

    try {
      if (!params.data.team || !params.data.team.id) throw new Error('team must be defined')
      if (!params.data.user || !params.data.user.id) throw new Error('user must be defined')

      let existingTeammates = await TeammateModel.query({
          client: trx
        }).where('teamId', params.data.team.id)
        .where('userId', params.data.user.id)

      if(existingTeammates.length != 0) return

      const team = await TeamModel.findOrFail(params.data.team.id, {
        client: trx
      })

      await team.related('teammateUsers').attach({
        [params.data.user.id]: {
          roleId: params.data.role?.id,
          createdAt: DateTime.now(),
          updatedAt: DateTime.now(),
        }
      })

      if (!params.context?.trx) await trx.commit()
    } catch (error) {
      if (!params.context?.trx) await trx.rollback()
      throw error
    }
  }

  public async removeUser(params: AddUserParams): Promise<void> {
    const user = await this._getUserFromContext(params.context)
    if (!user) throw new Error('user must be defined to remove user from a team')

    let trx = params.context?.trx
    if (!trx) trx = await Database.transaction()

    try {
      if (!params.data.team || !params.data.team.id) throw new Error('team must be defined')
      if (!params.data.user || !params.data.user.id) throw new Error('user must be defined')

      await AuthorizationManager.canOrFail({
        data: {
          actor: user,
          action: 'removeUser',
          resource: 'Team',
          entities: {
            team: {
              id: params.data.team.id
            }
          }
        },
        context: {
          trx: trx
        }
      })

      const teammate = await TeammateModel.query({ client: trx })
        .where('userId', params.data.user.id)
        .where('teamId', params.data.team.id)
        .firstOrFail()

      await teammate.delete()
      if (!params.context?.trx) await trx.commit()
    } catch (error) {
      if (!params.context?.trx) await trx.rollback()
      throw error
    }
  }

  public async destroy(params: DestroyParams): Promise<void> {
    const user = await this._getUserFromContext(params.context)
    if (!user) throw new Error('user must be defined to destroy a team')

    let trx = params.context?.trx
    if (!trx) trx = await Database.transaction()

    try {
      await AuthorizationManager.canOrFail({
        data: {
          actor: user,
          action: 'destroy',
          resource: 'Team',
          entities: {
            team: {
              id: params.data.id
            }
          }
        },
        context: {
          trx: trx
        }
      })

      const results = await TeamModel.query({ client: trx }).where('id', params.data.id)
      
      await results[0].delete()
      if (!params.context?.trx) await trx.commit()
    } catch (error) {
      if (!params.context?.trx) await trx.rollback()
      throw error
    }
  }

  public async userBelogsToTeam(params: {
    data: {
      team: { id: number }
      user: { id: number }
    },
    context?: Context
  }) {
    if (!params.data.team || !params.data.team.id) throw new Error('team must be defined')
    if (!params.data.user || !params.data.user.id) throw new Error('user must be defined')

    const userBelongs = await UserModel.query({
        client: params.context?.trx
      })
      .whereHas('teams', (builder) => {
        builder.where('teams.id', params.data.team.id)
      })
      .where('users.id', params.data.user.id)

    return userBelongs.length != 0
  }

  private async _getUserFromContext(context?: Context) {
    if(!!context?.user) {
      return await UserModel.query().where('id', context.user.id).first()
    } else {
      const ctx = HttpContext.get()
      return ctx?.auth?.user
    }
  }
}