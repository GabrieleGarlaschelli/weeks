<script lang="ts" context="module">
  import type { Teammate, Team } from '$lib/services/teams/teams.service'
  import type { Header } from '@likable-hair/svelte/common/SimpleTable.svelte'
</script>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { createEventDispatcher } from 'svelte';
  import InvitationsService from '$lib/services/invitations/invitations.service'

  let dispatch = createEventDispatcher<{
    "destroy": { },
  }>()

  export let teammates: Teammate[] = [],
    team: Pick<Team, 'id' | 'ownerId'>,
    searchable: boolean = false

  let headers: Header[] = [
    {
      value: "name",
      label: "Nome",
      type: 'custom',
    },
    {
      value: "email",
      label: "Email",
      type: 'custom',
    },
    {
      value: "role",
      label: "Ruolo",
      type: 'custom',
    },
  ]

  let searchText: string
  $: filteredTeammates = !!searchText ? teammates.filter((teammate) => {
    return teammate.user.name.toLowerCase().includes(searchText.toLowerCase())
  }) : teammates

  function inviteUser(event: any) {
    goto('/teams/' + team.id + '/inviteUser' )
  }

  let confirmDialogOpen: boolean, deletingTeammate: Teammate | undefined
  function handleDeleteClick(teammate: any) {
    deletingTeammate = teammate
    confirmDialogOpen = true
  }

  function confirmTeammateDeletion() {
    confirmDialogOpen = false

    if(!!deletingTeammate) {
      let service = new InvitationsService({ fetch })
      service.removeUser({
        team: team,
        user: {
          id: deletingTeammate.userId
        }
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
    style:width="100%"
    style:margin-bottom="0px"
    style:display="flex"
  >
    <StandardTextfield
      bind:value={searchText}
      maxWidth="300px"
      placeholder="Cerca partecipanti ..."
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
      style:flex-grow="1"
    ></div>
    <div
      style:margin-left="10px"
    >
      <StandardButton
        on:click={inviteUser}
      >Invita</StandardButton>
    </div>
  </div>
{/if}

<div
  style:max-width="100%"
  style:overflow="auto"
>
  <StandardTable
    headers={headers}
    items={filteredTeammates}
  >
    <svelte:fragment 
      slot="customColumn"
      let:item
      let:header
    >
      {#if header.value == 'name'}
        {item.user.name}
      {:else if header.value == 'email'}
        {item.user.email}
      {:else if header.value == 'role'}
        {#if !!item.role?.name}
          {item.role?.name}
        {:else if !!team.ownerId && item.user.id == team.ownerId}
          Proprietario
        {:else}
          Nessuno
        {/if}
      {/if}
    </svelte:fragment>
    <div 
      style:display="flex"
      style:justify-content="end"
      slot="appendLastColumn" 
      let:item
    >
      {#if (!!team.ownerId && item.user.id != team.ownerId) || !team.ownerId}
        <Icon 
          name="mdi-delete"
          click
          color={$colors.warning}
          on:click={() => handleDeleteClick(item)}
        ></Icon>
      {/if}
    </div>
  </StandardTable>
</div>

<ConfirmDialog
  confirmText="Elimina"
  title="Eliminazione ruolo"
  description={`Sei sicuro di voler rimuovere ${deletingTeammate?.user?.name}?`}
  bind:open={confirmDialogOpen}
  on:cancel-click={() => confirmDialogOpen = false}
  on:confirm-click={confirmTeammateDeletion}
></ConfirmDialog>