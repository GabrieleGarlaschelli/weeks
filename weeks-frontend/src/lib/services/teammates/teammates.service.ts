import { FetchBasedService } from '$lib/services/common/fetchBased.service'
import type { Teammate } from '$lib/services/teams/teams.service'

export default class TeammatesService extends FetchBasedService {
	constructor(params: { fetch: any }) {
		super({
			fetch: params.fetch
		})
	}

	public async update(params: { id: number; alias?: string; roleId?: number }): Promise<Teammate> {
		let response = await this.client.put({
			url: '/teammates/' + params.id,
			body: params
		})

		return response
	}
}
