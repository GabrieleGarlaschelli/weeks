<script lang="ts" context="module">
  export type Event = {
    start?: Date,
    end?: Date,
    title?: string,
    description?: string,
    team?: { id: number }
  }
</script>

<script lang="ts">
  import LabelAndTextfield from "$lib/components/LabelAndTextfield.svelte"
  import StandardDatepicker from "$lib/components/common/StandardDatepicker.svelte";

  export let event: Event = { },
    mode: 'create' | 'update' = 'create',
    padding: string | undefined = undefined,
    margin: string | undefined = undefined,
    width: string | undefined = undefined,
    height: string | undefined = undefined
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
      ></StandardDatepicker>
    </div>
  </div>
  <LabelAndTextfield
    label="Titolo"
    name="title"
    bind:value={event.title}
  ></LabelAndTextfield>
</form>


<style>
  .duration-infos {
    display: flex;
  }
</style>
