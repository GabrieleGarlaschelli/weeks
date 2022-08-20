<script lang="ts" context="module">
  import type { Event } from '$lib/components/events/EventForm.svelte'
</script>

<script lang="ts">
  import { page } from "$app/stores"
  import EventService from "$lib/services/events/events.service"

  let event: Event = { },
    loading: boolean = false

  function handleSubmit() {
    loading = true
    let service = new EventService({ fetch })
    if(!!event.start && !!event.end && !!event.name && !!event.description) {
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
    }
  }

  function handleCancel() {
    window.history.back()
  }

  import PageTitle from "$lib/components/typography/PageTitle.svelte"
  import MediaQuery from "@likable-hair/svelte/common/MediaQuery.svelte";
  import ConfirmOrCancelButtons from '$lib/components/common/ConfirmOrCancelButtons.svelte';
  import EventForm from "$lib/components/events/EventForm.svelte";
</script>

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
      event={event}
    ></EventForm>
    <ConfirmOrCancelButtons
      loading={loading}
      on:confirm-click={handleSubmit}
      on:cancel-click={handleCancel}
    ></ConfirmOrCancelButtons>
  </div>
</MediaQuery>