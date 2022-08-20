<script lang="ts">
  import { DateTime } from "luxon";
  export let value: Date = new Date(),
    label: string = "Data",
    placeholder: string = "Data",
    name: string
  let formattedDate: string = DateTime.fromJSDate(value).setLocale('it').toLocaleString(DateTime.DATE_FULL)

  let dialogOpened: boolean = false
  function handleInputFocus() {
    dialogOpened = true
  }

  function handleDateSelect() {
    dialogOpened = false
  }

  $: formattedDate = DateTime.fromJSDate(value).setLocale('it').toLocaleString(DateTime.DATE_FULL)
  import colors from "$lib/stores/colors";
  import StandardDialog from "$lib/components/common/StandardDialog.svelte"
  import DatePicker from "@likable-hair/svelte/dates/DatePicker.svelte"
  import LabelAndTextfield from "$lib/components/LabelAndTextfield.svelte"
</script>

<LabelAndTextfield
  label={label}
  placeholder={placeholder}
  name={name}
  readonly={true}
  value={formattedDate}
  on:focus={handleInputFocus}
></LabelAndTextfield>

<StandardDialog
  bodyPadding="0px"
  cardPadding="0px"
  titlePadding="0px"
  bind:open={dialogOpened}
>
  <DatePicker
    bind:selectedDate={value}
    cardColor={$colors.contrast}
    primaryColor={$colors.primary}
    selectedDayColor={$colors.background}
    hoverColor={$colors.thinContrast}
    height="340px"
    on:day-click={handleDateSelect}
  ></DatePicker>
</StandardDialog>