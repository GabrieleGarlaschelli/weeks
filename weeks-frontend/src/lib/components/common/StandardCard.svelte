<script lang="ts">
  export let height: string = "300px",
    width: string = "300px",
    maxWidth: string = "90vw",
    maxHeight: string = "90vh"


  import Card from '@likable-hair/svelte/common/Card.svelte'
  import Subtitle from '../typography/Subtitle.svelte'
</script>

<Card
  height={height}
  width={width}
  maxHeight={maxHeight}
  maxWidth={maxWidth}
>
  <svelte:fragment slot="header">
    <slot name="header"></slot>
  </svelte:fragment>
  <slot></slot>
  <svelte:fragment slot="footer">
    <slot name="footer"></slot>
  </svelte:fragment>
</Card>