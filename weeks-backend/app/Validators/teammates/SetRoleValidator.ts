import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SetRoleValidator {
  constructor(protected ctx?: HttpContextContract) { }

  public schema = schema.create({
    role: schema.object().members({
      id: schema.number()
    })
  })

  public messages: CustomMessages = {}
}
