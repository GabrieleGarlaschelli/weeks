<script lang="ts" context="module">
  import type { Team } from "$lib/services/teams/teams.service"
  import type { DateStat } from "@likable-hair/svelte/dates/utils"
  import type { Event } from "$lib/services/events/events.service"
</script>

<script lang="ts">
  import { DateTime } from "luxon";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import CansService from '$lib/services/roles/cans.service';

  export let team: Team,
    selectedDate: Date = new Date(),
    selectedEvents: Event[] = [],
    events: Event[],
    visibleMonth: number = DateTime.now().get('month') - 1,
    visibleYear: number = DateTime.now().get('year'),
    visibleDay: number = DateTime.now().get('day')


  let dayGroupedEvents: {
    [key: string]: Event[] | undefined
  } = {}

  onMount(() => {
    groupEventByDate()
  })

  function groupEventByDate() {
    dayGroupedEvents = {}

    if(!!events && events.length > 0) {
      for(let i = 0; i < events.length; i += 1) {
        let dayKey = DateTime.fromJSDate(events[i].start).toFormat('yyyyMMdd')
        if(!dayGroupedEvents[dayKey]) dayGroupedEvents[dayKey] = []
        dayGroupedEvents[dayKey]?.push(events[i])
      }
    }
  }

  $: monthName = DateTime.now().set({ 
      month: parseInt(visibleMonth.toString()) + 1,
      year: visibleYear
    }).setLocale('it')
    .toLocaleString({ 
      month: 'long',
      year: 'numeric'
    })

  function nextMonth() {
    if(visibleMonth == 11) {
      visibleMonth = 0
      visibleYear += 1
    } else {
      visibleMonth += 1
    }
  }

  function previousMonth() {
    if(visibleMonth == 0) {
      visibleMonth = 11
      visibleYear -= 1
    } else {
      visibleMonth -= 1
    }
  }

  function handleDayClick(dayStat: DateStat) {
    let selection = DateTime.now().set({ 
      day: dayStat.dayOfMonth,
      month: dayStat.month + 1,
      year: dayStat.year
    })
    selectedDate = selection.toJSDate()
  }

  function handlePlusClick(dayStat: DateStat) {
    goto(`/teams/${team.id}/events/new`)
  }

  function isGreaterThan(array: any[] | undefined, num: number) {
    if(!!array) return array.length > num
    else return false
  }

  $: if(!!events) groupEventByDate()
  $: {
    if(!!selectedDate) {
      let key = DateTime.now().set({
        day: selectedDate.getDate(),
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear()
      }).toFormat('yyyyMMdd')

      selectedEvents = dayGroupedEvents[key] || []
    }
  }

  import colors from "$lib/stores/colors";
  import Calendar from "@likable-hair/svelte/dates/Calendar.svelte"
  import Icon from "@likable-hair/svelte/media/Icon.svelte"
  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";
</script>

<MediaQuery 
  let:mAndDown
>
  <div
    style:height="auto"
    style:width="100%"
  >
    {#if mAndDown}
      <div class="month-switcher">
        <Icon
          name="mdi-chevron-left"
          click
          on:click={previousMonth}
        ></Icon>
        <div>
          <slot name="options">
          </slot>
        </div>
        <Icon
          name="mdi-chevron-right"
          click
          on:click={nextMonth}
        ></Icon>
      </div>
      <div 
        class="month-name"
        style:margin-bottom="20px"
      >
        {monthName}
      </div>
    {:else}
      <div class="month-switcher">
        <Icon
          name="mdi-chevron-left"
          click
          on:click={previousMonth}
        ></Icon>
        <Icon
          name="mdi-chevron-right"
          click
          on:click={nextMonth}
        ></Icon>
        <div class="month-name">
          {monthName}
        </div>
        <div>
          <slot name="options">
          </slot>
        </div>
        <slot name="header-append"></slot>
      </div>
    {/if}
  </div>
</MediaQuery>

<style>
  @media (max-width: 1024px) {
    .month-switcher {
      justify-content: space-between;
      margin-bottom: 10px;
      margin-top: 10px;
    }

    .day-slot {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    .dot {
      background-color: var(--global-primary-color);
      height: 4px;
      width: 4px;
      border-radius: 50%;
      top: 27px;
      position: absolute;
    }

    .day-of-month {
      border-radius: 50%;
      height: 30px;
      width: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  @media (min-width: 1025px) {
    .month-switcher {
      justify-content: left;
      margin-bottom: 20px;
      margin-top: 20px;
    }

    .day-slot {
      border: 1px solid;
      height: 130px;
      position: relative;
    }

    .day-of-month {
      position: absolute;
      right: 5px;
      bottom: 5px;
    }
  }

  .day-slot:hover .add-new {
    display: block !important;
  }

  .add-new {
    display: none;
    position: absolute;
    left: 5px;
    bottom: 5px;
    border-radius: 5px;
  }

  .month-switcher {
    display: flex;
    gap: 20px;
  }

  .month-name {
    font-size: 1.5rem;
    min-width: 200px;
    text-align: center;
  }

  .event-post::before {
    content: '';
    position: absolute;
    left: 5px;
    top: 0px;
    height: 38px;
    width: 3px;
    border-radius: 2px 2px 0px 0px;
    background-color: var(--global-primary-color);
  }

  .event-post {
    font-size: .9rem;
    word-break: keep-all;
    margin: 5px;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-right: 4px;
    padding-left: 8px;
    text-overflow: clip;
    overflow: hidden;
    border-radius: 3px;
    height: 30px;
  }
</style>