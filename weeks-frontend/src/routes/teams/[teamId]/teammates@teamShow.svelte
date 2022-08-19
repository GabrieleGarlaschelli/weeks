<script lang="ts">
  import team from "$lib/stores/teams/teamsShow"

  import TeammatesList from "$lib/components/teammates/TeammatesList.svelte";
</script>

<div 
  style:margin-top="20px"
>
  {#if !!$team}
    <TeammatesList
      searchable={true}
      teammates={$team.teammates}
      team={$team}
    ></TeammatesList>
  {/if}
</div>