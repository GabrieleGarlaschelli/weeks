import { FetchBasedService } from "../base/fetchBased.service";
import Cookies from 'js-cookie'

export type User = {
  email: string
  name: string,
  avatarUrl: string,
  createdAt: Date
  updatedAt: Date
}

export default class UserService extends FetchBasedService {
  constructor(params: {
    fetch: any
  }) {
    super({
      fetch: params.fetch,
    })
  }
}