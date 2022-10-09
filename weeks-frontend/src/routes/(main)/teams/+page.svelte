<script lang="ts" context="module">
  import type { Team } from "$lib/services/teams/teams.service"
  import type { Invitation } from "$lib/services/invitations/invitations.service"
</script>

<script lang="ts">
  import PageTitle from "$lib/components/typography/PageTitle.svelte"
  import OptionMenu from "$lib/components/common/OptionMenu.svelte";
  import TeamsBoxList from "$lib/components/teams/TeamsBoxList.svelte"
  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";
  import TeamsService from "$lib/services/teams/teams.service"
  import InvitationsService from "$lib/services/invitations/invitations.service";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation"
  import Subhead from "$lib/components/typography/Subhead.svelte";
  import InvitationToAccept from "$lib/components/invitations/InvitationToAccept.svelte";

  let teams: Team[] = []
  async function loadTeams() {
    let service = new TeamsService({ fetch })
    let paginationData = await service.list()
    teams = paginationData.data
  }

  let invitationsToAccept: Invitation[]
  async function loadInvitations() {
    let service = new InvitationsService({ fetch })
    invitationsToAccept = await service.invitationToAccept()
  }

  async function handleTeamClick(event: any) {
    goto('/teams/' + event.detail.team.id + '/general')
  }

  async function reload() {
    await loadTeams()
    await loadInvitations()
  }

  onMount(() => {
    loadTeams()
    loadInvitations()
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
  <div 
    style:margin-top="30px"
  >
    <Subhead text="I miei inviti"></Subhead>
  </div>
  <div 
    style:margin-top="10px"
  >
    <InvitationToAccept
      invitations={invitationsToAccept}
      on:accept={reload}
      on:reject={reload}
    ></InvitationToAccept>
  </div>
</MediaQuery>