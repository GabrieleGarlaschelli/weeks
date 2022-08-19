<script lang="ts" context="module">
  export type Role = {
    name?: string,
    team?: { id: number }
  }
</script>

<script lang="ts">
  import LabelAndTextfield from "../LabelAndTextfield.svelte"

  export let role: Role = {
      name: undefined,
    },
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
  <LabelAndTextfield
    label="Nome"
    name="name"
    bind:value={role.name}
  ></LabelAndTextfield>
</form>

