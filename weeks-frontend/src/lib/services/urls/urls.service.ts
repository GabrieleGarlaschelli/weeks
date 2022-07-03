export default class UrlService {
  constructor() { }

  static get api() {
    let url: string = import.meta.env.VITE_API_URL
    if(url.endsWith('/')) url = url.substring(0, url.length - 1)
    return url
  }
}