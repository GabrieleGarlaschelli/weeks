<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let loading: boolean = false,
    cancelText: string = "Annulla",
    confirmText: string = "Salva"

  let dispatch = createEventDispatcher<{
    "confirm-click": {
      nativeEvent: MouseEvent
    },
    "cancel-click": {
      nativeEvent: MouseEvent
    },
  }>()

  function handleConfirm(event: any) {
    dispatch('confirm-click', {
      nativeEvent: event.detail.nativeEvent
    })
  }

  function handleCancel(nativeEvent: MouseEvent) {
    dispatch('cancel-click', {
      nativeEvent
    })
  }

  import LinkButton from "$lib/components/LinkButton.svelte";
  import StandardButton from "$lib/components/StandardButton.svelte";
</script>

<div
  class="button-container"
>
  <div
    class="link-button-container"
  >
    <LinkButton
      on:click={handleCancel}
    >{cancelText}</LinkButton>
  </div>
  <StandardButton
    width={"auto"}
    loading={loading}
    on:click={handleConfirm}
  >{confirmText}</StandardButton>
</div>


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