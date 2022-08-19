import UrlService from "../urls/urls.service";
import Cookies from 'js-cookie'

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
  headers?: Record<string, string>
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

  constructor(params: {
    fetch: any,
    urls?: {
      api: string
    }
  }) {
    if(!params.fetch) throw new Error("service must have a definition of fetch");
    
    this.fetch = params.fetch
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

    return response.json()
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
      + new URLSearchParams(params.params), 
      {
        headers: this._calculateHeaders(params.headers),
      }
    ).then((response: any) => response.json())
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