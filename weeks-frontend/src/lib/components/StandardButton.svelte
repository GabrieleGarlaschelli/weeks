<script lang="ts">
  import Button from "@likable-hair/svelte/buttons/Button.svelte"
  import colors from "$lib/stores/colors"

  export let type: 'impact' | 'standard' = 'impact'

  $: backgroundColor = type == 'impact' ? $colors.primary : 'transparent'
  $: textColor = type == 'impact' ? $colors.background : $colors.contrast
  $: border = type == 'impact' ? undefined : `1px solid ${$colors.thinContrast}`
</script>

<Button
  on:click
  backgroundColor={backgroundColor}
  hoverBackgroundColor={backgroundColor}
  border={border}
  color={textColor}
  padding="10px"
>
  <slot></slot>
</Button>
