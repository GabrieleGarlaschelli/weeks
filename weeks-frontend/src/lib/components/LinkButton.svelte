<script lang="ts">
  export let display: 'block' | 'inline-block' = 'block'

  import colors from '$lib/stores/colors'
</script>

<div
  style:color={$colors.primary}
  style:cursor="pointer"
  style:width="fit-content"
  style:display={display}
  on:click
>
  <slot></slot>
</div>