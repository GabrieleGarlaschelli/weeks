<script lang="ts">
  import user from "$lib/stores/user";
  import { page } from "$app/stores"
  import { onMount } from "svelte"
  import { goto } from "$app/navigation";
  import EventService from "$lib/services/events/events.service"
  import TeamsService from "$lib/services/teams/teams.service";
  import event from "$lib/stores/events/eventShow"
  import team from "$lib/stores/teams/teamsShow"
  import colors from "$lib/stores/colors";
  import teamCans from "$lib/stores/teams/teamsCans"
  import CansService from '$lib/services/roles/cans.service';
  import type { Option } from '$lib/components/common/OptionSelector.svelte'
  import type { Tab } from '@likable-hair/svelte/navigation/TabSwitcher.svelte'
  import ConfirmDialog from '$lib/components/common/ConfirmDialog.svelte'
  

  let selectedTab: string = 'general',
    options: Option[] = [],
    tabs: Tab[] = []

  onMount(async () => {
    let service = new EventService({ fetch })
    $event = await service.show({ id: parseInt($page.params.eventId) })

    if(!$team || $team.id.toString() != $page.params.teamId) {
      let service = new TeamsService({ fetch })
      $team = await service.show({ id: parseInt($page.params.teamId) })
  
      let currentTeammates = $team.teammates.find((teammate) => {
        return !!$user && teammate.userId == $user.id
      })
  
      $teamCans = {
        cans: currentTeammates?.role?.cans,
        owner: !!$user && $team.ownerId == $user.id
      }
    }

    options = [ ]

    if(CansService.can('Event', 'update'))
      options.push({
        name: 'update', 
        label: 'Modifica',
        icon: 'mdi-pencil',
      })

    if(CansService.can('Event', 'destroy'))
      options.push({
        name: 'destroy', 
        label: 'Elimina',
        icon: 'mdi-delete',
        color: $colors.warning
      })
    
    tabs = [
      {
        name: 'general',
        label: 'Generale'
      },
      {
        name: 'convocations',
        label: 'Convocazioni'
      },
    ]
  })

  function handleOptionClick(ev: any) {
    if(ev.detail?.option?.name == 'update' && !!$event)
      goto(`/teams/${$team?.id}/events/${$event?.id}/edit`)
    else if(ev.detail?.option?.name == 'destroy' && !!$event) {
      confirmDialogOpen = true
    }
  }


  let confirmDialogOpen: boolean
  function confirmEventDeletion() {
    confirmDialogOpen = false

    if(!!$event) {
      let service = new EventService({ fetch })
      service.destroy({
        id: $event.id
      }).then(() => {
        goto(`/teams/${$team?.id}/calendar`)
      })
    }
  }

  function handleTabClick() {
    if(selectedTab == 'general') {
      goto(`/teams/${$team?.id}/events/${$event?.id}/general`)
    } else if(selectedTab == 'convocations') {
      goto(`/teams/${$team?.id}/events/${$event?.id}/convocations`)
    }
  }

  $: if($page.url.href.endsWith('general')) {
    selectedTab = 'general'
  } else if($page.url.href.endsWith('convocations')) {
    selectedTab = 'convocations'
  }
  
  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte"
  import PageTitle from "$lib/components/typography/PageTitle.svelte"
  import StandardTabSwitcher from "$lib/components/common/StandardTabSwitcher.svelte"
  import OptionMenu from "$lib/components/common/OptionMenu.svelte"
  import CircularLoader from "@likable-hair/svelte/loaders/CircularLoader.svelte";
</script>

<MediaQuery
  let:mAndDown
>
  {#if !!$event}
    <PageTitle
      title={$event.name}
      paddingTop={mAndDown ? "15px" : "40px"}
      prependVisible={true}
      prependRoute={`/teams/${$team?.id}/calendar`}
    >
      <svelte:fragment slot="append">
        {#if options.length > 0}
          <OptionMenu
            options={options}
            on:option-click={handleOptionClick}
          ></OptionMenu>
        {/if}
      </svelte:fragment>
    </PageTitle>

    <StandardTabSwitcher
      tabs={tabs}
      marginTop="10px"
      marginBottom="10px"
      bind:selected={selectedTab}
      on:tab-click={handleTabClick}
    ></StandardTabSwitcher>

    <slot></slot>
  {:else}
    <CircularLoader></CircularLoader>
  {/if}
</MediaQuery>

<ConfirmDialog
  confirmText="Elimina"
  title="Eliminazione evento"
  description={`Sei sicuro di voler eliminare l'evento ${$event?.name}?`}
  bind:open={confirmDialogOpen}
  on:cancel-click={() => confirmDialogOpen = false}
  on:confirm-click={confirmEventDeletion}
></ConfirmDialog>

