<script lang="ts">
  export let warning: boolean = false

  import Chip from '@likable-hair/svelte/navigation/Chip.svelte'
  import colors from '$lib/stores/colors'
</script>

<Chip
  label
  color={warning ? $colors.warningBackground : $colors.tertiary}
  textColor={$colors.contrast}
  on:click
>
  <div 
    style:min-height="30px"
    style:display="flex"
    style:align-items="center"
  >
    <slot></slot>
  </div>
</Chip>