import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { CreateTeamValidator, UpdateTeamValidator } from 'App/Validators/teams'
import { validator } from "@ioc:Adonis/Core/Validator"
import TeamModel from 'App/Models/Team'
import UserModel from 'App/Models/User';
import TeammateModel from 'App/Models/Teammate';
import type Team from 'App/Models/Team'
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';
import HttpContext from '@ioc:Adonis/Core/HttpContext'

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

class TeamsManager {
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
    let query = TeamModel
      .query({
        client: params.context?.trx
      });

    if (!!user) {
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

    return results[0]
  }

  public async update(params: UpdateParams): Promise<Team> {
    const user = await this._getUserFromContext(params.context)
    if (!user) throw new Error('user must be update a team')

    let trx = params.context?.trx
    if (!trx) trx = await Database.transaction()

    try {
      if (!!user) {
        const userBelongs = await this.userBelogsToTeam({
          data: {
            user: user, team: { id: params.data.id }
          },
          context: {
            trx: trx
          }
        })

        if(!userBelongs) throw new Error('user does not belongs to the team')
      }

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

  public async destroy(params: DestroyParams): Promise<void> {
    const user = await this._getUserFromContext(params.context)

    let trx = params.context?.trx
    if (!trx) trx = await Database.transaction()

    try {
      await validator.validate({
        schema: new UpdateTeamValidator().schema,
        data: params.data
      })

      let query = TeamModel.query()

      if (!!user) {
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

export default TeamsManager