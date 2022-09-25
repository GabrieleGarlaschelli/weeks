<script lang="ts" context="module">
  import type { Team } from "$lib/services/teams/teams.service"
  import type { DateStat } from "@likable-hair/svelte/dates/utils"
  import type { Event } from "$lib/services/events/events.service"
  import type { Option } from '$lib/components/common/OptionSelector.svelte'
</script>

<script lang="ts">
  import { DateTime } from "luxon";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import colors from "$lib/stores/colors";
  import CansService from '$lib/services/roles/cans.service';
  import EventsService from "$lib/services/events/events.service";
  import qs from 'qs'

  export let team: Team,
    selectedDate: Date = new Date(),
    selectedEvents: Event[] = [],
    events: Event[],
    visibleYear: number = DateTime.now().get('year'),
    visibleWeek: number = DateTime.now().get('weekNumber')


  let dayGroupedEvents: {
      [key: string]: Event[] | undefined
    } = {},
    options: Option[] = []

  onMount(() => {
    groupEventByDate()

    if(CansService.can('Event', 'update')) {
      options.push({
        name: 'edit',
        label: 'Modifica',
        icon: 'mdi-pencil'
      })
    }

    options.push({
      name: 'view',
      label: 'Visualizza',
      icon: 'mdi-eye'
    })

    if(CansService.can('Event', 'destroy')) {
      options.push({
        name: 'destroy',
        label: 'Elimina',
        icon: 'mdi-delete',
        color: $colors.warning
      })
    }
  })

  function groupEventByDate() {
    dayGroupedEvents = {}

    if(!!events && events.length > 0) {
      for(let i = 0; i < events.length; i += 1) {
        let dayKey = DateTime.fromJSDate(events[i].start).toFormat('yyyyMMdd')
        if(!dayGroupedEvents[dayKey]) dayGroupedEvents[dayKey] = []
        dayGroupedEvents[dayKey]?.push(events[i])
      }

      dayGroupedEvents = { ...dayGroupedEvents }
    }
  }

  let weekName: string = ""
  $: {
    let firstDayOfWeek = DateTime.fromObject({
      weekday: 1,
      weekNumber: visibleWeek,
      weekYear: visibleYear
    }).setLocale('it')
    .toLocaleString({ 
      day: 'numeric',
      month: 'short'
    })

    let lastDayOfWeek = DateTime.fromObject({
      weekday: 7,
      weekNumber: visibleWeek,
      weekYear: visibleYear
    }).setLocale('it')
    .toLocaleString({ 
      day: 'numeric',
      month: 'short'
    })

    weekName = `${firstDayOfWeek} - ${lastDayOfWeek} ${visibleYear}`
  }

  function nextWeek() {
    let currentVisibleWeek = DateTime.fromObject({
      weekday: 1,
      weekNumber: visibleWeek,
      weekYear: visibleYear
    })

    let nextVisibleWeek = currentVisibleWeek.plus({
      week: 1
    })

    if(currentVisibleWeek.get('weekYear') != nextVisibleWeek.get('weekYear')) {
      visibleYear += 1
      visibleWeek = 1
    } else {
      visibleWeek += 1
    }
  }

  function previousWeek() {
    let currentVisibleWeek = DateTime.fromObject({
      weekday: 1,
      weekNumber: visibleWeek,
      weekYear: visibleYear
    })

    let previousVisibleWeek = currentVisibleWeek.minus({
      week: 1
    })

    if(currentVisibleWeek.get('weekYear') != previousVisibleWeek.get('weekYear')) {
      visibleWeek = previousVisibleWeek.get('weekNumber')
      visibleYear -= 1
    } else {
      visibleWeek -= 1
    }
  }

  function getEventsFromWeekDay(weekday: number): Event[] | undefined {
    let date = DateTime.fromObject({
      weekNumber: visibleWeek,
      weekYear: visibleYear,
      weekday: weekday
    })

    return dayGroupedEvents[date.toFormat('yyyyMMdd')]
  }

  function getWeekdayNameFromIndex(weekday: number): string {
    return DateTime.fromObject({
      weekNumber: visibleWeek,
      weekYear: visibleYear,
      weekday: weekday
    }).setLocale('it').toLocaleString({
      weekday: 'long',
      day: 'numeric'
    })
  }

  function getEventTimeRangeString(event: Event): string {
    let fromTime = DateTime.fromJSDate(event.start).toFormat('HH:mm')
    let toTime = DateTime.fromJSDate(event.end).toFormat('HH:mm')

    return `${fromTime} - ${toTime}`
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

  let confirmDeletionDialogOpen: boolean = false, deletingEvent: Event | undefined, loadingDelete: boolean = false
  function handleEventOptionClick(e: CustomEvent<{option: Option}>, event: Event) {
    if(e.detail.option.name == 'edit' && !!team) {
      goto(`/teams/${team.id}/events/${event.id}/edit`)
    } else if(e.detail.option.name == 'view' && !!team) {
      goto(`/teams/${team.id}/events/${event.id}/general`)
    } else if(e.detail.option.name == 'destroy' && !!team) {
      confirmDeletionDialogOpen = true
      deletingEvent = event
    }
  }

  async function handleConfirm() {
    if(!!deletingEvent) {
      loadingDelete = true
      let service = new EventsService({ fetch })
      await service.destroy({ id: deletingEvent.id })
      loadingDelete = false
      confirmDeletionDialogOpen = false
      events = events.filter((ev) => ev.id != deletingEvent?.id)
    }
  }

  function handlePlusClick(weekday: number) {
    let precompiled = DateTime.fromObject({
      weekNumber: visibleWeek,
      weekYear: visibleYear,
      weekday: weekday
    })

    goto(`/teams/${team.id}/events/new?${qs.stringify({ start: precompiled.toJSDate() })}`)
  }

  import Icon from "@likable-hair/svelte/media/Icon.svelte"
  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte"
  import Divider from "$lib/components/Divider.svelte"
  import OptionMenu from "$lib/components/common/OptionMenu.svelte"
  import ConfirmDialog from '$lib/components/common/ConfirmDialog.svelte';
</script>

<MediaQuery 
  let:mAndDown
>
  <div
    style:height="auto"
    style:width="100%"
  >
    {#if mAndDown}
      <div class="week-switcher">
        <Icon
          name="mdi-chevron-left"
          click
          on:click={previousWeek}
        ></Icon>
        <div>
          <slot name="options">
          </slot>
        </div>
        <Icon
          name="mdi-chevron-right"
          click
          on:click={nextWeek}
        ></Icon>
      </div>
      <div 
        class="week-name"
        style:margin-bottom="20px"
      >
        {weekName}
      </div>
    {:else}
      <div class="week-switcher">
        <Icon
          name="mdi-chevron-left"
          click
          on:click={previousWeek}
        ></Icon>
        <Icon
          name="mdi-chevron-right"
          click
          on:click={nextWeek}
        ></Icon>
        <div class="week-name">
          {weekName}
        </div>
        <slot name="options"></slot>
      </div>
    {/if}
    <div class="date-list">
      {#key dayGroupedEvents}
        {#each [1, 2, 3, 4, 5, 6, 7] as index}
          <div class="day-container">
            <div class="day-name">{getWeekdayNameFromIndex(index)}</div>
            <div style:flex-grow="1">
              {#if CansService.can('Event', 'create')}
                <div>
                  <Icon 
                    name="mdi-plus"
                    click
                    on:click={() => handlePlusClick(index)}
                  ></Icon>
                </div>
              {/if}
              {#if !!getEventsFromWeekDay(index)}
                {#each getEventsFromWeekDay(index) || [] as event}
                  <div class="event">
                    <div class="event-title">
                      {event.name}
                      <div style:margin-left="10px">
                        <OptionMenu
                          options={options}
                          on:option-click={(e) => handleEventOptionClick(e, event)}
                        ></OptionMenu>
                      </div>
                    </div>
                    <div class="event-subtitle">
                      <Icon name='mdi-clock' size={10}></Icon>
                      {getEventTimeRangeString(event)}
                    </div>
                    <div 
                      class="event-description"
                      style:white-space="pre-wrap"
                    >
                      <Icon name='mdi-text' size={10}></Icon>
                      {event.description}
                    </div>
                  </div>
                {/each}
              {/if}
            </div>
          </div>
          <Divider marginLeft="0px"></Divider>
        {/each}
      {/key}
    </div>
  </div>
</MediaQuery>

<ConfirmDialog
  confirmText="Elimina"
  cancelText="Annulla"
  title="Cancella evento"
  description={`Sei sicuro di voler cancellare l'evento ${deletingEvent?.name}?`}
  bind:open={confirmDeletionDialogOpen}
  on:cancel-click={() => confirmDeletionDialogOpen = false}
  on:confirm-click={handleConfirm}
></ConfirmDialog>

<style>
  @media (max-width: 1024px) {
    .week-switcher {
      justify-content: space-between;
      margin-bottom: 10px;
      margin-top: 10px;
    }
  }

  @media (min-width: 1025px) {
    .week-switcher {
      justify-content: left;
      margin-bottom: 20px;
      margin-top: 20px;
    }
  }

  .week-switcher {
    display: flex;
    gap: 20px;
  }

  .week-name {
    font-size: 1.6rem;
    font-weight: 700;
    min-width: 200px;
    text-align: center;
  }

  .day-container {
    display: flex;
    align-items: flex-start;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .day-name {
    font-weight: 500;
    min-width: 130px;
    font-size: 1.3rem;
  }

  .event {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .event-title {
    font-weight: 500;
    font-size: 1.2rem;
    display: flex;
  }

  .event-subtitle {
    font-weight: 200;
    font-size: 1rem;
    margin-left: 15px;
  }

  .event-description {
    margin-left: 15px;
  }
</style>