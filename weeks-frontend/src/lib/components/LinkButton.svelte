<script lang="ts">
  export let display: 'block' | 'inline-block' = 'block',
    disabled: boolean = false

  import colors from '$lib/stores/colors'
</script>

<div
  style:color={$colors.primary}
  style:cursor="pointer"
  style:width="fit-content"
  style:display={display}
  style:pointer-events={disabled ? "none" : "initial"}
  on:click
>
  <slot></slot>
</div>