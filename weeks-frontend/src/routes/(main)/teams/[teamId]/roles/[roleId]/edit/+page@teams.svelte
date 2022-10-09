<script lang="ts" context="module">
  import type { Role } from "$lib/services/roles/roles.service"
</script>

<script lang="ts">
  import { page } from "$app/stores"
  import { onMount } from "svelte"
  import RoleService from "$lib/services/roles/roles.service"
  import CansService from '$lib/services/roles/cans.service';

  let role: Role
  onMount(async () => {
    let service = new RoleService({ fetch })
    role = await service.show({ id: parseInt($page.params.roleId) })
  })

  let loading = false
  function handleConfirmClick() {
    loading = true

    let service = new RoleService({ fetch })
    service.update(role).then(() => {
      loading = false
      window.history.back()
    })
  }

  function handleCancelClick() {
    window.history.back()
  }


  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";
  import PageTitle from "$lib/components/typography/PageTitle.svelte";
  import RoleForm from "$lib/components/roles/RoleForm.svelte";
  import ConfirmOrCancelButtons from '$lib/components/common/ConfirmOrCancelButtons.svelte';
</script>

{#if CansService.can('Role', 'update')}  
  <MediaQuery
    let:mAndDown
  >
    <PageTitle
      title={role?.name || ''}
      paddingTop={mAndDown ? "15px" : "40px"}
      prependVisible={true}
    ></PageTitle>

    {#if !!role}
      <div 
        style:margin-top="20px"
      >
        <RoleForm
          mode="update"
          role={role}
        ></RoleForm>
        <ConfirmOrCancelButtons
          on:confirm-click={handleConfirmClick}
          on:cancel-click={handleCancelClick}
          loading={loading}
        ></ConfirmOrCancelButtons>
      </div>
    {:else}
      no team
    {/if}
  </MediaQuery>
{:else}
  Non puoi accedere a questa pagina :(
{/if}

