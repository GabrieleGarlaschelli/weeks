<script lang="ts">
  import Switch from "@likable-hair/svelte/forms/Switch.svelte"
  import colors from "$lib/stores/colors";

  export let value: boolean
</script>

<Switch
  bind:value={value}
  on:change
  toggleActiveColor={$colors.contrast}
  toggleDeactiveColor={$colors.contrast}
  backgroundActiveColor={$colors.primary}
  backgroundDeactiveColor={$colors.lightContrast}
></Switch>