import { CamelCaseBaseModel } from './CamelCaseBaseModel';
import { DateTime } from 'luxon'
import { column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Event from 'App/Models/Event'
import Teammate from 'App/Models/Teammate'

export default class Convocation extends CamelCaseBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public notes: string

  @column()
  public eventId: number

  @hasOne(() => Event, {
    foreignKey: 'eventId'
  })
  public event: HasOne<typeof Event>

  @column()
  public teammateId: number

  @hasOne(() => Teammate, {
    foreignKey: 'teammateId'
  })
  public teammate: HasOne<typeof Teammate>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
