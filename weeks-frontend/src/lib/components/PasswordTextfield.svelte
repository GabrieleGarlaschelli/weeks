<script lang="ts">
  import TextField from "@likable-hair/svelte/forms/Textfield.svelte"
  import Button from "@likable-hair/svelte/buttons/Button.svelte"
  import colors from "$lib/stores/colors"

  export let label: string = "",
    placeholder: string = "",
    value: string = "",
    error: boolean = false

  let passwordVisible: boolean = false
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
  type={passwordVisible ? 'text' : 'password'}
  textColor={$colors.contrast}
  color={$colors.lightContrast}
  borderColor={error ? 'red' : $colors.thinContrast}
  focusBorderColor={error ? 'red' : $colors.primary}
  focusedBoxShadow="rgb(149 157 165 / 20%) 2px 2px 10px"
  borderWeight="1px"
  on:input
>
  <div slot="append-inner">
    <Button 
      type="icon"
      iconSize={13}
      icon={passwordVisible ? "mdi-eye-off" : "mdi-eye"} 
      hoverBackgroundColor=""
      padding="0px"
      on:click={() => passwordVisible = !passwordVisible}
      color={$colors.lightContrast}
    ></Button>
  </div>
</TextField>
