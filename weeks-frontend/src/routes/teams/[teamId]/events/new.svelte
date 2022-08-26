<script lang="ts" context="module">
  import type { Event } from '$lib/components/events/EventForm.svelte'
</script>

<script lang="ts">
  import { page } from "$app/stores"
  import EventService from "$lib/services/events/events.service"
  import CansService from "$lib/services/roles/cans.service"

  let event: Event = { },
    loading: boolean = false

  function handleSubmit() {
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
        }
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

  import PageTitle from "$lib/components/typography/PageTitle.svelte"
  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";
  import ConfirmOrCancelButtons from '$lib/components/common/ConfirmOrCancelButtons.svelte';
  import EventForm from "$lib/components/events/EventForm.svelte";
</script>

{#if CansService.can('Event', 'create')}
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