<script lang="ts" context="module">
</script>

<script lang="ts">
  let event = {}

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
    <ConfirmOrCancelButtons></ConfirmOrCancelButtons>
  </div>
</MediaQuery>