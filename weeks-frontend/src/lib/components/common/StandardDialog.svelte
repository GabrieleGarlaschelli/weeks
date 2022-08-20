<script lang="ts">
  export let open: boolean = false,
    title: string | undefined = undefined,
    titlePadding: string = "10px",
    bodyPadding: string = "10px",
    cardPadding: string | undefined = undefined,
    footerPadding: string = "10px"

  import Dialog from "@likable-hair/svelte/dialogs/Dialog.svelte"
  import StandardCard from "./StandardCard.svelte"
  import Subtitle from "$lib/components/typography/Subtitle.svelte";
</script>

<Dialog
  bind:open={open}
  overlayOpacity="60%"
>
  <StandardCard
    height="auto"
    padding={cardPadding}
  >
    <div 
      slot="header" 
      style:padding={titlePadding}
    >
      <slot name="header">
        <Subtitle subtitle={title}></Subtitle>
      </slot>
    </div>
    <div
      style:padding={bodyPadding}
    >
      <slot></slot>
    </div>
    <div 
      slot="footer"
      style:padding={footerPadding}
    >
      <slot name="footer"></slot>
    </div>
  </StandardCard>
</Dialog>