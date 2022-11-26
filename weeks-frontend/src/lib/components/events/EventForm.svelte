<script lang="ts" context="module">
  export type Event = {
    start?: Date,
    end?: Date,
    name?: string,
    description?: string
  }

  import type { Teammate } from '$lib/services/teams/teams.service' 
</script>

<script lang="ts">
  import LabelAndTextfield from "$lib/components/LabelAndTextfield.svelte"
  import StandardDatepicker from "$lib/components/common/StandardDatepicker.svelte"
  import StandardTimePicker from "$lib/components/common/StandardTimePicker.svelte"
  import { DateTime } from "luxon";
  import LabelAndTextarea from "$lib/components/LabelAndTextarea.svelte";
  import TeammatesChecklist from '$lib/components/teammates/TeammatesChecklist.svelte';
  import CollapsableSection from '$lib/components/common/CollapsableSection.svelte';
  import LinkButton from "../LinkButton.svelte";

  export let event: Event = { },
    convocations: {
      [key: number]: boolean
    } = {},
    mode: 'create' | 'update' = 'create',
    padding: string | undefined = undefined,
    margin: string | undefined = undefined,
    width: string | undefined = undefined,
    height: string | undefined = undefined,
    teammates: Teammate[] | undefined = undefined

  let date: Date | undefined = event.start,
    startTime: string, 
    endTime: string

  $: {
    if(!event.start) {
      event.start = new Date()
    }

    if(!event.end) {
      event.end = DateTime.fromJSDate(event.start).plus({ hours: 1 }).toJSDate()
    }

    if(!!event.start) {
      startTime = DateTime.fromJSDate(new Date(event.start)).toFormat("HH:mm")
    }
    
    if(!!event.end) {
      endTime = DateTime.fromJSDate(new Date(event.end)).toFormat("HH:mm")
    }
  }

  function selectAll() {
    if(!!teammates) {
      convocations = {}
      for(let i = 0; i < teammates.length; i += 1) {
        convocations[teammates[i].id] = true
      }
    }
  }

  function handleDatePickerChange(e: CustomEvent<{ date: Date }>) {
    let newDateStart = event.start
    if(!newDateStart) newDateStart = new Date()

    event.start = DateTime.fromJSDate(newDateStart).set({
      month: e.detail.date.getMonth(),
      year: e.detail.date.getFullYear(),
      day: e.detail.date.getDate()
    }).toJSDate()

    let newDateEnd = event.end
    if(!newDateEnd) newDateEnd = new Date()

    event.end = DateTime.fromJSDate(newDateEnd).set({
      month: e.detail.date.getMonth(),
      year: e.detail.date.getFullYear(),
      day: e.detail.date.getDate()
    }).toJSDate()
  }

  function handleStartTimeChange(e: any) {
    if(!event.start) event.start = new Date()
    
    event.start = DateTime.fromJSDate(event.start).set({
      hour: e.target.value.split(':')[0],
      minute: e.target.value.split(':')[1],
    }).toJSDate()

    startTime = e.target.value
  }

  function handleEndTimeChange(e: any) {
    if(!event.end) event.end = new Date()

    event.end = DateTime.fromJSDate(event.end).set({
      hour: e.target.value.split(':')[0],
      minute: e.target.value.split(':')[1],
    }).toJSDate()

    endTime = e.target.value
  }

  $: console.log(event)

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
        on:change={handleDatePickerChange}
      ></StandardDatepicker>
    </div>
    <div>
      <StandardTimePicker
        value={startTime}
        name="startTime"
        label="Ora inizio"
        on:change={handleStartTimeChange}
      ></StandardTimePicker>
    </div>
    <div>
      <StandardTimePicker
        value={endTime}
        name="endTime"
        label="Ora fine"
        on:change={handleEndTimeChange}
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
  {#if mode == 'create' && teammates}
    <div style:margin-top="20px">
      <CollapsableSection
        title="Convocazioni"
      >
        <LinkButton
          on:click={selectAll}
        >Seleziona tutti</LinkButton>
        <TeammatesChecklist
          bind:value={convocations}
          bind:teammates={teammates}
          onlyConvocables={true}
        ></TeammatesChecklist>
      </CollapsableSection>
    </div>
  {/if}
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
