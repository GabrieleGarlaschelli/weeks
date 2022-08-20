import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TeamsManager from "App/managers/teams.manager";

export default class TeamsController {
  public async index({ request }: HttpContextContract) {
    const manager = new TeamsManager()
    return await manager.list({
      data: {
        page: request.input('page'),
        perPage: request.input('perPage')
      }
    })
  }

  public async store({ request }: HttpContextContract) {
    const manager = new TeamsManager()
    return await manager.create({
      data: {
        name: request.body().name,
        notes: request.body().notes
      }
    })
  }

  public async show({ params }: HttpContextContract) {
    const manager = new TeamsManager()
    return await manager.get({
      data: {
        id: params.id
      }
    })
  }

  public async update({ request, params }: HttpContextContract) {
    const manager = new TeamsManager()
    return await manager.update({
      data: {
        id: params.id,
        name: request.input('name'),
        notes: request.input('notes')
      }
    })
  }

  public async destroy({ params }: HttpContextContract) {
    const manager = new TeamsManager()
    return await manager.destroy({
      data: {
        id: params.id,
      }
    })
  }

  public async removeUser({ params, request }: HttpContextContract) {
    const manager = new TeamsManager()
    return await manager.removeUser({
      data: {
        team: {
          id: params.id
        },
        user: request.input('user')
      }
    })
  }
}
