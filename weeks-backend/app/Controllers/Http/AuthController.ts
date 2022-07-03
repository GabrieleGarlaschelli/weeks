import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';

export default class AuthController {
  public async login({ auth, request }: HttpContextContract) {
    await User.query().where('email', request.input('email'))
    const token = await auth.use('api').attempt(request.input('email'), request.input('password'), {
      expiresIn: '7days'
    })
    return token.toJSON()
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.use('api').revoke()
    return {
      revoked: true
    }
  }

  public async me({ auth }: HttpContextContract) {
    await auth.use('api')
    return auth.user
  }


  public async googleRedirect({ ally }: HttpContextContract) {
    return ally.use('google').redirect()
  }

  public async googleCallback({ auth, ally }: HttpContextContract) {
    const google = ally.use('google')

    if (google.accessDenied()) {
      throw new Error("Access denied");
    } else if (google.stateMisMatch()) {
      throw new Error('Request expired. Retry again');
    } else if (google.hasError()) {
      throw google.getError()
    }

    const googleUser = await google.user()

    /**
     * Finally, access the user
     */
    const user = await User.firstOrCreate({
      email: googleUser.email || undefined
    }, {
      password: googleUser.token.token
    })
    await auth.use('api').login(user)
  }
}
