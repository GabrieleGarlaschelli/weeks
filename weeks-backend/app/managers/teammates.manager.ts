import Database, { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { SetRoleValidator } from 'App/Validators/teammates'
import { validator } from "@ioc:Adonis/Core/Validator"


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

export type InviteUserParams = {
  data: {
    user: {
      email: string
    }
  },
  context?: Context
}

export default class TeammatesManager {
  constructor() {
  }

  public async setRole(params: SetRoleParams): Promise<void> {
    let trx = params.context?.trx
    if (!trx) trx = await Database.transaction()

    try {
      await validator.validate({
        schema: new SetRoleValidator().schema,
        data: {
          ...params.data
        }
      })

      if (!params.context?.trx) await trx.commit()
    } catch (error) {
      if (!params.context?.trx) trx.rollback()
      throw error
    }
  }
}