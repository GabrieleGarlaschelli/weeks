<script lang="ts" context="module">
  import type { Event } from '$lib/components/events/EventForm.svelte'
</script>

<script lang="ts">
  import { page, session } from "$app/stores"
  import EventService from "$lib/services/events/events.service"
  import CansService from "$lib/services/roles/cans.service"
  import TeamsService from '$lib/services/teams/teams.service';
  import team from '$lib/stores/teams/teamsShow'
  import teamCans from '$lib/stores/teams/teamsCans'
  import { onMount } from 'svelte';


  let event: Event = { },
    loading: boolean = false,
    convocations: { [key: number]: boolean } = {}

  onMount(async () => {
    if(!$team) {
      let service = new TeamsService({ fetch })
      $team = await service.show({ id: parseInt($page.params.teamId) })
  
      let currentTeammates = $team.teammates.find((teammate) => {
        return teammate.userId == $session.currentUser.id
      })
  
      $teamCans = {
        cans: currentTeammates?.role?.cans,
        owner: $team.ownerId == $session.currentUser.id
      }
    }
  })

  function handleSubmit() {
    let formattedConvocations: { teammateId: number }[] = []
    for(let [key, value] of Object.entries(convocations)) {
      if(value) {
        formattedConvocations.push({
          teammateId: parseInt(key)
        })
      }
    }

    loading = true
    let service = new EventService({ fetch })
    if(!!event.start && !!event.end && !!event.name) {
      service.create({
        start: event.start,
        end: event.end,
        name: event.name,
        description: event.description,
        team: {
          id: parseInt($page.params.teamId)
        },
        convocations: formattedConvocations
      }).then(() => {
        loading = false
        window.history.back()
      })
    } else {
      console.log('incomplete event')
    }
  }

  $: confirmDisabled = !event || !event.start || !event.end || !event.name

  function handleCancel() {
    window.history.back()
  }

  let authorized: boolean = false
  $: if(!!$teamCans) {
    authorized = CansService.can('Event', 'create')
  } else {
    authorized = false
  }

  import PageTitle from "$lib/components/typography/PageTitle.svelte"
  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";
  import ConfirmOrCancelButtons from '$lib/components/common/ConfirmOrCancelButtons.svelte';
  import EventForm from "$lib/components/events/EventForm.svelte";
</script>

{#if authorized}
  <MediaQuery
    let:mAndDown
  >
    <PageTitle
      title="Nuovo evento"
      paddingTop={mAndDown ? "15px" : "40px"}
      prependVisible={true}
    ></PageTitle>

    <div 
      style:margin-top="20px"
    >
      <EventForm
        bind:event={event}
        teammates={$team?.teammates}
        bind:convocations={convocations}
      ></EventForm>
      <ConfirmOrCancelButtons
        confirmDisable={confirmDisabled}
        loading={loading}
        on:confirm-click={handleSubmit}
        on:cancel-click={handleCancel}
      ></ConfirmOrCancelButtons>
    </div>
  </MediaQuery>
{:else}
  <div>Non puoi accedere a questa pagina :(</div>
{/if}