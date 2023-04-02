import Env from '@ioc:Adonis/Core/Env';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import UsersManager from 'App/managers/user.manager';

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

  public async signup({ request }: HttpContextContract) {
    if(!request.input('email')) throw new Error('email required')

    let existingUser = await User.query()
      .where('email', request.input('email'))
      .first()

    if(!!existingUser) throw new Error('User already exists')

    const manager = new UsersManager()
    await manager.create({
      data: {
        email: request.input('email'),
        password: request.input('password'),
        name: request.input('name')
      }
    })

    return true
  }


  public async googleiosRedirect({ ally }: HttpContextContract) {
    return ally.use('googleios').redirect()
  }

  public async googleiosCallback({ auth, ally, response }: HttpContextContract) {
    const google = ally.use('googleios')


    if (google.accessDenied()) {
      throw new Error("Access denied");
    } else if (google.stateMisMatch()) {
      throw new Error('Request expired. Retry again');
    } else if (google.hasError()) {
      throw google.getError()
    }

    const googleUser = await google.user()

    const user = await User.firstOrCreate({
      email: googleUser.email || undefined,
    }, {
      name: googleUser.name || undefined,
      avatarUrl: googleUser.avatarUrl || undefined,
      password: googleUser.token.token
    })
    const token = await auth.use('api').login(user, {
      expiresIn: '7days'
    })

    response.redirect().withQs(token.toJSON()).toPath(Env.get('GOOGLE_IOS_FRONTEND_CALLBACK_URL') || 'http://localhost:3000/auth/google/callback')
  }

  public async googleRedirect({ ally }: HttpContextContract) {
    return ally.use('google').redirect()
  }

  public async googleCallback({ auth, ally, response }: HttpContextContract) {
    const google = ally.use('google')


    if (google.accessDenied()) {
      throw new Error("Access denied");
    } else if (google.stateMisMatch()) {
      throw new Error('Request expired. Retry again');
    } else if (google.hasError()) {
      throw google.getError()
    }

    const googleUser = await google.user()

    const user = await User.firstOrCreate({
      email: googleUser.email || undefined,
    }, {
      name: googleUser.name || undefined,
      avatarUrl: googleUser.avatarUrl || undefined,
      password: googleUser.token.token
    })
    const token = await auth.use('api').login(user, {
      expiresIn: '7days'
    })

    response.redirect().withQs(token.toJSON()).toPath(Env.get('GOOGLE_FRONTEND_CALLBACK_URL') || 'http://localhost:3000/auth/google/callback')
  }
}
