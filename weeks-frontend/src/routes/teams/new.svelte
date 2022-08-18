<script lang="ts" context="module">
  import type Team from '$lib/services/teams/teams.service'
</script>

<script lang="ts">
  import TeamsService from '$lib/services/teams/teams.service'
  import { goto } from '$app/navigation';

  let team: {
    name?: string,
    notes?: string
  } = {}
  let loading = false

  function handleSubmit() {
    let service = new TeamsService({ fetch })
    loading = true
    service.create(team).then(() => {
      loading = false
      goto('/teams')
    }).catch((error) => {
      console.log(error)
      loading = false
    })
  }

  function handleCancel() {
    goto('/teams')
  }

  import TeamForm from "$lib/components/teams/TeamForm.svelte"
  import PageTitle from "$lib/components/typography/PageTitle.svelte"
  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";
  import ConfirmOrCancelButtons from '$lib/components/common/ConfirmOrCancelButtons.svelte';
</script>

<MediaQuery
  let:mAndDown
>
  <PageTitle
    title="Nuovo team"
    paddingTop={mAndDown ? "15px" : "40px"}
    prependVisible={true}
  ></PageTitle>

  <div 
    style:margin-top="20px"
  >
    <TeamForm
      bind:team={team}
    ></TeamForm>
    <ConfirmOrCancelButtons
      bind:loading={loading}
      on:confirm-click={handleSubmit}
      on:cancel-click={handleCancel}
    ></ConfirmOrCancelButtons>
  </div>
</MediaQuery>