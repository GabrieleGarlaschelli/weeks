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

  onMount(async () => {
    await loadEvents(visibleWeek, visibleYear)
  })

  let events: Event[]
  async function loadEvents(vw: number, vy: number) {
    let from: Date = DateTime.fromObject({
            weekday: 1,
            weekNumber: vw,
            weekYear: vy
          })
          .startOf('day')
          .startOf('hour')
          .startOf('minute')
          .startOf('millisecond')
          .toJSDate(),
      to: Date = DateTime.fromObject({
            weekday: 7,
            weekNumber: vw,
            weekYear: vy
          })
          .endOf('day')
          .endOf('hour')
          .endOf('minute')
          .endOf('millisecond')
          .toJSDate() 
  
    let service = new EventsService({ fetch })
    let newEvents = await service.list({
      filters: {
        from: from,
        to: to,
        team: {
          id: team.id
        }
      }
    })

    events = !!events ? events.filter((e) => {
      return !(e.start > from && e.start < to)
    }) : []

    events = [
      ...events,
      ...newEvents
    ]
  }

  $: if(!!visibleYear && !!visibleWeek) loadEvents(visibleWeek, visibleYear)

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
    on:nextWeek
    on:previousWeek
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
    on:import={() => loadEvents(visibleWeek, visibleYear)}
  ></TeamImportWeekDialog>
{/if}