<script lang="ts" context="module">
  import type { Event } from '$lib/services/events/events.service'
</script>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { DateTime } from 'luxon';
  import qs from 'qs'
  import CansService from '$lib/services/roles/cans.service';

  export let events: Event[] = [],
    team: { id: number } | undefined = undefined,
    precompiledDate: DateTime | undefined = undefined

  function formattedTime(event: Event) {
    let fromTime: string = DateTime.fromJSDate(event.start).setLocale('it').toLocaleString(DateTime.TIME_SIMPLE)
    let toTime: string = DateTime.fromJSDate(event.end).setLocale('it').toLocaleString(DateTime.TIME_SIMPLE)
    return `${fromTime} - ${toTime}`
  }

  function handlePlusClick() {
    if(!!team) {
      if(!!precompiledDate) {
        goto(`/teams/${team.id}/events/new?${qs.stringify({ start: precompiledDate.toJSDate() })}`)
      } else {
        goto('/teams/' + team.id + '/events/new')
      }
    }
  }

  function handleEventClick(event: Event) {
    if(!!team) {
      goto(`/teams/${team.id}/events/${event.id}/general`)
    }
  }

  $: sortedEvents = !!events ? events.sort((a, b) => {
    return DateTime.fromJSDate(new Date(a.start)).diff(DateTime.fromJSDate(new Date(b.start))).milliseconds
  } ) : []

  import Icon from "@likable-hair/svelte/media/Icon.svelte"
</script>

<div class="events-container">
  {#if events.length > 0}
    {#each sortedEvents as event}
      <div
        class="event-post"
        on:click={() => handleEventClick(event)}
        class:clickable={!!team}
      >
        <div class="title">{event.name}</div>
        <div class="time">{formattedTime(event)}</div>
        {#if !!event.description}
          <div 
            class="description"
            style:white-space="pre-wrap"
          >{event.description}</div>
        {/if}
      </div>
    {/each}
    {#if !!team && CansService.can('Event', 'create')}
      <div class="plus-container">
        <Icon 
          name="mdi-plus"
          click
          on:click={handlePlusClick}
        ></Icon>
      </div>
    {/if}
  {:else}
    <slot name="no-data">
      <div class="no-data">Nessun evento</div>
    </slot>
  {/if}
</div>

<style>
  .events-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .event-post {
    background-color: var(--global-thin-contrast-color);
    border-radius: 5px;
    padding-top: 5px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 5px;
    margin-left: 10px;
    margin-right: 10px;
  }

  .clickable {
    cursor: pointer;
  }

  .title {
    font-weight: 500;
    font-size: 1.2rem;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .time {
    font-size: 0.8rem;
    font-weight: 300;
    margin-bottom: 10px;
  }

  .description {
    font-size: 1rem;
    margin-bottom: 10px;
  }

  .no-data {
    font-weight: 300;
    text-align: center;
  }

  .plus-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 5px;
    margin-bottom: 15px;
  }
</style>