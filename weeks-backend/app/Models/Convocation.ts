import { DateTime } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Event from 'App/Models/Event'
import Teammate from 'App/Models/Teammate'

export default class Convocation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public notes: string

  @hasOne(() => Event, {
    foreignKey: 'eventId'
  })
  public event: HasOne<typeof Event>

  @hasOne(() => Teammate, {
    foreignKey: 'teamId'
  })
  public teammate: HasOne<typeof Teammate>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
