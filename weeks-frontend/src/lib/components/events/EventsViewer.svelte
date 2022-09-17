<script lang="ts" context="module">
  import type { Team } from "$lib/services/teams/teams.service"
  import type { DateStat } from "@likable-hair/svelte/dates/utils"
  import type { Event } from "$lib/services/events/events.service"
</script>

<script lang="ts">
  import { DateTime } from "luxon";

  export let team: Team,
    selectedDate: Date = new Date(),
    selectedEvents: Event[] = [],
    events: Event[],
    visibleMonth: number = DateTime.now().get('month') - 1,
    visibleYear: number = DateTime.now().get('year'),
    isWeek: boolean = false

  import VerticalTextSwitch from "@likable-hair/svelte/forms/VerticalTextSwitch.svelte"
  import EventsCalendar from "$lib/components/events/EventsCalendar.svelte";
  import EventsWeekCalendar from "$lib/components/events/EventsWeekCalendar.svelte";
  import Icon from "@likable-hair/svelte/media/Icon.svelte"
  import { fade, fly } from 'svelte/transition';
</script>


{#if isWeek}
  <div style:width="100%" in:fade={{delay: 100}} out:fade={{duration: 90}}>
    <EventsWeekCalendar
      bind:team={team}
      bind:selectedDate={selectedDate}
      bind:selectedEvents={selectedEvents}
      bind:events={events}
      bind:visibleMonth={visibleMonth}
      bind:visibleYear={visibleYear}
    >
      <svelte:fragment slot="options">
        <VerticalTextSwitch
          height="15px"
          bind:value={isWeek}
          animationDuration={0.1}
        >
          <span slot="trueOption">
            <Icon name="mdi-calendar-week-begin" size={18}></Icon>
          </span>
          <span slot="falseOption">
            <Icon name="mdi-calendar-month" size={18}></Icon>
          </span>
        </VerticalTextSwitch>
      </svelte:fragment>
    </EventsWeekCalendar>
  </div>
{:else}
  <div style:width="100%" in:fade={{delay: 100}} out:fade={{duration: 90}}>
    <EventsCalendar
      bind:team={team}
      bind:selectedDate={selectedDate}
      bind:selectedEvents={selectedEvents}
      bind:events={events}
      bind:visibleMonth={visibleMonth}
      bind:visibleYear={visibleYear}
    >
      <svelte:fragment slot="options">
        <VerticalTextSwitch
          height="15px"
          bind:value={isWeek}
        >
          <span slot="trueOption">
            <Icon name="mdi-calendar-week-begin" size={18}></Icon>
          </span>
          <span slot="falseOption">
            <Icon name="mdi-calendar-month" size={18}></Icon>
          </span>
        </VerticalTextSwitch>
      </svelte:fragment>
    </EventsCalendar>
  </div>
{/if}