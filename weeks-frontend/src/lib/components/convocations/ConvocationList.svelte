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
  }>()

  export let convocations: Convocation[] = []

  function translateConfirmationStatus(confirmationStatus: string | undefined) {
    if(!confirmationStatus) return 'Non specificato'

    let mappers: any = {
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
</script>

{#each convocations as convocation}
  <div 
    style:margin-top="10px"
    style:display="flex"
    style:align-items="center"
  >
    <div class="name-column">
      <UserAvatar
        src={convocation.teammate.user.avatarUrl}
        username={convocation.teammate.user.name}
        description={!!convocation.teammate.role ? convocation.teammate.role.name : undefined}
      ></UserAvatar>
    </div>
    <div 
      class="chip-column"
      style:margin-left="40px"
    >
      <StandardChip
        warning={convocation.confirmationStatus == 'denied'}
      >
        <span style:font-weight="700">{translateConfirmationStatus(convocation.confirmationStatus)}</span>
      </StandardChip>
    </div>
    {#if convocation.teammate.userId == $session.currentUser.id || CansService.can('Convocation', 'confirm') || CansService.can('Convocation', 'deny')}
      <div 
        style:margin-left="20px"
        style:display="flex"
        style:gap="20px"
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
  @media (max-width: 768px){
  }

  @media (min-width: 769px){
    .name-column {
      width: 300px
    }

    .chip-column {
      width: 200px;
      display: flex;
    }
  }
</style>