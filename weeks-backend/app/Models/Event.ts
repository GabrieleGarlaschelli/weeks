import { CamelCaseBaseModel } from './CamelCaseBaseModel'
import { DateTime } from 'luxon'
import { column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Frequency from 'App/Models/Frequency'
import Team from 'App/Models/Team'
import User from 'App/Models/User'

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
  public frequencyId: number

  @belongsTo(() => Frequency, {
    foreignKey: 'frequencyId'
  })
  public frequency: BelongsTo<typeof Frequency>

  @column()
  public teamId: number

  @belongsTo(() => Team, {
    foreignKey: 'teamId'
  })
  public team: BelongsTo<typeof Team>

  @column()
  public createdByUserId: number

  @belongsTo(() => User, {
    foreignKey: 'createdByUserId'
  })
  public createdBy: BelongsTo<typeof User>


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
