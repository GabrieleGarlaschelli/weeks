import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersManager from 'App/managers/user.manager'

export default class UsersController {
  public async index({params}: HttpContextContract) {
    const manager = new UsersManager()
    return await manager.list({
      data: {
        page: params.page,
        perPage: params.perPage
      }
    })
  }

  public async store({ request }: HttpContextContract) {
    const manager = new UsersManager()
    return await manager.create({
      data: {
        email: request.body().email,
        password: request.body().password,
        name: request.body().name
      }
    })
  }

  public async show({ params }: HttpContextContract) {
    const manager = new UsersManager()
    return await manager.get({
      data: {
        id: params.id
      }
    })
  }

  public async update({ request, params }: HttpContextContract) {
    const manager = new UsersManager()
    return await manager.update({
      data: {
        id: params.id,
        email: request.input('email'),
        password: request.input('password'),
        name: request.input('name')
      }
    })
  }

  public async destroy({ }: HttpContextContract) { }
}
