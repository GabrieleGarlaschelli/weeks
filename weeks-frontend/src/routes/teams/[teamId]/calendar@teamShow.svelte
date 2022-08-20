<script lang="ts">
  import team from "$lib/stores/teams/teamsShow"

  let selectedDate: Date | undefined

  import TeamsCalendar from "$lib/components/teams/TeamsCalendar.svelte";
  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";
</script>

<MediaQuery 
  let:mAndDown
>
  {#if $team}
    <div
      class="calendar-container"
    >
      <TeamsCalendar
        bind:selectedDate={selectedDate}
        team={$team}
      ></TeamsCalendar>
      {#if !mAndDown && !!selectedDate}
        <div style:width="300px">
        </div>
      {/if}
    </div>
  {/if}
</MediaQuery>

<style>
  .calendar-container {
    display: flex;
  }
</style>