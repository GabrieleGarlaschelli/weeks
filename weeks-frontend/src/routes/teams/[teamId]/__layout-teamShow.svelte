<script lang="ts">
  import { page, session } from "$app/stores"
  import { onMount } from "svelte"
  import { goto } from "$app/navigation";
  import TeamService from "$lib/services/teams/teams.service"
  import team from "$lib/stores/teams/teamsShow"
  import colors from "$lib/stores/colors";
  import teamCans from "$lib/stores/teams/teamsCans"
  import CansService from '$lib/services/roles/cans.service';
  import type { Option } from '$lib/components/common/OptionSelector.svelte'
  import type { Tab } from '@likable-hair/svelte/navigation/TabSwitcher.svelte'

  let selectedTab: string = 'general',
    options: Option[] = [],
    tabs: Tab[] = []

  onMount(async () => {
    let service = new TeamService({ fetch })
    $team = await service.show({ id: parseInt($page.params.teamId) })

    let currentTeammates = $team.teammates.find((teammate) => {
      return teammate.userId == $session.currentUser.id
    })

    $teamCans = {
      cans: currentTeammates?.role?.cans,
      owner: $team.ownerId == $session.currentUser.id
    }

    options = [ ]

    if(CansService.can('Team', 'update'))
      options.push({
        name: 'edit', 
        label: 'Modifica',
        icon: 'mdi-pencil'
      },)

    if(CansService.can('Team', 'invite'))
      options.push({
        name: 'inviteUser', 
        label: 'Invita utente',
        icon: 'mdi-account-plus'
      })

    if(CansService.can('Event', 'create')) 
      options.push({
        name: 'addEvent', 
        label: 'Aggiungi evento',
        icon: 'mdi-calendar-plus'
      })
    
    if(CansService.can('Team', 'destroy'))
      options.push({
        name: 'delete', 
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
        name: 'teammates',
        label: 'Partecipanti'
      }
    ]

    if(CansService.can('Role', 'update')) 
      tabs.push({
        name: 'roles',
        label: 'Ruoli'
      })
    
    tabs.push({
      name: 'calendar',
      label: 'Calendario'
    })

    tabs.push({
      name: 'eventsList',
      label: 'Lista eventi'
    })
  })

  function handleOptionClick(event: any) {
    if(event.detail?.option?.name == 'edit' && !!$team) {
      goto('/teams/' + $team.id + '/edit')
    } else if(event.detail?.option?.name == 'inviteUser' && !!$team) {
      goto('/teams/' + $team.id + '/inviteUser')
    } else if(event.detail?.option?.name == 'addEvent' && !!$team) {
      goto('/teams/' + $team.id + '/events/new')
    }
  }

  function handleTabClick(event: any) {
    if(selectedTab == 'general') {
      goto(`/teams/${$team?.id}/general`)
    } else if(selectedTab == 'teammates') {
      goto(`/teams/${$team?.id}/teammates`)
    } else if(selectedTab == 'roles') {
      goto(`/teams/${$team?.id}/roles`)
    } else if(selectedTab == 'calendar') {
      goto(`/teams/${$team?.id}/calendar`)
    } else if(selectedTab == 'eventsList') {
      goto(`/teams/${$team?.id}/eventsList`)
    }
  }

  $: if($page.url.href.endsWith('general')) {
    selectedTab = 'general'
  } else if(
    $page.url.href.endsWith('teammates') || 
    $page.url.href.endsWith('inviteUser')
  ) {
    selectedTab = 'teammates'
  } else if($page.url.href.endsWith('roles')) {
    selectedTab = 'roles'
  } else if($page.url.href.endsWith('calendar')) {
    selectedTab = 'calendar'
  } else if($page.url.href.endsWith('eventsList')) {
    selectedTab = 'eventsList'
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
  {#if !!$team}
    <PageTitle
      title={$team.name}
      paddingTop={mAndDown ? "15px" : "40px"}
      prependVisible={true}
      prependRoute="/teams"
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

