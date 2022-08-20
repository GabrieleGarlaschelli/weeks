<script lang="ts" context="module">
  import type { Team } from "$lib/services/teams/teams.service"
</script>

<script lang="ts">
  import { page } from "$app/stores"
  import { onMount } from "svelte"
  import TeamService from "$lib/services/teams/teams.service"

  let team: Team
  onMount(async () => {
    let service = new TeamService({ fetch })
    team = await service.show({ id: parseInt($page.params.teamId) })
  })

  let loading = false
  function handleConfirmClick() {
    loading = true

    let service = new TeamService({ fetch })
    service.update(team).then(() => {
      loading = false
      window.history.back()
    })
  }

  function handleCancelClick() {

  }


  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";
  import PageTitle from "$lib/components/typography/PageTitle.svelte";
  import TeamForm from "$lib/components/teams/TeamForm.svelte";
  import ConfirmOrCancelButtons from '$lib/components/common/ConfirmOrCancelButtons.svelte';
</script>

<MediaQuery
  let:mAndDown
>
  <PageTitle
    title={team?.name}
    paddingTop={mAndDown ? "15px" : "40px"}
    prependVisible={true}
  ></PageTitle>

  {#if !!team}
    <div 
      style:margin-top="20px"
    >
      <TeamForm
        team={team}
        mode="update"
      ></TeamForm>
      <ConfirmOrCancelButtons
        on:confirm-click={handleConfirmClick}
        on:cancel-click={handleCancelClick}
      ></ConfirmOrCancelButtons>
    </div>
  {:else}
    no team
  {/if}
</MediaQuery>

