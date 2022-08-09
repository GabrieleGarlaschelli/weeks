import { CreateUserValidator, UpdateUserValidator } from 'App/Validators/users'
import { validator } from "@ioc:Adonis/Core/Validator"
import UserModel from 'App/Models/User';

import type User from 'App/Models/User'
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export type CreateParams = {
  data: {
    email: string,
    password: string,
    name: string
  },
  context?: {}
}

export type UpdateParams = {
  data: {
    id?: number,
    email?: string,
    password?: string,
    name?: string
  },
  context?: {}
}

export type ListParams = {
  data: {
    page?: number,
    perPage?: number
  },
  context?: {}
}

export type GetParams = {
  data: {
    id: number
  },
  context?: {}
}

class UsersManager {
  constructor() {
  }

  public async list(params: ListParams): Promise<{data: ModelObject[], meta: any}> {
    if(!params.data.page) params.data.page = 1
    if(!params.data.perPage) params.data.perPage = 100

    const results = await UserModel.query().paginate(params.data.page, params.data.perPage)
    return results.toJSON()
  } 

  public async create(params: CreateParams): Promise<User> {
    await validator.validate({
      schema: new CreateUserValidator().schema,
      data: params.data
    })

    return await UserModel.firstOrCreate({
      email: params.data.email
    }, params.data)
  }

  public async get(params: GetParams): Promise<User | null> {
    return await UserModel.find(params.data.id)
  }

  public async update(params: UpdateParams): Promise<User> {
    const id = params.data.id
    delete params.data.id

    await validator.validate({
      schema: new UpdateUserValidator().schema,
      data: params.data
    })

    let user = await UserModel.findOrFail(id)
    user.merge({
      email: params.data.email,
      password: params.data.password
    })
    return await user.save()
  }
}

export default UsersManager