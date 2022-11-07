<script lang="ts" context="module">
  import type { Convocation } from "$lib/services/convocations/convocations.service";
  import type { Chip } from "$lib/components/common/ChipMultipleSelection.svelte"
</script>

<script lang="ts">
  import user from "$lib/stores/user";
  import UserAvatar from "$lib/components/UserAvatar.svelte";
  import StandardChip from '$lib/components/common/StandardChip.svelte';
  import Icon from '@likable-hair/svelte/media/Icon.svelte';
  import CansService from "$lib/services/roles/cans.service";
  import CircularLoader from '@likable-hair/svelte/loaders/CircularLoader.svelte';
  import colors from "$lib/stores/colors";
  import { createEventDispatcher } from "svelte";
  import ConvocationsService from "$lib/services/convocations/convocations.service";
  import MediaQuery from '@likable-hair/svelte/common/MediaQuery.svelte'
  import Divider from "$lib/components/Divider.svelte"
  import StandardDialog from '$lib/components/common/StandardDialog.svelte'
	import OptionSelector, { type Option } from "$lib/components/common/OptionSelector.svelte";
  import RoleMultipleSelectorChip from "$lib/components/roles/RoleMultipleSelectorChip.svelte"

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

  let editConvocationsOptions: Option[]
  $: if(!!editingConvocation) {
    editConvocationsOptions = []
    if(CansService.can('Convocation', 'confirm') || editingConvocation.teammate.userId == $user?.id) {
      editConvocationsOptions.push({
        label: 'Conferma',
        name: 'confirm',
        icon: 'mdi-check'
      })
    }

    if(CansService.can('Convocation', 'confirm') || editingConvocation.teammate.userId == $user?.id) {
      editConvocationsOptions.push({
        label: 'Rifiuta',
        name: 'deny',
        icon: 'mdi-close'
      })
    }

    if(CansService.can('Event', 'convocate')) {
      editConvocationsOptions.push({
        label: 'Elimina',
        name: 'delete',
        icon: 'mdi-delete'
      })
    }

    editConvocationsOptions = [...editConvocationsOptions]
  }

  function handleConvocationOptionClick(e: CustomEvent<{option: Option}>) {
    if(!!editingConvocation) {
      if(e.detail.option.name == 'confirm') confirmConvocation(editingConvocation)
      else if(e.detail.option.name == 'deny') denyConvocation(editingConvocation)
      else if(e.detail.option.name == 'delete') unConvocate(editingConvocation)

      convocationDetailDialogOpen = false
    }
  }

  export let convocations: Convocation[] = [],
    team: { id: number } | undefined

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
    console.log(convocation, 'ConvocationList')

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
      dispatch('unConvocate', { convocation: convocation })
    })
  }

  $: totalConvocations = convocations.length
  $: deniedConvocations = convocations.filter((c) => c.confirmationStatus == 'denied').length
  $: confirmedConvocations = convocations.filter((c) => c.confirmationStatus == 'confirmed').length

  let convocationDetailDialogOpen: boolean = false, editingConvocation: Convocation | undefined
  function handleMobileConvocationRowClick(convocation: Convocation) {
    editingConvocation = convocation
    convocationDetailDialogOpen = true
  }

  let selectedRoles: Chip[] = []

  $: filteredConvocations = convocations.filter((c) => {
    if(!selectedRoles || selectedRoles.length == 0) return true
    else if(!!c.teammate.roleId) return selectedRoles.map((chip) => chip.value).includes(c.teammate.roleId?.toString())
    else return false
  })
</script>


<MediaQuery
  let:lAndUp
