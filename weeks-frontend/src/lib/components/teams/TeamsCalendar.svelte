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
    visibleMonth: number = DateTime.now().get('month') - 1,
    visibleYear: number = DateTime.now().get('year')

  onMount(() => {
    loadEvents()
  })

  let events: Event[]
  function loadEvents() {
    let service = new EventsService({ fetch })
    service.list({
      filters: {
        from: DateTime.now()
          .set({
            month: visibleMonth + 1,
            year: visibleYear
          })
          .startOf('month')
          .startOf('day')
          .startOf('hour')
          .startOf('minute')
          .startOf('millisecond')
          .minus({ days: 7 })
          .toJSDate(),
        to: DateTime.now()
          .set({
            month: visibleMonth + 1,
            year: visibleYear
          })
          .endOf('month')
          .endOf('day')
          .endOf('hour')
          .endOf('minute')
          .endOf('millisecond')
          .plus({ days: 7})
          .toJSDate(),
        team: {
          id: team.id
        }
      }
    }).then((loadedEvents) => {
      events = loadedEvents
    })
  }
  import EventsCalendar from "../events/EventsCalendar.svelte";
</script>


<EventsCalendar
  bind:events={events}
  bind:selectedDate={selectedDate}
  bind:team={team}
  bind:selectedEvents={selectedEvents}
  bind:visibleMonth={visibleMonth}
  bind:visibleYear={visibleYear}
>
  <svelte:fragment slot="header-append">
    <slot name="header-append">
    </slot>
  </svelte:fragment>
</EventsCalendar>