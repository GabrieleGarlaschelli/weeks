<script lang="ts">
  import team from "$lib/stores/teams/teamsShow"
  import RolesService from "$lib/services/roles/roles.service";

  async function handleRoleDestroy() {
    if(!!$team) {
      let service = new RolesService({ fetch })
      let response = await service.list({ team: $team })
      $team.roles = response.data
    }
  }

  import RolesList from "$lib/components/roles/RolesList.svelte";
</script>

{#if !!$team}
  <RolesList
    team={$team}
    searchable={true}
    roles={$team.roles}
    on:destroy={handleRoleDestroy}
  ></RolesList>
{/if}