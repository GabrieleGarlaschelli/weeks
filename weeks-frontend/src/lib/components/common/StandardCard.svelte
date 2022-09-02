<script lang="ts">
  export let height: string = "300px",
    width: string = "300px",
    maxWidth: string = "90vw",
    maxHeight: string = "90vh",
    padding: string | undefined = undefined

  import Card from '@likable-hair/svelte/common/Card.svelte'
  import colors from '$lib/stores/colors'
</script>

<Card
  height={height}
  width={width}
  maxHeight={maxHeight}
  maxWidth={maxWidth}
  padding={padding}
  backgroundColor={$colors.background}
>
  <svelte:fragment slot="header">
    <slot name="header"></slot>
  </svelte:fragment>
  <slot></slot>
  <svelte:fragment slot="footer">
    <slot name="footer"></slot>
  </svelte:fragment>
</Card>