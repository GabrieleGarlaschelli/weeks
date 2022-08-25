<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let loading: boolean = false,
    marginTop: string = "20px",
    cancelText: string = "Annulla",
    confirmText: string = "Salva",
    confirmDisable: boolean = false,
    cancelDisable: boolean = false

  let dispatch = createEventDispatcher<{
    "confirm-click": {
      nativeEvent: MouseEvent
    },
    "cancel-click": {
      nativeEvent: MouseEvent
    },
  }>()

  function handleConfirm(event: any) {
    if(!confirmDisable) {
      dispatch('confirm-click', {
        nativeEvent: event.detail.nativeEvent
      })
    }
  }

  function handleCancel(nativeEvent: MouseEvent) {
    if(!cancelDisable) {
      dispatch('cancel-click', {
        nativeEvent
      })
    }
  }

  import LinkButton from "$lib/components/LinkButton.svelte";
  import StandardButton from "$lib/components/StandardButton.svelte";
</script>

<div
  style:margin-top={marginTop}
  class="button-container"
>
  <div
    class="link-button-container"
  >
    <LinkButton
      disabled={cancelDisable}
      on:click={handleCancel}
    >{cancelText}</LinkButton>
  </div>
  <StandardButton
    width={"auto"}
    loading={loading}
    on:click={handleConfirm}
    disabled={confirmDisable}
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
  }

  .link-button-container {
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>