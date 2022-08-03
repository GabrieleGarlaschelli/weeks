import { DateTime, } from 'luxon'
import { BaseModel, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Team from 'App/Models/Team'
import Role from 'App/Models/Role'

export default class Teammate extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @hasOne(() => User, {
    foreignKey: 'userId'
  })
  public user: HasOne<typeof User>

  @hasOne(() => Team, {
    foreignKey: 'teamId'
  })
  public team: HasOne<typeof Team>

  @hasOne(() => Role, {
    foreignKey: 'roleId'
  })
  public role: HasOne<typeof Role>
  

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
