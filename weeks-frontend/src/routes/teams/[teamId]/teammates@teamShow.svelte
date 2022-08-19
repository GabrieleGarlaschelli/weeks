<script lang="ts">
  import team from "$lib/stores/teams/teamsShow"

  import TeammatesList from "$lib/components/teammates/TeammatesList.svelte";
</script>

{#if !!$team}
  <TeammatesList
    searchable={true}
    teammates={$team.teammates}
  ></TeammatesList>
{/if}