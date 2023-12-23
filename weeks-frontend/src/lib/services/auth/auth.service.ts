import { browser } from "$app/environment";
import { FetchBasedService } from "$lib/services/base/fetchBased.service";
import Cookies from 'js-cookie'
import user from "$lib/stores/user";
import type { User } from "$lib/services/users/user.service";

export type LoginParams = {
  data: {
    email: string,
    password: string
  },
  context?: {}
}

export type SignupParams = {
  data: {
    email: string,
    password: string,
    name: string
  },
  context?: {}
}

export default class AuthService extends FetchBasedService {

  constructor(params: {
    fetch: any
  }) {
    super({
      fetch: params.fetch,
    })
  }


  async login(params: LoginParams) {
    if (browser) {
      const response = await this.post({
        url: '/auth/login',
        body: {
          email: params.data.email,
          password: params.data.password
        }
      })

      Cookies.set(this.coockieName, response.token, {
        expires: new Date(response.expires_at),
        sameSite: 'strict'
      })

      await this.setUser()
      return response
    }
  }

  async signup(params: SignupParams) {
    if (browser) {
      const response = await this.post({
        url: '/auth/signup',
        body: {
          email: params.data.email,
          password: params.data.password,
          name: params.data.name
        }
      })

      return response
    }
  }

  async loginWithGoogle() {
    if (browser) {
      window.location.href = this.urls.api + '/auth/google/redirect'
    }
  }

  async loginWithGoogleCallback(params: { token: string, expiresAt: Date, refreshToken: string, refreshTokenExpiresAt: Date }) {
    if (browser) {
      Cookies.set(this.coockieName, params.token, {
        expires: new Date(params.expiresAt),
        sameSite: 'strict'
      })

      Cookies.set(this.refreshCoockieName, params.refreshToken, {
        expires: new Date(params.refreshTokenExpiresAt),
        sameSite: 'strict',
        secure: true
      })
    }
  }

  async setUser() {
    if (browser && this.authCookiePresent()) {
      let currentUser: User = await this.me();
      user.update(user => {
        user = currentUser
        return user
      })
    }
  }

  authCookiePresent(): boolean {
    return browser && !!Cookies.get(this.coockieName)
  }

  async me(): Promise<User> {
    const response = await this.get({
      url: '/auth/me',
    })


    return {
      id: response.id,
      email: response.email,
      name: response.name,
      avatarUrl: response.avatarUrl,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt)
    }
  }

  async logout(): Promise<void> {
    if (this.authCookiePresent()) {
      Cookies.remove(this.coockieName)
      user.set(undefined)
    }
  }
}