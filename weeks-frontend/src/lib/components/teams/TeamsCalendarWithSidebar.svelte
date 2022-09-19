<script lang="ts" context="module">
  import type { Event } from '$lib/services/events/events.service'
  import type { Team } from '$lib/services/teams/teams.service'
</script>

<script lang="ts">
  import { DateTime } from 'luxon';

  export let team: Team

  let selectedDate: Date | undefined,
    selectedEvents: Event[] = []

  $: formattedDate = !!selectedDate ? DateTime.fromJSDate(selectedDate).setLocale('it').toLocaleString(DateTime.DATE_MED) : ''

  function handleCloseDrawer() {
    selectedDate = undefined
  }

  import TeamsCalendar from "$lib/components/teams/TeamsCalendar.svelte";
  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";
  import EventsList from "$lib/components/events/EventsList.svelte";
  import Icon from "@likable-hair/svelte/media/Icon.svelte";
</script>

<MediaQuery 
  let:mAndDown
>
  {#if team}
    <div
      class="calendar-container"
    >
      <TeamsCalendar
        bind:selectedDate={selectedDate}
        bind:selectedEvents={selectedEvents}
        team={team}
      ></TeamsCalendar>
      {#if !mAndDown}
        <div 
          class="event-drawer"
          class:opened={!!selectedDate}
          class:closed={!selectedDate}
        >
          <div class="title-container">
            <div class="title">
              {formattedDate}
            </div>
            <div class="close-button">
              <Icon 
                name="mdi-close"
                on:click={handleCloseDrawer}
                click
              ></Icon>
            </div>
          </div>
          <div class="events-list">
            <EventsList
              events={selectedEvents}
              team={team}
            ></EventsList>
          </div>
        </div>
      {/if}
    </div>
    {#if mAndDown}
      <div class="hr"></div>
      <div class="title-container">
        <div class="title">
          {formattedDate}
        </div>
      </div>
      <EventsList
        events={selectedEvents}
        team={team}
      ></EventsList>
    {/if}
  {/if}
</MediaQuery>

<style>
  .calendar-container {
    display: flex;
  }

  .event-drawer {
    transition: all .4s cubic-bezier(0.075, 0.82, 0.165, 1);
    height: 100%;
  }

  .events-list {
    max-height: calc(100vh - 200px);
    overflow: auto;
  }
  
  .event-drawer.opened {
    width: 400px;
  }

  .event-drawer.closed {
    width: 0px;
    visibility: collapse;
  }

  .title-container {
    display: flex;
    padding-left: 10px;
    padding-right: 10px;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .title {
    flex-grow: 1;
    font-weight: 700;
    font-size: 1.3rem;
  }

  .hr {
    margin-top: 10px;
    margin-bottom: 10px;
    border-top: 0.5px solid var(--global-thin-contrast-color);
  }
</style>