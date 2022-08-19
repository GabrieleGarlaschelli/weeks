<script lang="ts" context="module">
  import type { Team } from "$lib/services/teams/teams.service"
</script>

<script lang="ts">
  import PageTitle from "$lib/components/typography/PageTitle.svelte"
  import OptionMenu from "$lib/components/common/OptionMenu.svelte";
  import TeamsBoxList from "$lib/components/teams/TeamsBoxList.svelte"
  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";
  import TeamsService from "$lib/services/teams/teams.service"
  import { onMount } from "svelte";
  import { goto } from "$app/navigation"

  let teams: Team[] = []
  async function loadTeams() {
    let service = new TeamsService({ fetch })
    let paginationData = await service.list()
    teams = paginationData.data
  }

  async function handleTeamClick(event: any) {
    goto('/teams/' + event.detail.team.id + '/general')
  }

  onMount(() => {
    loadTeams()
  })

  function handleOptionClick(event: any) {
    if(event.detail?.option?.name == 'new') goto('/teams/new')
  }
</script>

<PageTitle
  title="Teams"
  paddingTop="40px"
>
  <svelte:fragment slot="append">
    <OptionMenu
      options={
        [
          {
            name: 'new', 
            label: 'Nuovo',
            icon: 'mdi-plus'
          },
        ]
      }
      on:option-click={handleOptionClick}
    ></OptionMenu>
  </svelte:fragment>
</PageTitle>

<MediaQuery
  let:mAndDown
>
  <div
    style:margin-top="10px"
  >
    <TeamsBoxList
      searchable
      marginTop="20px"
      teams={teams}
      on:teams-click={handleTeamClick}
    ></TeamsBoxList>
  </div>
</MediaQuery>