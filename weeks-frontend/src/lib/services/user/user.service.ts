import { FetchBasedService } from "../base/fetchBased.service";
import Cookies from 'js-cookie'

export type User = {
  email: string
  createdAt: Date
  updatedAt: Date
}

export default class CurrentUserService extends FetchBasedService {
  constructor(params: {
    fetch: any
  }) {
    super({
      fetch: params.fetch,
    })
  }
}