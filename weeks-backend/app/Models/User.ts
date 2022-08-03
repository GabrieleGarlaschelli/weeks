import { CamelCaseBaseModel } from './CamelCaseBaseModel';
import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Team from 'App/Models/Team';

export default class User extends CamelCaseBaseModel {

  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public avatarUrl?: string

  @column()
  public name?: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Team, {
    pivotTable: 'teammates',
    localKey: 'id',
    pivotForeignKey: 'userId',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'teamId',
  })
  public teams: ManyToMany<typeof Team>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
