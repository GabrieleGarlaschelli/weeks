<script lang="ts" context="module">
  import type { Team } from "$lib/services/teams/teams.service"
  import type { Event } from "$lib/services/events/events.service"
</script>

<script lang="ts">
  import { DateTime } from "luxon";
  import { onMount } from "svelte";
  import EventsService from "$lib/services/events/events.service"

  export let team: Team,
    selectedDate: Date = new Date(),
    selectedEvents: Event[] = [],
    visibleYear: number = DateTime.now().get('year'),
    visibleWeek: number = DateTime.now().get('weekNumber')

  let importFromYear = visibleYear,
    importFromWeek = visibleWeek

  onMount(() => {
    loadEvents()
  })

  let events: Event[]
  function loadEvents() {
    let service = new EventsService({ fetch })
    service.list({
      filters: {
        from: DateTime.fromObject({
            weekday: 1,
            weekNumber: visibleWeek,
            weekYear: visibleYear
          })
          .startOf('day')
          .startOf('hour')
          .startOf('minute')
          .startOf('millisecond')
          .toJSDate(),
        to: DateTime.fromObject({
            weekday: 7,
            weekNumber: visibleWeek,
            weekYear: visibleYear
          })
          .endOf('day')
          .endOf('hour')
          .endOf('minute')
          .endOf('millisecond')
          .toJSDate(),
        team: {
          id: team.id
        }
      }
    }).then((loadedEvents) => {
      events = loadedEvents
    })
  }

  $: if(!!visibleYear && !!visibleWeek) loadEvents()

  let openImportWeekDialog: boolean = false
  function handleImportWeekClick() {
    openImportWeekDialog = true
  }
  
	import EventsWeekList from "../events/EventsWeekList.svelte";
  import Icon from "@likable-hair/svelte/media/Icon.svelte";
  import TeamImportWeekDialog from "$lib/components/teams/TeamImportWeekDialog.svelte";
</script>

{#if !!events}
  <EventsWeekList
    bind:events={events}
    bind:selectedDate={selectedDate}
    bind:team={team}
    bind:selectedEvents={selectedEvents}
    bind:visibleYear={visibleYear}
    bind:visibleWeek={visibleWeek}
  >
    <svelte:fragment slot="options">
      <Icon
        name="mdi-import"
        click
        on:click={handleImportWeekClick}
      ></Icon>
    </svelte:fragment>
  </EventsWeekList>

  <TeamImportWeekDialog
    bind:open={openImportWeekDialog}
    bind:team={team}
    bind:selectedYear={importFromYear}
    bind:selectedWeek={importFromWeek}
    bind:toYear={visibleYear}
    bind:toWeek={visibleWeek}
    on:import={loadEvents}
  ></TeamImportWeekDialog>
{/if}