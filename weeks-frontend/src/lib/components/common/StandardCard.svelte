<script lang="ts">
  export let height: string = "300px",
    width: string = "300px",
    maxWidth: string = "90vw",
    maxHeight: string = "90vh",
    padding: string | undefined = undefined

  import Card from '@likable-hair/svelte/common/Card.svelte'
</script>

<Card
  height={height}
  width={width}
  maxHeight={maxHeight}
  maxWidth={maxWidth}
  padding={padding}
>
  <svelte:fragment slot="header">
    <slot name="header"></slot>
  </svelte:fragment>
  <slot></slot>
  <svelte:fragment slot="footer">
    <slot name="footer"></slot>
  </svelte:fragment>
</Card>