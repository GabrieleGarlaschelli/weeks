import { CamelCaseBaseModel } from './CamelCaseBaseModel'
import { DateTime } from 'luxon'
import { column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Team from 'App/Models/Team'
import Role from 'App/Models/Role'

export default class Invitation extends CamelCaseBaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasOne(() => User, {
    foreignKey: 'invitedByUserId'
  })
  public invitedBy: HasOne<typeof User>

  @hasOne(() => User, {
    foreignKey: 'invitedUserId'
  })
  public invite: HasOne<typeof User>

  @hasOne(() => Team, {
    foreignKey: 'teamId'
  })
  public team: HasOne<typeof Team>

  @hasOne(() => Role, {
    foreignKey: 'roleId'
  })
  public role: HasOne<typeof Role>

  @column()
  public status: 'pending' | 'rejected' | 'accepted' | 'discarded'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