>
  <div class="container">
    <div class="summary">
      <div class="summary-row">
        <div>Convocazioni totali:</div>
        <div>{totalConvocations}</div>
      </div>
      <div class="summary-row">
        <div>Presenze rifiutate:</div>
        <div>{deniedConvocations}</div>
      </div>
      <div class="summary-row">
        <div>Presenze confermate:</div>
        <div>{confirmedConvocations}</div>
      </div>
    </div>

    <div>
      {#if !!team}
        <div 
          style:margin-top="10px"
          style:margin-bottom="20px"
        >
          <RoleMultipleSelectorChip
            bind:team={team}
            bind:value={selectedRoles}
            onlyConvocable={true}
          ></RoleMultipleSelectorChip>
        </div>
      {/if}

      {#if lAndUp}
        <div class="convocations-list">
          {#each filteredConvocations as convocation}
            <div 
              style:display="flex"
              class="convocation-container"
            >
              <div class="info-container">
                <div class="name-column">
                  <UserAvatar
                    src={convocation.teammate.user.avatarUrl}
                    username={convocation.teammate.alias || convocation.teammate.user.name}
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
              {#if convocation.teammate.userId == $user?.id || CansService.can('Convocation', 'confirm') || CansService.can('Convocation', 'deny')}
                <div 
                  
                  class="confirm-button-container"
                >
                  {#if !loading}
                    {#if CansService.can('Convocation', 'confirm') || convocation.teammate.userId == $user?.id}
                      <Icon
                        name="mdi-check"
                        click
                        on:click={() => confirmConvocation(convocation)}
                      ></Icon>
                    {/if}
                    {#if CansService.can('Convocation', 'deny') || convocation.teammate.userId == $user?.id}
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
        </div>
      {:else}
        <div
          style:display="flex"
          style:flex-direction="column"
        >
          {#each filteredConvocations as convocation}
            <div 
              style:display="flex"
              style:justify-content="space-between"
              on:click={() => handleMobileConvocationRowClick(convocation)}
            >
              <UserAvatar
                src={convocation.teammate.user.avatarUrl}
                username={convocation.teammate.alias || convocation.teammate.user.name}
                description={!!convocation.teammate.role ? convocation.teammate.role.name : undefined}
              ></UserAvatar>
              <div class="status-container">
                <div 
                  class="dot"
                  class:dot-confirmed={convocation.confirmationStatus == 'confirmed'}
                  class:dot-denied={convocation.confirmationStatus == 'denied'}
                  class:dot-pending={convocation.confirmationStatus == 'pending'}
                ></div>
              </div>
            </div>
            <Divider
              marginBottom="8px"
              marginLeft="0px"
              marginRight="0px"
              marginTop="8px"
            ></Divider>
          {/each}
        </div>

        {#if !!editingConvocation}
          <StandardDialog
            bind:open={convocationDetailDialogOpen}
            title={editingConvocation?.teammate.user.name}
          >
            <div
              style:display="flex"
              style:margin-bottom="10px"
            >
              <StandardChip
                warning={editingConvocation.confirmationStatus == 'denied'}
              >
                <span style:font-weight="700">{translateConfirmationStatus(editingConvocation.confirmationStatus)}</span>
              </StandardChip>
            </div>
            <OptionSelector
              options={editConvocationsOptions}
              on:option-click={handleConvocationOptionClick}
            ></OptionSelector>
          </StandardDialog>
        {/if}
      {/if}
    </div>
  </div>
</MediaQuery>

<style>
  @media (max-width: 1024px) {
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

  @media (min-width: 1025px){
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

    .container {
      display: flex;
      justify-content: space-between;
      flex-direction: row-reverse;
    }
  }

  .summary {
    font-weight: 300;
    color: var(--global-light-contrast-color);
    margin-bottom: 20px;
  }

  .summary-row { 
    margin-top: 5px;
    display: flex;
    gap: 10px;
  }

  .convocations-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .status-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dot {
    border-radius: 50%;
    height: 10px;
    width: 10px;
  }

  .dot-confirmed {
    background-color: var(--global-primary-color);
  }

  .dot-pending {
    background-color: var(--global-thin-contrast-color);
  }

  .dot-denied {
    background-color: var(--global-warning-color);
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