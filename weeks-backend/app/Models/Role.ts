import { CamelCaseBaseModel } from './CamelCaseBaseModel'
import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'

export default class Role extends CamelCaseBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public cans: Object

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
