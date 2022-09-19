<script lang="ts">
  import team from "$lib/stores/teams/teamsShow"
</script>

{#if !!$team}
  events list
{/if}