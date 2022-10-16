<script lang="ts" context="module">
  import type { Invitation } from '$lib/services/invitations/invitations.service'
  import type { Header } from '@likable-hair/svelte/common/SimpleTable.svelte'
</script>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { createEventDispatcher } from 'svelte';

  let dispatch = createEventDispatcher<{
    "discard": { 
      invitation: Invitation
    },
  }>()

  export let invitations: Invitation[] = []

  let headers: Header[] = [
    {
      value: "invitedEmail",
      label: "Email",
      type: 'string',
    },
    {
      value: "status",
      label: "Stato",
      type: 'custom',
    },
    {
      value: "role",
      label: "Ruolo",
      type: 'custom',
    },
    {
      value: "invitedBy",
      label: "Invitato da",
      type: 'custom',
    },
  ]

  let confirmDialogOpen: boolean, discardingInvitation: Invitation | undefined
  function handleDeleteClick(teammate: any) {
    discardingInvitation = teammate
    confirmDialogOpen = true
  }

  function confirmTeammateDeletion() {
    confirmDialogOpen = false

    if(!!discardingInvitation) {
      dispatch('discard', {
        invitation: discardingInvitation
      })
    }
  }

  import StandardTable from '$lib/components/common/StandardTable.svelte';
  import Icon from '@likable-hair/svelte/media/Icon.svelte';
  import colors from '$lib/stores/colors';
  import ConfirmDialog from '$lib/components/common/ConfirmDialog.svelte';
</script>

<div
  style:max-width="100%"
  style:overflow="auto"
>
  <StandardTable
    headers={headers}
    items={invitations}
  >
    <svelte:fragment 
      slot="customColumn"
      let:item
      let:header
    >
      {#if header.value == 'status'}
        {item.status}
      {:else if header.value == 'invitedBy'}
        {item.invitedBy.email}
      {:else if header.value == 'role'}
        {#if !!item.role?.name}
          {item.role?.name}
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
      <Icon 
        name="mdi-delete"
        click
        color={$colors.warning}
        on:click={() => handleDeleteClick(item)}
      ></Icon>
    </div>
  </StandardTable>
</div>

<ConfirmDialog
  confirmText="Annulla"
  cancelText="Mantieni"
  title="Annula invito"
  description={`Sei sicuro di voler annullare l'invito a ${discardingInvitation?.invitedEmail}?`}
  bind:open={confirmDialogOpen}
  on:cancel-click={() => confirmDialogOpen = false}
  on:confirm-click={confirmTeammateDeletion}
></ConfirmDialog>