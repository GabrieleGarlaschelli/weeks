<script lang="ts" context="module">
  import type { Event } from "$lib/services/events/events.service"
</script>

<script lang="ts">
  import { page } from "$app/stores"
  import { onMount } from "svelte"
  import EventsService from "$lib/services/events/events.service"

  let event: Event

  onMount(async () => {
    let service = new EventsService({ fetch })
    event = await service.show({ id: parseInt($page.params.eventId) })
  })

  let loading = false
  function handleConfirmClick() {
    loading = true

    let service = new EventsService({ fetch })
    service.update(event).then(() => {
      loading = false
      window.history.back()
    })
  }

  function handleCancelClick() {
    window.history.back()
  }


  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";
  import PageTitle from "$lib/components/typography/PageTitle.svelte";
  import EventForm from "$lib/components/events/EventForm.svelte";
  import ConfirmOrCancelButtons from '$lib/components/common/ConfirmOrCancelButtons.svelte';
</script>

<MediaQuery
  let:mAndDown
>
  <PageTitle
    title={event?.name || ''}
    paddingTop={mAndDown ? "15px" : "40px"}
    prependVisible={true}
  ></PageTitle>

  {#if !!event}
    <div 
      style:margin-top="20px"
    >
      <EventForm
        mode="update"
        event={event}
      ></EventForm>
      <ConfirmOrCancelButtons
        on:confirm-click={handleConfirmClick}
        on:cancel-click={handleCancelClick}
        loading={loading}
      ></ConfirmOrCancelButtons>
    </div>
  {:else}
    no event
  {/if}
</MediaQuery>

