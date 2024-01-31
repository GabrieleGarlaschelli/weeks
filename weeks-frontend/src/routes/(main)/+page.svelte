<script lang="ts" context="module">
	import type { Team } from '$lib/services/teams/teams.service'
</script>

<script lang="ts">
	import type { PageData } from './$types'
	import TeamsBoxList from '$lib/components/teams/TeamsBoxList.svelte'
	import PageTitle from '$lib/components/common/PageTitle.svelte'
	import { onMount } from 'svelte'
	import TeamsService from '$lib/services/teams/teams.service'
	import { goto } from '$app/navigation'
	import EventsService, { type Event } from '$lib/services/events/events.service'
	import { DateTime } from 'luxon'
	import EventsHorizontalList from '$lib/components/events/EventsHorizontalList.svelte'
	import GlobalCalendarWithSidebar from '$lib/components/profile/GlobalCalendarWithSidebar.svelte'
  import user from '$lib/stores/auth/user'

	export let data: PageData

	let teams: Team[] = []
	async function loadTeams() {
		let service = new TeamsService({ fetch })
		let paginationData = await service.list()
		teams = paginationData.data
	}

	let nextEvents: Event[] = [],
		loadingEvents: boolean = false

	async function loadNextEvents() {
		loadingEvents = true
		let service = new EventsService({ fetch })
		let results = await service.list({
			filters: {
				from: DateTime.now().toJSDate(),
				to: DateTime.now().plus({ days: 1 }).toJSDate()
			}
		})

		loadingEvents = false
		nextEvents = results
	}

	async function handleTeamClick(event: any) {
		goto('/teams/' + event.detail.team.id + '/general')
	}

	onMount(() => {
		loadTeams()
		loadNextEvents()
	})
</script>

<PageTitle title={`Bevenuto ${$user?.firstname} 👋`} />
<div class="font-bold mt-4">Prossimi appuntamenti</div>
<div style:margin-top="10px">
	{#if loadingEvents}
		Caricamento eventi ...
	{:else}
		<EventsHorizontalList events={nextEvents} />
	{/if}
</div>
