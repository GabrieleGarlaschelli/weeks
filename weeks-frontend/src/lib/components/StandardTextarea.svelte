<script lang="ts">
  import TextArea from "@likable-hair/svelte/forms/Textarea.svelte"
  import colors from "$lib/stores/colors"

  export let label: string = "",
    placeholder: string = "",
    value: string = "",
    error: boolean = false
</script>

<TextArea
  label={label}
  placeholder={placeholder}
  bind:value={value}
  backgroundColor="transparent"
  paddingBottom="8px"
  paddingTop="6px"
  paddingRight="10px"
  paddingLeft="10px"
  fontSize="1rem"
  width="90%"
  height="130px"
  textColor={$colors.contrast}
  border={error ? '1px red solid' : '1px ' + $colors.thinContrast + ' solid'}
  focusedBoxShadow="rgb(149 157 165 / 20%) 2px 2px 10px"
  on:input
></TextArea>
