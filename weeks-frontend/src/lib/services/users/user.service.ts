import { FetchBasedService } from "../base/fetchBased.service";

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

  public async search(params: {
    email: string
  }): Promise<User[]> {
    if(!params.email) throw new Error('email must be defined')

    let response = await this.get({
      url: '/users',
      params: {
        filters: {
          email: params.email
        }
      }
    })

    return response.data
  }
}