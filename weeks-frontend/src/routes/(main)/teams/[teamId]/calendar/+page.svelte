<script lang="ts">
  import team from "$lib/stores/teams/teamsShow"
  
  import TeamsCalendarWithSidebar from "$lib/components/teams/TeamsCalendarWithSidebar.svelte";
</script>

{#if !!$team}
  <TeamsCalendarWithSidebar
    team={$team}
  ></TeamsCalendarWithSidebar>
{/if}