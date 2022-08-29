import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import UserModel from 'App/Models/User'
import ConvocationModel from 'App/Models/Convocation'
import type Convocation from 'App/Models/Convocation'
import AuthorizationManager from './authorization.manager'
import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { ConvocateValidator } from 'App/Validators/convocations'
import { validator } from "@ioc:Adonis/Core/Validator"

export type Context = {
  user?: {
    id: number
  },
  trx?: TransactionClientContract
}

export type ConvocateParams = {
  data: {
    teammates: {
      id: number
    }[],
    event: {
      id: number
    },
    notes?: string
  },
  context?: Context
}

export default class ConvocationManager {
  constructor() {
  }

  public async convocate(params: ConvocateParams): Promise<Convocation[]> {
    const user = await this._getUserFromContext(params.context)
    if (!user) throw new Error('user must be defined to convocate to an event')

    let trx = params.context?.trx
    if (!trx) trx = await Database.transaction()

    try {
      await AuthorizationManager.canOrFail({
        data: {
          actor: user,
          action: 'convocate',
          resource: 'Event',
          entities: {
            event: {
              id: params.data.event.id
            }
          }
        },
        context: {
          trx: trx
        }
      })

      await validator.validate({
        schema: new ConvocateValidator().schema,
        data: params.data
      })

      let convocations = await ConvocationModel.createMany(params.data.teammates.map((teammate) => {
        return {
          teammateId: teammate.id,
          eventId: params.data.event.id,
          notes: params.data.notes    
        }
      }), {
        client: trx
      })

      if (!params.context?.trx) await trx.commit()
      return convocations
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