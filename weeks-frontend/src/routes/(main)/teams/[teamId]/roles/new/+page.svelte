<script lang="ts">
  import RolesService from '$lib/services/roles/roles.service'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import CansService from '$lib/services/roles/cans.service';

  let role: {
    name?: string,
    team: { id: number }
  } = {
    team: { id: parseInt($page.params.teamId) }
  }
  let loading = false

  function handleSubmit() {
    let service = new RolesService({ fetch })
    loading = true
    service.create(role).then(() => {
      loading = false
      goto(`/teams/${role.team.id}/roles`)
    }).catch((error) => {
      console.log(error)
      loading = false
    })
  }

  function handleCancel() {
    goto(`/teams/${role.team.id}/roles`)
  }

  import PageTitle from "$lib/components/typography/PageTitle.svelte"
  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";
  import ConfirmOrCancelButtons from '$lib/components/common/ConfirmOrCancelButtons.svelte';
  import RoleForm from '$lib/components/roles/RoleForm.svelte';
</script>


{#if CansService.can('Role', 'update')}
  <MediaQuery
    let:mAndDown
  >
    <PageTitle
      title="Nuovo ruolo"
      paddingTop={mAndDown ? "15px" : "40px"}
      prependVisible={true}
    ></PageTitle>

    <div 
      style:margin-top="20px"
    >
      <RoleForm
        role={role}
      ></RoleForm>
      <ConfirmOrCancelButtons
        on:cancel-click={handleCancel}
        on:confirm-click={handleSubmit}
        loading={loading}
      ></ConfirmOrCancelButtons>
    </div>
  </MediaQuery>
{:else}
  Non puoi accedere a questa pagina :(
{/if}