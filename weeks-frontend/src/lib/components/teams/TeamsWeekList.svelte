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
  
	import EventsWeekList from "../events/EventsWeekList.svelte";
</script>

{#if !!events}
  <EventsWeekList
    bind:events={events}
    bind:selectedDate={selectedDate}
    bind:team={team}
    bind:selectedEvents={selectedEvents}
    bind:visibleYear={visibleYear}
    bind:visibleWeek={visibleWeek}
  ></EventsWeekList>
{/if}