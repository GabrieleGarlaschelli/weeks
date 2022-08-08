import { CamelCaseBaseModel } from './CamelCaseBaseModel'
import { DateTime } from 'luxon'
import { column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Frequency from 'App/Models/Frequency'
import Team from 'App/Models/Team'

export default class Event extends CamelCaseBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime()
  public start: DateTime

  @column.dateTime()
  public end: DateTime

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public status: 'confirmed' | 'notConfirmed'

  @column()
  public type: 'training' | 'planning'

  @hasOne(() => Frequency, {
    foreignKey: 'frequencyId'
  })
  public role: HasOne<typeof Frequency>

  @hasOne(() => Team, {
    foreignKey: 'teamId'
  })
  public team: HasOne<typeof Team>


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
