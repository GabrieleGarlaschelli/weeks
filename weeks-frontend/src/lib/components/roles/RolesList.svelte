<script lang="ts" context="module">
  import type { Role } from '$lib/services/roles/roles.service'
  import type { Header } from '@likable-hair/svelte/common/SimpleTable.svelte'
  import type { Team } from '$lib/services/teams/teams.service'
</script>

<script lang="ts">
  import { goto } from '$app/navigation';
  import RolesService from '$lib/services/roles/roles.service';
  import { createEventDispatcher } from 'svelte';

  let dispatch = createEventDispatcher<{
    "destroy": { },
  }>()

  export let roles: Role[] = [],
    team: Team | undefined = undefined,
    searchable: boolean = false

  let headers: Header[] = [
    {
      value: "id",
      label: "Id",
      type: 'number',
      width: '20px'
    },
    {
      value: "name",
      label: "Nome",
      type: 'string',
    }
  ]

  let searchText: string
  $: filteredRoles = !!searchText ? roles.filter((role) => {
    return role.name.toLowerCase().includes(searchText.toLowerCase())
  }) : roles

  function goToNewRole(event: any) {
    if(!!team) {
      goto(`/teams/${team.id}/roles/new`)
    }
  }

  function goToEdit(role: any) {
    if(!!team && !!role.id) {
      goto(`/teams/${team.id}/roles/${role.id}/edit`)
    }
  }

  let confirmDialogOpen: boolean, deletingRole: Role | undefined
  function handleDeleteClick(role: any) {
    deletingRole = role
    confirmDialogOpen = true
  }

  function confirmRoleDeletion() {
    confirmDialogOpen = false

    if(!!deletingRole) {
      let service = new RolesService({ fetch })
      service.destroy({
        id: deletingRole.id
      }).then(() => {
        dispatch('destroy')
      })
    }
  }

  import StandardTable from '$lib/components/common/StandardTable.svelte';
  import StandardTextfield from '$lib/components/StandardTextfield.svelte';
  import Icon from '@likable-hair/svelte/media/Icon.svelte';
  import colors from '$lib/stores/colors';
  import StandardButton from '$lib/components/StandardButton.svelte';
  import ConfirmDialog from '$lib/components/common/ConfirmDialog.svelte';
</script>


{#if searchable}
  <div
    style:max-width="100%"
    style:width="400px"
    style:margin-bottom="0px"
    style:display="flex"
  >
    <StandardTextfield
      bind:value={searchText}
      placeholder="Cerca ruoli ..."
    >
      <svelte:fragment
        slot="prepend-inner"
      >
        <div style:margin-right="10px">
          <Icon 
            name="mdi-search-web"
            color={$colors.lightContrast}
          ></Icon>
        </div>
      </svelte:fragment>
    </StandardTextfield>
    <div
      style:margin-left="10px"
    >
      <StandardButton
        on:click={goToNewRole}
      >Nuovo</StandardButton>
    </div>
  </div>
{/if}

<StandardTable
  headers={headers}
  items={filteredRoles}
>
  <div 
    style:display="flex"
    style:justify-content="end"
    slot="appendLastColumn" 
    let:item
  >
    <div style:margin-right="10px">
      <Icon 
        name="mdi-pencil"
        color={$colors.contrast}
        click
        on:click={() => goToEdit(item)}
      ></Icon>
    </div>
    <Icon 
      name="mdi-delete"
      click
      color={$colors.warning}
      on:click={() => handleDeleteClick(item)}
    ></Icon>
  </div>
</StandardTable>

<ConfirmDialog
  confirmText="Elimina"
  title="Eliminazione ruolo"
  description={`Sei sicuro di voler eliminare il ruolo ${deletingRole?.name}?`}
  bind:open={confirmDialogOpen}
  on:cancel-click={() => confirmDialogOpen = false}
  on:confirm-click={confirmRoleDeletion}
></ConfirmDialog>