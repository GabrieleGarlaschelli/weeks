<script lang="ts" context="module">
  import type { Invitation } from '$lib/services/invitations/invitations.service'
</script>

<script lang="ts">
  import InvitationsService from '$lib/services/invitations/invitations.service';
  import { createEventDispatcher } from 'svelte';
  let dispatch = createEventDispatcher<{
    'accept': {
      invitation: Invitation
    },
    'reject': {
      invitation: Invitation
    },
  }>()

  export let invitations: Invitation[] = []
  
  function handleReject(invitation: Invitation) {
    let service = new InvitationsService({ fetch })
    service.rejectInvitation({ invitation: invitation }).then((newInvitation) => {
      dispatch('reject', { invitation: newInvitation })
    })
  }

  function handleAccept(invitation: Invitation) {
    let service = new InvitationsService({ fetch })
    service.acceptInvitation({ invitation: invitation }).then((newInvitation) => {
      dispatch('accept', { invitation: newInvitation })
    })
  }

  import colors from "$lib/stores/colors";
  import LinkButton from '$lib/components/LinkButton.svelte';
  import StandardButton from '../StandardButton.svelte';
</script>

{#if !!invitations && invitations.length > 0}
  {#each invitations as invitation}
    <div 
      style:background-color={$colors.thinContrast}
      class="invitation-container"
    >
      <div class="invitation-info-container">
        <div class="team-name">{invitation.team.name}</div>
        <div style:margin-top="10px">
          {#if !!invitation.role}
            {invitation.invitedBy.name} ti ha invitato al team come 
            <span style:color={$colors.primary}>{invitation.role.name}</span>
          {:else}
            {invitation.invitedBy.name} ti ha invitato al team
          {/if}
        </div>
      </div>
      <div class="button-container">
        <div class="link-button-container">
          <LinkButton
            on:click={() => handleReject(invitation)}
          >Rifiuta</LinkButton>
        </div>
        <StandardButton
          width={"auto"}
          on:click={() => handleAccept(invitation)}
        >Accetta</StandardButton>
      </div>
    </div>
  {/each}
{:else if !!invitations && invitations.length == 0}
  Ops, nessun invito
{/if}

<style>
  @media (max-width: 768px){
  }

  @media (min-width: 769px){
  }

  .team-name {
    font-weight: 700;
    font-size: 1.4rem;
  }

  .invitation-container {
    display: flex;
    flex-direction: column;
    width: fit-content;
    padding: 20px;
    border-radius: 5px;
  }

  .invitation-info-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .button-container {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 20px;
  }

  .link-button-container {
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>