<script lang="ts">
  import { page } from "$app/stores"
  import { onMount } from "svelte"
  import { goto } from "$app/navigation";
  import TeamService from "$lib/services/teams/teams.service"
  import team from "$lib/stores/teams/teamsShow"

  let selectedTab: string = 'general'

  onMount(async () => {
    let service = new TeamService({ fetch })
    $team = await service.show({ id: parseInt($page.params.teamId) })

    if($page.url.href.endsWith('general')) {
      selectedTab = 'general'
    } else if(
      $page.url.href.endsWith('teammates') || 
      $page.url.href.endsWith('inviteUser')
    ) {
      selectedTab = 'teammates'
    } else if($page.url.href.endsWith('roles')) {
      selectedTab = 'roles'
    }
  })

  function handleOptionClick(event: any) {
    if(event.detail?.option?.name == 'edit' && !!$team) {
      goto('/teams/' + $team.id + '/edit')
    }
  }

  function handleTabClick(event: any) {
    if(selectedTab == 'general') {
      goto(`/teams/${$team?.id}/general`)
    } else if(selectedTab == 'teammates') {
      goto(`/teams/${$team?.id}/teammates`)
    } else if(selectedTab == 'roles') {
      goto(`/teams/${$team?.id}/roles`)
    }
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
    >
      <svelte:fragment slot="append">
        <OptionMenu
          options={
            [
              {
                name: 'edit', 
                label: 'Modifica',
                icon: 'mdi-pencil'
              },
              {
                name: 'delete', 
                label: 'Elimina',
                icon: 'mdi-delete',
                color: '#ad0000'
              },
            ]
          }
          on:option-click={handleOptionClick}
        ></OptionMenu>
      </svelte:fragment>
    </PageTitle>

    <StandardTabSwitcher
      tabs={[
        {
          name: 'general',
          label: 'Generale'
        },
        {
          name: 'teammates',
          label: 'Partecipanti'
        },
        {
          name: 'roles',
          label: 'Ruoli'
        },
      ]}
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

