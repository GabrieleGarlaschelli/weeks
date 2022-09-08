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

  let startTime: string, 
    endTime: string,
    date: Date

  

  $: {
    if(!!event.start && !startTime) {
      startTime = DateTime.fromJSDate(new Date(event.start)).toFormat("HH:mm")
    }
    
    if(!!startTime && !!date) {
      event.start = DateTime.fromJSDate(date).set({
          hour: parseInt(startTime.split(':')[0]),
          minute: parseInt(startTime.split(':')[1])
        })
        .startOf('millisecond')
        .startOf('second')
        .toJSDate()
    }
  }
  $: {
    if(!!event.end && !endTime) {
      endTime = DateTime.fromJSDate(new Date(event.end)).toFormat("HH:mm")
    }
    
    if(!!endTime && !!date) {
      event.end = DateTime.fromJSDate(date).set({
          hour: parseInt(endTime.split(':')[0]),
          minute: parseInt(endTime.split(':')[1])
        })
        .startOf('millisecond')
        .startOf('second')
        .toJSDate()
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
