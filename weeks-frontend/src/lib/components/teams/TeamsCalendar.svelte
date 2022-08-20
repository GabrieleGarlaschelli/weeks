<script lang="ts" context="module">
  import type { Team } from "$lib/services/teams/teams.service"
  import type { DateStat } from "@likable-hair/svelte/dates/utils"
</script>

<script lang="ts">
  import { DateTime } from "luxon";
  import { onMount } from "svelte";
  import EventsService from "$lib/services/events/events.service"

  export let team: Team,
    selectedDate: Date = new Date()


  onMount(() => {
    loadEvents()
  })

  function loadEvents() {
    let service = new EventsService({ fetch })
    service.list({
      filters: {
        from: DateTime.now()
          .set({
            month: visibleMonth,
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
            month: visibleMonth,
            year: visibleYear
          })
          .startOf('month')
          .startOf('day')
          .startOf('hour')
          .startOf('minute')
          .startOf('millisecond')
          .toJSDate(),
        team: {
          id: team.id
        }
      }
    }).then((events) => {
      console.log(events)
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

  import colors from "$lib/stores/colors";
  import Calendar from "@likable-hair/svelte/dates/Calendar.svelte"
  import Icon from "@likable-hair/svelte/media/Icon.svelte"
  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";
</script>

<MediaQuery 
  let:mAndDown
>
  <div
    style:height="100%"
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
      height="100%"
    >
      <div
        slot="day"
        let:dayStat
        let:selected
        class="day-slot"
        on:click={() => handleDayClick(dayStat)}
      >
        {#if !mAndDown}
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
      height: 100px;
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
</style>