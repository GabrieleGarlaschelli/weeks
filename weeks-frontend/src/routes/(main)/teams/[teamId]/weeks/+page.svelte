<script lang="ts">
  import TeamsWeekList from "$lib/components/teams/TeamsWeekList.svelte";
  import team from "$lib/stores/teams/teamsShow"
	import { onMount } from "svelte";

  let visibleWeek: number, visibleYear: number

  onMount(() => {
    let visibleYearCached = localStorage.getItem('teams:weeks:visibleYear')
    let visibleWeekCached = localStorage.getItem('teams:weeks:visibleWeek')

    if(visibleYearCached !== undefined && visibleYearCached !== null) visibleYear = parseInt(visibleYearCached)
    if(visibleWeekCached !== undefined && visibleWeekCached !== null) visibleWeek = parseInt(visibleWeekCached)
  })

  function handleWeekChange(e: CustomEvent<{ visibleYear: number, visibleWeek: number}>) {
    localStorage.setItem('teams:weeks:visibleYear', visibleYear.toString())
    localStorage.setItem('teams:weeks:visibleWeek', visibleWeek.toString())
  }
</script>

{#if !!$team}
  <TeamsWeekList
    team={$team}
    bind:visibleWeek={visibleWeek}
    bind:visibleYear={visibleYear}
    on:nextWeek={handleWeekChange}
    on:previousWeek={handleWeekChange}
  ></TeamsWeekList>
{/if}