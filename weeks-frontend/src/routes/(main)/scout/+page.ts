import type { PageLoad } from './$types';
import TeamsService from '$lib/services/teams/teams.service'

export const load = (async ({ fetch, parent }) => {
  let parentData = await parent()

  let teamsService = new TeamsService({ fetch, token: parentData.token })
  let paginatedTeams = await teamsService.list({
    filters: {
      scoutable: true
    }
  })

  return {
    paginatedTeams
  };
}) satisfies PageLoad;