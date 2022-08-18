import { FetchBasedService } from "../base/fetchBased.service";
import { browser } from "$app/env";
import type { User } from "$lib/services/user/user.service"
import type { Team } from "$lib/services/teams/teams.service"
import type { Role } from "$lib/services/roles/roles.service"

export type Invitation = {
  id: number,
  invitedByUser: User,
  invitedUser?: User,
  invitedEmail: string,
  team: Team,
  role?: Role
}

export default class InvitationsService extends FetchBasedService {
  constructor(params: {
    fetch: any
  }) {
    super({
      fetch: params.fetch,
    })
  }

  public async inviteUser(params: {
    team: { id: number },
    user: { id: number }
  }): Promise<Invitation> {
    if (!browser) throw new Error('only available in browser')

    let response = await this.post({
      url: '/teams',
      body: params
    })

    return response
  }
}