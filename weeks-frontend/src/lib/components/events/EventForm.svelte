<script lang="ts" context="module">
  export type Event = {
    start?: Date,
    end?: Date,
    name?: string,
    description?: string
  }
</script>

<script lang="ts">
  import LabelAndTextfield from "$lib/components/LabelAndTextfield.svelte"
  import StandardDatepicker from "$lib/components/common/StandardDatepicker.svelte"
  import StandardTimePicker from "$lib/components/common/StandardTimePicker.svelte"
  import { DateTime } from "luxon";
import LabelAndTextarea from "../LabelAndTextarea.svelte";

  export let event: Event = { },
    mode: 'create' | 'update' = 'create',
    padding: string | undefined = undefined,
    margin: string | undefined = undefined,
    width: string | undefined = undefined,
    height: string | undefined = undefined

  let startTime: string, 
    endTime: string,
    date: Date

  $: if(!!startTime && !!date) {
    event.start = DateTime.fromJSDate(date).set({
        hour: parseInt(startTime.split(':')[0]),
        minute: parseInt(startTime.split(':')[1])
      })
      .startOf('millisecond')
      .startOf('minute')
      .toJSDate()
  }
  $: if(!!endTime && !!date) {
    event.end = DateTime.fromJSDate(date).set({
        hour: parseInt(endTime.split(':')[0]),
        minute: parseInt(endTime.split(':')[1])
      })
      .startOf('millisecond')
      .startOf('minute')
      .toJSDate()
    console.log(event)
  }
</script>

<form
  style:padding={padding}
  style:margin={margin}
  style:width={width}
  style:height={height}
>
  <div class="duration-infos">
    <div>
      <StandardDatepicker
        label="Data"
        placeholder="Data "
        name="startDate"
        bind:value={date}
      ></StandardDatepicker>
    </div>
    <div>
      <StandardTimePicker
        bind:value={startTime}
        name="startTime"
        label="Ora inizio"
      ></StandardTimePicker>
    </div>
    <div>
      <StandardTimePicker
        bind:value={endTime}
        name="endTime"
        label="Ora fine"
      ></StandardTimePicker>
    </div>
  </div>
  <LabelAndTextfield
    label="Titolo"
    name="title"
    bind:value={event.name}
  ></LabelAndTextfield>
  <LabelAndTextarea
    label="Descrizione"
    name="description"
    bind:value={event.description}
  ></LabelAndTextarea>
</form>


<style>
  @media (max-width: 768px){
  }

  @media (min-width: 769px){
  }

  .duration-infos {
    display: flex;
    gap: 10px
  }
</style>
