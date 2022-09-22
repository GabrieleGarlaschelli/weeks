<script lang="ts">
  import TeamsWeekList from "$lib/components/teams/TeamsWeekList.svelte";
  import team from "$lib/stores/teams/teamsShow"
</script>

{#if !!$team}
  <TeamsWeekList
    team={$team}
  ></TeamsWeekList>
{/if}