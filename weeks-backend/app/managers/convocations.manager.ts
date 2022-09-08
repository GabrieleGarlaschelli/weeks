import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import UserModel from 'App/Models/User'
import ConvocationModel from 'App/Models/Convocation'
import type Convocation from 'App/Models/Convocation'
import AuthorizationManager from './authorization.manager'
import HttpContext from '@ioc:Adonis/Core/HttpContext'
import { ConvocateValidator } from 'App/Validators/convocations'
import { validator } from "@ioc:Adonis/Core/Validator"
import { DateTime } from 'luxon'

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

export type ConfirmParams = {
  data: {
    teammate?: {
      id: number
    },
    event?: {
      id: number
    },
    convocation?: {
      id: number
    },
  },
  context?: Context
}

export default class ConvocationsManager {
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
        let confirmationStatus: 'pending' = 'pending' 
        return {
          teammateId: teammate.id,
          eventId: params.data.event.id,
          notes: params.data.notes,
          confirmationStatus: confirmationStatus
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


  public async confirm(params: ConfirmParams): Promise<Convocation> {
    const user = await this._getUserFromContext(params.context)
    if (!user) throw new Error('user must be defined to confirm convocation')
    else if (!params.data.convocation && (!params.data.teammate || !params.data.event)) 
      throw new Error('convocation or teammate and event are not specified')

    let trx = params.context?.trx
    if (!trx) trx = await Database.transaction()

    try {
      let convocation: Convocation
      if(!!params.data.convocation) {
        convocation = await ConvocationModel.query({
          client: trx
        })
        .where('id', params.data.convocation.id)
        .firstOrFail()
      } else if(!!params.data.teammate && !!params.data.event) {
        convocation = await ConvocationModel.query({
            client: trx
          })
          .where('teammateId', params.data.teammate.id)
          .where('eventId', params.data.event.id)
          .firstOrFail()
      } else {
        throw new Error('params not specified')
      }

      await AuthorizationManager.canOrFail({
        data: {
          actor: user,
          action: 'confirm',
          resource: 'Convocation',
          entities: {
            convocation: convocation
          }
        },
        context: {
          trx: trx
        }
      })

      convocation.confirmationStatus = 'confirmed'
      convocation.confirmedByUserId = user.id
      convocation.updateConfirmationAt = DateTime.now()
      let results = await convocation.save()

      if (!params.context?.trx) await trx.commit()
      return results
    } catch (error) {
      if (!params.context?.trx) await trx.rollback()
      throw error
    }
  }

  public async deny(params: ConfirmParams): Promise<Convocation> {
    const user = await this._getUserFromContext(params.context)
    if (!user) throw new Error('user must be defined to confirm convocation')
    else if (!params.data.convocation && (!params.data.teammate || !params.data.event))
      throw new Error('convocation or teammate and event are not specified')

    let trx = params.context?.trx
    if (!trx) trx = await Database.transaction()

    try {
      let convocation: Convocation
      if (!!params.data.convocation) {
        convocation = await ConvocationModel.query({
          client: trx
        })
          .where('id', params.data.convocation.id)
          .firstOrFail()
      } else if (!!params.data.teammate && !!params.data.event) {
        convocation = await ConvocationModel.query({
          client: trx
        })
          .where('teammateId', params.data.teammate.id)
          .where('eventId', params.data.event.id)
          .firstOrFail()
      } else {
        throw new Error('params not specified')
      }

      await AuthorizationManager.canOrFail({
        data: {
          actor: user,
          action: 'deny',
          resource: 'Convocation',
          entities: {
            convocation: convocation
          }
        },
        context: {
          trx: trx
        }
      })

      convocation.confirmationStatus = 'denied'
      convocation.confirmedByUserId = user.id
      convocation.updateConfirmationAt = DateTime.now()
      let results = await convocation.save()

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