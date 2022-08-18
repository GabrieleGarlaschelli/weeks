<script lang="ts">
  import { DateTime } from 'luxon'
  export let datetime: Date | undefined = undefined

  let formattedDateTime: string
  $: formattedDateTime = !!datetime ? DateTime.fromJSDate(datetime).setLocale('it').toLocaleString(DateTime.DATETIME_MED) : ''
</script>

{#if !!datetime}
  {formattedDateTime}
{/if}