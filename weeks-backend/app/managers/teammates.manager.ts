import UserModel from 'App/Models/User';
import TeammateModel from 'App/Models/Teammate';
import type Teammate from 'App/Models/Teammate';
import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { UpdateValidator } from 'App/Validators/teammates'
import { validator } from "@ioc:Adonis/Core/Validator"
import AuthorizationManager from './authorization.manager'
import HttpContext from '@ioc:Adonis/Core/HttpContext'

export type Context = {
  user?: {
    id: number
  },
  trx?: TransactionClientContract
}

export type SetRoleParams = {
  data: {
    role: {
      id: number
    }
  },
  context?: Context
}

export type UpdateParams = {
  data: {
    id: number,
    alias?: string,
    roleId?: number
  },
  context?: Context
}

export default class TeammatesManager {
  constructor() {
  }

  public async update(params: UpdateParams): Promise<Teammate> {
    const user = await this._getUserFromContext(params.context)
    if (!user) throw new Error('user must be defined to update a teammate')

    let trx = params.context?.trx
    if (!trx) trx = await Database.transaction()

    try {
      await validator.validate({
        schema: new UpdateValidator().schema,
        data: {
          ...params.data
        }
      })

      await AuthorizationManager.canOrFail({
        data: {
          actor: user,
          action: 'update',
          resource: 'Teammate',
          entities: {
            teammate: {
              id: params.data.id
            }
          }
        }
      })

      let teammate = await TeammateModel.query({ client: trx })
        .where('id', params.data.id)
        .firstOrFail()

      teammate.merge({
        alias: params.data.alias,
        roleId: params.data.roleId
      })

      let results = await teammate.save()
      if (!params.context?.trx) await trx.commit()
      return results
    } catch (error) {
      if (!params.context?.trx) await trx.rollback()
      throw error
    }
  }

  private async _getUserFromContext(context?: Context) {
    if (!!context?.user) {
      return await UserModel.query().where('id', context.user.id).first()
    } else {
      const ctx = HttpContext.get()
      return ctx?.auth?.user
    }
  }
}