<script lang="ts">
  export let open: boolean = false,
    title: string | undefined = undefined

  import Dialog from "@likable-hair/svelte/dialogs/Dialog.svelte"
  import StandardCard from "./StandardCard.svelte"
</script>

<Dialog
  open={open}
>
  <StandardCard
    title={title}
  >
    <slot></slot>
  </StandardCard>
</Dialog>