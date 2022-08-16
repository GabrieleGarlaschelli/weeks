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

  import StandardButton from "$lib/components/StandardButton.svelte"
  import TeamForm from "$lib/components/teams/TeamForm.svelte"
  import PageTitle from "$lib/components/typography/PageTitle.svelte"
  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";
  import LinkButton from '$lib/components/LinkButton.svelte';
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
    <div
      class="button-container"
    >
      <div
        class="link-button-container"
      >
        <LinkButton
          on:click={handleCancel}
        >Annulla</LinkButton>
      </div>
      <StandardButton
        width={"auto"}
        loading={loading}
        on:click={handleSubmit}
      >Salva</StandardButton>
    </div>
  </div>
</MediaQuery>

<style>
  @media (max-width: 768px){
  	.button-container {
      flex-direction: column-reverse;
    }
  }

  @media (min-width: 769px){
    .button-container {
      justify-content: end;
      gap: 15px;
    }
  }

  .button-container {
    display: flex;
    margin-top: 20px;
  }

  .link-button-container {
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>