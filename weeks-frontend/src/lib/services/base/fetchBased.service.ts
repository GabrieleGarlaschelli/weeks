import { goto } from "$app/navigation";
import UrlService from "../urls/urls.service";
import Cookies from 'js-cookie'
import qs from 'qs'
import AuthService from '$lib/services/auth/auth.service'

export type PostParams = {
  url: string,
  body?: any,
  headers?: Record<string, string>
}

export type PutParams = PostParams

export type DeleteParams = PostParams

export type GetParams = {
  url: string,
  params?: string | string[][] | Record<string, any> | URLSearchParams | undefined,
  headers?: Record<string, string>,
  retrying?: boolean
}

export abstract class FetchBasedService {
  protected fetch: any;
  protected urls: {
    api: string
  };
  // Preventing XSS or CSRF attack could be done with generating 
  // many random token with random keys in the coockies and save 
  // wich one is the right one
  protected coockieName: string = "token"
  protected refreshCoockieName: string = "refreshToken"

  constructor(params: {
    fetch: any,
    urls?: {
      api: string
    }
  }) {
    if(!params.fetch) throw new Error("service must have a definition of fetch");
    
    this.fetch = params.fetch.bind(window)
    if(!!params.urls) {
      this.urls = params.urls
    } else {
      this.urls = {
        api: UrlService.api
      }
    }
  }

  protected async post(params: PostParams) {
    const response = await this.fetch(this._calculateApiUrl(params.url), {
      method: 'POST',
      headers: this._calculateHeaders(params.headers),
      body: JSON.stringify(params.body)
    })

    if(response.status != 200) {
      throw await response.json()
    }

    let jsonText = await response.text()
    if (!!jsonText) {
      return JSON.parse(jsonText)
    } else {
      return {}
    }
  }

  protected async put(params: PutParams) {
    const response = await this.fetch(this._calculateApiUrl(params.url), {
      method: 'PUT',
      headers: this._calculateHeaders(params.headers),
      body: JSON.stringify(params.body)
    })

    if (response.status != 200) {
      throw await response.json()
    }

    return response.json()
  }

  protected async delete(params: DeleteParams) {
    const response = await this.fetch(this._calculateApiUrl(params.url), {
      method: 'DELETE',
      headers: this._calculateHeaders(params.headers),
      body: JSON.stringify(params.body)
    })

    if (response.status != 200) {
      throw await response.json()
    }

    let jsonText = await response.text()
    if(!!jsonText) {
      return JSON.parse(jsonText)
    } else {
      return {}
    }
  }

  protected async get(params: GetParams) {
    return await this.fetch(
      this._calculateApiUrl(params.url) 
      + '?' 
      + qs.stringify(params.params), 
      {
        headers: this._calculateHeaders(params.headers),
      }
    ).then(async (response: any) => {
      if(response.status == 401) {
        let refreshToken = Cookies.get(this.refreshCoockieName)

        if (!refreshToken) {
          let service = new AuthService({ fetch: this.fetch })
          service.logout()
          throw new Error("unauthorized request")
        } else if(!params.retrying) {
          await this.refreshToken()
          return await this.get({
            ...params,
            retrying: true
          })
        } else {
          throw new Error("unauthorized request")
        }
      } else {
        return response.json()
      }
    })
  }

  private async refreshToken() {
    let refreshToken = Cookies.get(this.refreshCoockieName)

    let response = await this.fetch(
      this._calculateApiUrl('/auth/refreshToken'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + refreshToken
        }
      }
    )

    let token = await response.json()

    Cookies.set(this.coockieName, token.token, {
      expires: new Date(token.expiresAt),
      sameSite: 'strict'
    })
  }

  private _calculateApiUrl(url: string) {
    return this.urls.api + url
  }

  private _calculateHeaders(paramsHeader?: Record<string, string>): Record<string, string> {
    let headers: Record<string, string> = {}
    if(!!paramsHeader) headers = paramsHeader

    let token: string | undefined = Cookies.get(this.coockieName)
    if(!!token) headers['Authorization'] = "Bearer " + token
    headers['Content-Type'] = 'application/json'

    return headers
  }
}