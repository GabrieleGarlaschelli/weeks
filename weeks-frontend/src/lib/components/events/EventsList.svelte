<script lang="ts" context="module">
  import type { Event } from '$lib/services/events/events.service'
  import { DateTime } from 'luxon';
</script>

<script lang="ts">
  export let events: Event[] = []

  function formattedTime(event: Event) {
    let fromTime: string = DateTime.fromJSDate(event.start).setLocale('it').toLocaleString(DateTime.TIME_SIMPLE)
    let toTime: string = DateTime.fromJSDate(event.end).setLocale('it').toLocaleString(DateTime.TIME_SIMPLE)
    return `${fromTime} - ${toTime}`
  }
</script>

<div class="events-container">
  {#if events.length > 0}
    {#each events as event}
      <div
        class="event-post"
      >
        <div class="title">{event.name}</div>
        <div class="time">{formattedTime(event)}</div>
        <div class="description">{event.description}</div>
      </div>
    {/each}
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
  }

  .no-data {
    font-weight: 300;
    text-align: center;
  }
</style>