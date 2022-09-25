<script lang="ts" context="module">
  import type { Team } from "$lib/services/teams/teams.service"
  import type { Event } from "$lib/services/events/events.service"
</script>

<script lang="ts">
  import { DateTime } from "luxon";

  export let team: Team,
    selectedDate: Date = new Date(),
    selectedEvents: Event[] = [],
    events: Event[],
    visibleMonth: number = DateTime.now().get('month') - 1,
    visibleYear: number = DateTime.now().get('year')

  import EventsCalendar from "$lib/components/events/EventsCalendar.svelte";
</script>


<div style:width="100%">
  <EventsCalendar
    bind:team={team}
    bind:selectedDate={selectedDate}
    bind:selectedEvents={selectedEvents}
    bind:events={events}
    bind:visibleMonth={visibleMonth}
    bind:visibleYear={visibleYear}
  ></EventsCalendar>
</div>