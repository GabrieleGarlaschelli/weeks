import { FetchBasedService } from "../base/fetchBased.service";
import { browser } from "$app/env";

import type { Event } from "$lib/services/events/events.service";
import type { Teammate } from "$lib/services/teams/teams.service";
import type { User } from "$lib/services/users/user.service";

export type Convocation = {
  id: number,
  confirmationStatus?: 'confirmed' | 'denied' | 'pending',
  confirmedBy?: User,
  updateConfirmationAt?: Date,
  eventId: number,
  event: Omit<Event, 'convocations'>,
  teammateId: number,
  teammate: Teammate,
  notes: string,
  createdAt: Date,
  updatedAt: Date
}

export type PaginatedConvocations = {
  data: Convocation[],
  meta: PaginationData
}

export default class ConvocationsService extends FetchBasedService {
  constructor(params: {
    fetch: any
  }) {
    super({
      fetch: params.fetch,
    })
  }


  public async confirm(params: {
    id: number
  }): Promise<Convocation> {
    let response = await this.post({
      url: '/convocations/' + params.id + '/confirm'
    })

    return response
  }


  public async deny(params: {
    id: number
  }): Promise<Convocation> {
    let response = await this.post({
      url: '/convocations/' + params.id + '/deny'
    })

    return response
  }

}