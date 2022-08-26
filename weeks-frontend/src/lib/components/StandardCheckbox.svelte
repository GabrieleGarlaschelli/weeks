<script lang="ts">
  import colors from "$lib/stores/colors"
  import Checkbox from "@likable-hair/svelte/forms/Checkbox.svelte"
  export let value: boolean = false,
    id: string
</script>

<Checkbox
  bind:value={value}
  id={id}
  activeColor={$colors.primary}
  borderColor={$colors.lightContrast}
  backgroundColor="trasparent"
  borderHoverColor={$colors.lightContrast}
  focusShadow={"2px " + $colors.thinContrast}
  on:change
></Checkbox>