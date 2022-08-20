<script lang="ts">
  let formattedDate: string

  let dialogOpened: boolean = false
  function handleInputFocus() {
    dialogOpened = true
  }

  import StandardDialog from "$lib/components/common/StandardDialog.svelte"
  import DatePicker from "@likable-hair/svelte/dates/DatePicker.svelte"
  import LabelAndTextfield from "$lib/components/LabelAndTextfield.svelte"
</script>

<LabelAndTextfield
  label="date"
  placeholder="date"
  name="date"
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
    height="340px"
  ></DatePicker>
</StandardDialog>