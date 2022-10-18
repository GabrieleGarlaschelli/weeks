<script lang="ts" context="module">
  import type { Team } from "$lib/services/teams/teams.service"
</script>

<script lang="ts">
  import TeamsBoxList from "$lib/components/teams/TeamsBoxList.svelte";
  import PageTitle from "$lib/components/typography/PageTitle.svelte";
  import Subhead from "$lib/components/typography/Subhead.svelte";
  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";
  import { onMount } from "svelte";
  import TeamsService from "$lib/services/teams/teams.service";
  import { goto } from "$app/navigation";
	import EventsService, { type Event } from "$lib/services/events/events.service";
	import { DateTime } from "luxon";
	import EventsHorizontalList from "$lib/components/events/EventsHorizontalList.svelte";
	import GlobalCalendarWithSidebar from "$lib/components/profile/GlobalCalendarWithSidebar.svelte";

  let teams: Team[] = []
  async function loadTeams() {
    let service = new TeamsService({ fetch })
    let paginationData = await service.list()
    teams = paginationData.data
  }

  let events: Event[] = [], loadingEvents: boolean = false
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
    events = results
  }

  async function handleTeamClick(event: any) {
    goto('/teams/' + event.detail.team.id + '/general')
  }

  onMount(() => {
    loadTeams()
    loadNextEvents()
  })
</script>

<MediaQuery
  let:mAndDown
>
  <PageTitle
    title="Home"
    paddingTop={mAndDown ? "15px" : "40px"}
  ></PageTitle>
  <Subhead
    text="I miei team"
    marginTop="30px"
  ></Subhead>
  <div
    style:margin-top="10px"
  >
    <TeamsBoxList
      marginTop="20px"
      teams={teams}
      on:teams-click={handleTeamClick}
    ></TeamsBoxList>
  </div>
  <Subhead
    text="Prossimi appuntamenti"
    marginTop="30px"
  ></Subhead>
  <div
    style:margin-top="10px"
  >
    {#if loadingEvents}
      Caricamento eventi ...
    {:else}
      <EventsHorizontalList
        events={events}
      ></EventsHorizontalList>
    {/if}
  </div>
  <Subhead
    text="Calendario globale"
    marginTop="30px"
  ></Subhead>
  <div
    style:margin-top="10px"
    style:padding-bottom="50px"
  >
    <GlobalCalendarWithSidebar></GlobalCalendarWithSidebar>
  </div>
</MediaQuery>