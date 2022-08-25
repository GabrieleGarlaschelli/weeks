<script lang="ts" context="module">
  import type { Team } from "$lib/services/teams/teams.service"
  import type { DateStat } from "@likable-hair/svelte/dates/utils"
  import type { Event } from "$lib/services/events/events.service"
</script>

<script lang="ts">
  import { DateTime } from "luxon";
  import { onMount } from "svelte";
  import EventsService from "$lib/services/events/events.service"

  export let team: Team,
    selectedDate: Date = new Date(),
    selectedEvents: Event[] = []


  let dayGroupedEvents: {
    [key: string]: Event[] | undefined
  } = {}

  onMount(() => {
    loadEvents()
  })

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
          .toJSDate(),
        team: {
          id: team.id
        }
      }
    }).then((events) => {
      for(let i = 0; i < events.length; i += 1) {
        let dayKey = DateTime.fromJSDate(events[i].start).toFormat('yyyyMMdd')
        if(!dayGroupedEvents[dayKey]) dayGroupedEvents[dayKey] = []
        dayGroupedEvents[dayKey]?.push(events[i])
      }
    })
  }

  let visibleMonth: number = DateTime.now().get('month') - 1,
    visibleYear: number = DateTime.now().get('year')
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

  function isGreaterThan(array: any[] | undefined, num: number) {
    if(!!array) return array.length > num
    else return false
  }

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
    <div class="month-switcher">
      <Icon
        name="mdi-chevron-left"
        click
        on:click={previousMonth}
      ></Icon>
      <div class="month-name">
        {monthName}
      </div>
      <Icon
        name="mdi-chevron-right"
        click
        on:click={nextMonth}
      ></Icon>
    </div>
    <Calendar
      bind:visibleMonth={visibleMonth}
      bind:visibleYear={visibleYear}
      bind:selectedDate={selectedDate}
      locale="it"
      height={mAndDown ? "200px" : "auto"}
      gridGap="0px"
    >
      <div
        slot="day"
        let:dayStat
        let:selected
        class="day-slot"
        style:border-color={$colors.thinContrast}
        on:click={() => handleDayClick(dayStat)}
      >
        {#if !mAndDown}
          <div>
            {#each dayGroupedEvents[DateTime.now().set({
              day: dayStat.dayOfMonth,
              month: dayStat.month + 1,
              year: dayStat.year
            }).toFormat('yyyyMMdd')]?.slice(0, 2) || [] as event}
              <div style:position="relative">
                <div 
                  class="event-post"
                  style:background-color={$colors.tertiary}
                  style:color={$colors.contrast}
                >
                  {event.name}
                </div>
              </div>
            {/each}
            {#if isGreaterThan(dayGroupedEvents[DateTime.now().set({
              day: dayStat.dayOfMonth,
              month: dayStat.month + 1,
              year: dayStat.year
            }).toFormat('yyyyMMdd')], 2)}
              <div
                style:margin-left="5px"
                style:font-size=".8rem"
              >
                and more
              </div>
            {/if}
          </div>
          <div
            class="add-new"
            style:background-color={$colors.primary}
          >
            <Icon
              name="mdi-plus"
              size={10}
              color={$colors.background}
            ></Icon>
          </div>
        {:else if isGreaterThan(dayGroupedEvents[DateTime.now().set({
              day: dayStat.dayOfMonth,
              month: dayStat.month + 1,
              year: dayStat.year
            }).toFormat('yyyyMMdd')], 0)}
          <div class="dot"></div>
        {/if}
        <div
          class="day-of-month"
          style:color={selected ? $colors.primary : $colors.contrast}
        >
          {dayStat.dayOfMonth}
        </div>
      </div>
    </Calendar>
  </div>
</MediaQuery>

<style>
  @media (max-width: 768px) {
    .month-switcher {
      justify-content: space-between;
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

  @media (min-width: 769px) {
    .month-switcher {
      justify-content: center;
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
    margin-bottom: 20px;
    margin-top: 20px;
  }

  .month-name {
    font-size: 1.5rem;
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