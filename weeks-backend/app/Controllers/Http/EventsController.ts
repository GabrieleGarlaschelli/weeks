import { DateTime } from 'luxon';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import EventsManager from 'App/managers/events.manager'

export default class EventsController {
  public async index({ request }: HttpContextContract) {
    const filters = request.input('filters')

    const manager = new EventsManager()
    return await manager.list({
      data: {
        filters: filters
      }
    })
  }

  public async store({ request }: HttpContextContract) {
    const event = request.input('event')
    
    const manager = new EventsManager()
    return await manager.create({
      data: event
    })
  }

  public async createWithFrequency({ request }: HttpContextContract) {
    const event = request.input('event')
    const rule = request.input('rule')

    if (!!event?.start) event.start = DateTime.fromISO(event.start)
    if (!!event?.end) event.end = DateTime.fromISO(event.end)

    if (!!rule?.from) rule.from = DateTime.fromISO(rule.from)
    if (!!rule?.to) rule.to = DateTime.fromISO(rule.to)

    const manager = new EventsManager()
    return await manager.createWithFrequency({
      data: {
        event: event,
        rule: rule
      }
    })
  }

  public async update({ request, params }: HttpContextContract) {
    const data = request.body()

    const manager = new EventsManager()
    return await manager.update({
      data: {
        id: params.id,
        ...data
      }
    })
  }

  public async show({ params }: HttpContextContract) {
    const manager = new EventsManager()
    return await manager.get({
      data: {
        id: params.id,
      }
    })
  }

  public async destroy({ params, request }: HttpContextContract) {
    const manager = new EventsManager()
    return await manager.delete({
      data: {
        id: params.id,
        deleteAllFrequency: request.input('deleteAllFrequency')  
      }
    })
  }
}
