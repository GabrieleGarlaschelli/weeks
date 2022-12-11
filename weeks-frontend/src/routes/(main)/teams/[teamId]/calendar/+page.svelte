<script lang="ts">
  import team from "$lib/stores/teams/teamsShow"
  import teammate from "$lib/stores/teams/teamsTeammate"
  
  import TeamsCalendarWithSidebar from "$lib/components/teams/TeamsCalendarWithSidebar.svelte";
</script>

{#if !!$team}
  <TeamsCalendarWithSidebar
    team={$team}
    teammate={$teammate}
  ></TeamsCalendarWithSidebar>
{/if}