import { browser } from "$app/env";
import { FetchBasedService } from "../base/fetchBased.service";
import Cookies from 'js-cookie'
import { session } from "$app/stores";
// import currentUser from "$lib/services/stores/currentUser";
import type { User } from "../user/user.service";

export type LoginParams = {
  data: {
    email: string,
    password: string
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
    if(browser) {
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

      await this.setSession()
      return response
    }
  }

  async setSession() {
    if(browser && this.authCookiePresent()) {
      let currentUser: User = await this.me();
      session.update((session) => {
        session.currentUser = currentUser
        return session
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
      email: response.email,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt)
    }
  }

  async logout(): Promise<void> {
    if(this.authCookiePresent()) {
      Cookies.remove(this.coockieName)
    }
  }
}