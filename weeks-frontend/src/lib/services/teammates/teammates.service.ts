import { FetchBasedService } from "../base/fetchBased.service";
import { browser } from "$app/environment";
import type { Teammate } from "$lib/services/teams/teams.service";

export default class TeammatesService extends FetchBasedService {
  constructor(params: {
    fetch: any
  }) {
    super({
      fetch: params.fetch,
    })
  }

  public async update(params: {
    id: number,
    alias?: string,
    roleId?: number,
  }): Promise<Teammate> {
    let response = await this.put({
      url: '/teammates/' + params.id,
      body: params
    })

    return response
  }
}