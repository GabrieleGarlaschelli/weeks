<script lang="ts">
  import Button from "@likable-hair/svelte/buttons/Button.svelte"
  import colors from "$lib/stores/colors"

  export let type: 'impact' | 'standard' = 'impact',
    loading: boolean = false,
    disabled: boolean = false

  let backgroundColor: string
  $: if(type == 'impact') {
    backgroundColor = $colors.primary
  } else {
    backgroundColor = 'transparent'
  }

  $: textColor = type == 'impact' ? $colors.background : $colors.contrast
  $: border = type == 'impact' ? undefined : `1px solid ${$colors.thinContrast}`
</script>

<div
  style:opacity={disabled ? '50%' : '100%'}
>
  <Button
    on:click
    backgroundColor={backgroundColor}
    hoverBackgroundColor={backgroundColor}
    border={border}
    color={textColor}
    padding="10px"
    bind:loading={loading}
    cursor={disabled ? 'not-allowed' : 'pointer'}
  >
    <slot></slot>
  </Button>
</div>
