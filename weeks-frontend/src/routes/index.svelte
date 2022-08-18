<script lang="ts" context="module">
  import type { Team } from "$lib/services/teams/teams.service"
</script>

<script lang="ts">
  import TeamsBoxList from "$lib/components/teams/TeamsBoxList.svelte";
  import PageTitle from "$lib/components/typography/PageTitle.svelte";
  import Subhead from "$lib/components/typography/Subhead.svelte";
  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";
  import { onMount } from "svelte";
  import TeamsService from "$lib/services/teams/teams.service";
  import { goto } from "$app/navigation";

  let teams: Team[] = []
  async function loadTeams() {
    let service = new TeamsService({ fetch })
    let paginationData = await service.list()
    teams = paginationData.data
  }

  async function handleTeamClick(event: any) {
    goto('/teams/' + event.detail.team.id)
  }

  onMount(() => {
    loadTeams()
  })
</script>

<MediaQuery
  let:mAndDown
>
  <PageTitle
    title="Home"
    paddingTop={mAndDown ? "15px" : "40px"}
  ></PageTitle>
  <Subhead
    text="I miei team"
    marginTop="30px"
  ></Subhead>
  <div
    style:margin-top="10px"
  >
    <TeamsBoxList
      marginTop="20px"
      teams={teams}
      on:teams-click={handleTeamClick}
    ></TeamsBoxList>
  </div>
  <Subhead
    text="Prossimi appuntamenti"
    marginTop="30px"
  ></Subhead>
  <div
    style:margin-top="10px"
  >
    Ops, ancora nessun appuntamento 
  </div>
</MediaQuery>