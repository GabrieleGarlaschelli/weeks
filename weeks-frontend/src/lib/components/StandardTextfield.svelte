<script lang="ts">
  import TextField from "@likable-hair/svelte/forms/Textfield.svelte"
  import colors from "$lib/stores/colors"

  export let label: string = "",
    placeholder: string = "",
    value: string = ""
</script>

<TextField
  label={label}
  placeholder={placeholder}
  bind:value={value}
  backgroundColor="transparent"
  paddingBottom="8px"
  paddingTop="6px"
  paddingRight="10px"
  paddingLeft="10px"
  fontSize="1rem"
  variant="boxed"
  textColor={$colors.contrast}
  color={$colors.lightContrast}
  borderColor={$colors.thinContrast}
  focusBorderColor={$colors.primary}
  focusedBoxShadow="rgb(149 157 165 / 20%) 2px 2px 10px"
  borderWeight="1px"
  on:input
></TextField>
