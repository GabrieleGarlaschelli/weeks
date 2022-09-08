<script lang="ts">
  import ConvocationList from "$lib/components/convocations/ConvocationList.svelte";
  import type { Convocation } from "$lib/services/convocations/convocations.service";
  import event from '$lib/stores/events/eventShow'

  function handleConfirmOrDeny(e: CustomEvent<{ convocation: Convocation }>) {
    if(!!$event) {
      let index = $event.convocations.findIndex(el => el.id == e.detail.convocation.id)
      if(index != -1) {
        $event.convocations[index].confirmationStatus = e.detail.convocation.confirmationStatus
      }
    }
  }
</script>

<div style:margin-top="20px">
  <ConvocationList
    convocations={$event?.convocations}
    on:confirm={handleConfirmOrDeny}
    on:deny={handleConfirmOrDeny}
  ></ConvocationList>
</div>