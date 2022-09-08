<script lang="ts" context="module">
  import type { Convocation } from "$lib/services/convocations/convocations.service";
</script>

<script lang="ts">
  import { session } from '$app/stores'
  import UserAvatar from "$lib/components/UserAvatar.svelte";
  import StandardChip from '$lib/components/common/StandardChip.svelte';
  import Icon from '@likable-hair/svelte/media/Icon.svelte';
  import CansService from "$lib/services/roles/cans.service";
  import CircularLoader from '@likable-hair/svelte/loaders/CircularLoader.svelte';
  import colors from "$lib/stores/colors";
  import { createEventDispatcher } from "svelte";
  import ConvocationsService from "$lib/services/convocations/convocations.service";

  let dispatch = createEventDispatcher<{
    'confirm': {
      convocation: Convocation
    },
    'deny': {
      convocation: Convocation
    },
    'unConvocate': {
      convocation: Convocation
    },
    'convocate': {
      convocation: Convocation
    },
  }>()

  export let convocations: Convocation[] = []

  function translateConfirmationStatus(confirmationStatus: string | undefined) {
    if(!confirmationStatus) return 'Non specificato'

    let mappers: any = {
      'pending': 'Non specificato',
      'confirmed': 'Presenza confermata',
      'denied': 'Presenza rifiutata'
    }
    return mappers[confirmationStatus]
  }

  let loading: boolean = false
  function confirmConvocation(convocation: Convocation) {
    loading = true
    let service = new ConvocationsService({ fetch })
    service.confirm({ id: convocation.id }).then((newConvocation) => {
      loading = false
      dispatch('confirm', { convocation: newConvocation })
    }).finally(() => {
      loading = false
    })
  }

  function denyConvocation(convocation: Convocation) {
    loading = true
    let service = new ConvocationsService({ fetch })
    service.deny({ id: convocation.id }).then((newConvocation) => {
      loading = false
      dispatch('deny', { convocation: newConvocation })
    }).finally(() => {
      loading = false
    })
  }

  function unConvocate(convocation: Convocation) {
    loading = true
    let service = new ConvocationsService({ fetch })
    service.unConvocate({
      event: {
        id: convocation.eventId
      },
      teammates: [
        {
          id: convocation.teammateId
        }
      ]
    }).then(() => {
      loading = false
      console.log('dispatch unconvocate')
      dispatch('unConvocate', { convocation: convocation })
    })
  }
</script>

{#each convocations as convocation}
  <div 
    style:margin-top="20px"
    style:display="flex"
    class="convocation-container"
  >
    <div class="info-container">
      <div class="name-column">
        <UserAvatar
          src={convocation.teammate.user.avatarUrl}
          username={convocation.teammate.user.name}
          description={!!convocation.teammate.role ? convocation.teammate.role.name : undefined}
        ></UserAvatar>
      </div>
      <div 
        class="chip-column"
      >
        <StandardChip
          warning={convocation.confirmationStatus == 'denied'}
        >
          <span style:font-weight="700">{translateConfirmationStatus(convocation.confirmationStatus)}</span>
        </StandardChip>
      </div>
    </div>
    {#if convocation.teammate.userId == $session.currentUser.id || CansService.can('Convocation', 'confirm') || CansService.can('Convocation', 'deny')}
      <div 
        
        class="confirm-button-container"
      >
        {#if !loading}
          {#if CansService.can('Convocation', 'confirm') || convocation.teammate.userId == $session.currentUser.id}
            <Icon
              name="mdi-check"
              click
              on:click={() => confirmConvocation(convocation)}
            ></Icon>
          {/if}
          {#if CansService.can('Convocation', 'deny') || convocation.teammate.userId == $session.currentUser.id}
            <Icon
              name="mdi-close"
              click
              on:click={() => denyConvocation(convocation)}
            ></Icon>
          {/if}
          {#if CansService.can('Event', 'convocate')}
            <Icon
              name="mdi-delete"
              click
              on:click={() => unConvocate(convocation)}
            ></Icon>
          {/if}
        {:else}
          <CircularLoader
            color={$colors.contrast}
          ></CircularLoader>
        {/if}
      </div>
    {/if}
  </div>
{/each}

<style>
  @media (max-width: 768px) {
    .convocation-container {
      flex-direction: column;
      gap: 10px;
      align-items: flex-start;
      background-color: var(--global-thin-contrast-color);
      padding: 10px;
      border-radius: 10px;
    }

    .confirm-button-container {
      width: 100%;
      margin-top: 20px;
    }
  }

  @media (min-width: 769px){
    .convocation-container {
      align-items: center;
    }

    .name-column {
      width: 300px
    }

    .chip-column {
      width: 200px;
      display: flex;
    }
  }

  .info-container {
    display: flex;
  }

  .confirm-button-container {
    margin-left: 20px;
    display: flex;
    justify-content: center;
    gap: 20px
  }
</style>