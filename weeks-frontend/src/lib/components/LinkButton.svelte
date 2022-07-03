<script lang="ts">
  import colors from '$lib/stores/colors'
</script>

<div
  style:color={$colors.primary}
  style:cursor="pointer"
  style:width="fit-content"
  on:click
>
  <slot></slot>
</div>