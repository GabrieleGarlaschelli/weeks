<script lang="ts" context="module">
  import type { Item } from '@likable-hair/svelte/forms/Autocomplete.svelte'
</script>

<script lang="ts">
  export let items: Item[],
    width: string = "300px",
    maxWidth: string = "100%",
    multiple: boolean = false,
    values: Item[]

  import colors from '$lib/stores/colors'
  import Autocomplete from '@likable-hair/svelte/forms/Autocomplete.svelte'
</script>

<Autocomplete
  bind:values={values}
  width={width}
  maxWidth={maxWidth}
  multiple={multiple}
  border={`1px ${$colors.thinContrast} solid`}
  textFieldPaddingBottom="2px"
  textFieldPaddingTop="2px"
  textFieldPaddingRight="0px"
  textFieldPaddingLeft="0px"
  height="fit-content"
  textFieldBackgroundColor="transparent"
  focusItemBackgroundColor={$colors.thinContrast}
  menuBackgroundColor={$colors.background}
  textFieldPlaceholder="Ruolo"
  textFieldFontSize="1rem"
  textFieldTextColor={$colors.contrast}
  textFieldColor={$colors.lightContrast}
  chipColor={$colors.thinContrast}
  chipTextColor={$colors.contrast}
  textFieldBorderColor="transparent"
  textFieldFocusBorderColor="transparent"
  items={items}
  on:change
></Autocomplete>