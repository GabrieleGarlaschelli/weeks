import { FetchBasedService } from "../base/fetchBased.service";
import { browser } from "$app/env";

export type Role = {
  id: number,
  name: string,
  cans?: any,
  createdAt: Date,
  updatedAt: Date
}

export default class RolesService extends FetchBasedService {
  constructor(params: {
    fetch: any
  }) {
    super({
      fetch: params.fetch,
    })
  }
}