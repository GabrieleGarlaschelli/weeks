<script lang="ts">
  import team from "$lib/stores/teams/teamsShow"

  import RolesList from "$lib/components/roles/RolesList.svelte";
</script>

{#if !!$team}
  <RolesList
    team={$team}
    searchable={true}
    roles={$team.roles}
  ></RolesList>
{/if}